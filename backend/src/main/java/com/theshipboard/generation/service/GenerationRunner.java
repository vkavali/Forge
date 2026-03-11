package com.theshipboard.generation.service;

import com.theshipboard.assembler.AssembledCode;
import com.theshipboard.assembler.CodeAssemblerRouter;
import com.theshipboard.assembler.CodeFile;
import com.theshipboard.compiler.CompileResult;
import com.theshipboard.compiler.CompileService;
import com.theshipboard.compiler.ErrorPatcher;
import com.theshipboard.enrichment.*;
import com.theshipboard.generation.entity.GenerationJob;
import com.theshipboard.generation.repository.GenerationJobRepository;
import com.theshipboard.intent.IntentExtractionService;
import com.theshipboard.intent.IntentModel;
import com.theshipboard.project.entity.Project;
import com.theshipboard.project.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GenerationRunner {

    private static final Logger log = LoggerFactory.getLogger(GenerationRunner.class);

    private final GenerationJobRepository jobRepository;
    private final ProjectService projectService;
    private final IntentExtractionService intentService;
    private final CodeAssemblerRouter assemblerRouter;
    private final CompileService compileService;
    private final ErrorPatcher errorPatcher;
    private final DocsEnrichmentService docsService;
    private final BomEnrichmentService bomService;
    private final ReadmeEnrichmentService readmeService;
    private final AnnotationService annotationService;
    private final ConceptGuideService conceptGuideService;
    private final BuildGuideService buildGuideService;
    private final StorageService storageService;
    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    public GenerationRunner(GenerationJobRepository jobRepository, ProjectService projectService,
                            IntentExtractionService intentService, CodeAssemblerRouter assemblerRouter,
                            CompileService compileService, ErrorPatcher errorPatcher,
                            DocsEnrichmentService docsService, BomEnrichmentService bomService,
                            ReadmeEnrichmentService readmeService, AnnotationService annotationService,
                            ConceptGuideService conceptGuideService, BuildGuideService buildGuideService,
                            StorageService storageService) {
        this.jobRepository = jobRepository;
        this.projectService = projectService;
        this.intentService = intentService;
        this.assemblerRouter = assemblerRouter;
        this.compileService = compileService;
        this.errorPatcher = errorPatcher;
        this.docsService = docsService;
        this.bomService = bomService;
        this.readmeService = readmeService;
        this.annotationService = annotationService;
        this.conceptGuideService = conceptGuideService;
        this.buildGuideService = buildGuideService;
        this.storageService = storageService;
    }

    public SseEmitter subscribe(UUID jobId) {
        SseEmitter emitter = new SseEmitter(600_000L);
        emitters.put(jobId, emitter);
        emitter.onCompletion(() -> emitters.remove(jobId));
        emitter.onTimeout(() -> emitters.remove(jobId));
        emitter.onError(e -> emitters.remove(jobId));
        return emitter;
    }

    @Async("generationExecutor")
    public void runGeneration(UUID jobId, Project project) {
        GenerationJob job = jobRepository.findById(jobId).orElseThrow();
        job.setStatus("RUNNING");
        job.setStartedAt(Instant.now());
        jobRepository.save(job);

        List<String> artifactKeys = new ArrayList<>();
        String basePath = String.format("%s/%s", project.getId(), jobId);

        try {
            // === LAYER 1: AI Intent Extraction ===
            updateProgress(job, jobId, 1, "Layer 1: Extracting intent from description...", 5);
            IntentModel intent = intentService.extract(project);
            projectService.updateIntentModel(project.getId(), intentService.toMap(intent));
            sendEvent(jobId, "layer", Map.of("layer", 1, "status", "complete", "message", "Intent extracted"));
            updateProgress(job, jobId, 1, "Layer 1: Intent extraction complete", 20);

            // === LAYER 2: Deterministic Code Assembly ===
            updateProgress(job, jobId, 2, "Layer 2: Assembling code from templates...", 25);
            AssembledCode code = assemblerRouter.route(project.getCategory()).assemble(intent);

            // Education mode: annotate code
            if (Boolean.TRUE.equals(project.getEducationMode())) {
                code = annotationService.annotate(code, project.getEducationLevel());
            }

            // Upload code files
            for (CodeFile file : code.getFiles()) {
                String key = basePath + "/" + file.getFilename();
                storageService.upload(key, file.getContent(), file.getContentType());
                artifactKeys.add(key);
            }
            sendEvent(jobId, "layer", Map.of("layer", 2, "status", "complete", "message", "Code assembled", "fileCount", code.getFiles().size()));
            updateProgress(job, jobId, 2, "Layer 2: Code assembly complete", 45);

            // === LAYER 3: Compile Verification ===
            updateProgress(job, jobId, 3, "Layer 3: Verifying compilation...", 50);
            CompileResult compileResult = compileService.compile(code);

            if (!compileResult.isSuccess() && compileResult.getErrors() != null && !compileResult.getErrors().isEmpty()) {
                sendEvent(jobId, "layer", Map.of("layer", 3, "status", "patching", "message", "Compilation failed, patching..."));
                code = errorPatcher.attemptPatch(code, compileResult);
                compileResult = compileService.compile(code);

                // Re-upload patched files
                artifactKeys.clear();
                for (CodeFile file : code.getFiles()) {
                    String key = basePath + "/" + file.getFilename();
                    storageService.upload(key, file.getContent(), file.getContentType());
                    artifactKeys.add(key);
                }
            }

            job.setCompileSuccess(compileResult.isSuccess());
            job.setCompileLog(compileResult.getLog());
            sendEvent(jobId, "layer", Map.of("layer", 3, "status", "complete", "success", compileResult.isSuccess()));
            updateProgress(job, jobId, 3, "Layer 3: Compile verification complete", 60);

            // === LAYER 4: AI Enrichment ===
            updateProgress(job, jobId, 4, "Layer 4: Generating documentation...", 65);
            String docs = docsService.generate(project, intent, code);
            String docsKey = basePath + "/docs.md";
            storageService.upload(docsKey, docs, "text/markdown");
            artifactKeys.add(docsKey);

            updateProgress(job, jobId, 4, "Layer 4: Generating BOM...", 75);
            String bom = bomService.generate(project, intent);
            String bomKey = basePath + "/bom.csv";
            storageService.upload(bomKey, bom, "text/csv");
            artifactKeys.add(bomKey);

            updateProgress(job, jobId, 4, "Layer 4: Generating README...", 85);
            String readme = readmeService.generate(project, intent, code);
            String readmeKey = basePath + "/README.md";
            storageService.upload(readmeKey, readme, "text/markdown");
            artifactKeys.add(readmeKey);

            // Education extras
            if (Boolean.TRUE.equals(project.getEducationMode())) {
                updateProgress(job, jobId, 4, "Layer 4: Generating education materials...", 90);

                String conceptGuide = conceptGuideService.generate(intent, project.getEducationLevel(), project.getSubjectArea());
                String conceptKey = basePath + "/concept-guide.md";
                storageService.upload(conceptKey, conceptGuide, "text/markdown");
                artifactKeys.add(conceptKey);

                String buildGuide = buildGuideService.generate(project, intent, project.getEducationLevel());
                String buildKey = basePath + "/build-guide.md";
                storageService.upload(buildKey, buildGuide, "text/markdown");
                artifactKeys.add(buildKey);
            }

            sendEvent(jobId, "layer", Map.of("layer", 4, "status", "complete", "message", "All documentation generated"));

            // === COMPLETE ===
            job.setStatus("COMPLETED");
            job.setProgress(100);
            job.setCurrentStep("Complete");
            job.setCurrentLayer(4);
            job.setArtifactKeys(artifactKeys);
            job.setCompletedAt(Instant.now());
            jobRepository.save(job);
            projectService.updateStatus(project.getId(), "GENERATED");
            sendEvent(jobId, "complete", Map.of("artifactKeys", artifactKeys, "compileSuccess", compileResult.isSuccess()));

        } catch (Exception e) {
            log.error("Generation failed for job {}", jobId, e);
            job.setStatus("FAILED");
            job.setErrorMessage(e.getMessage());
            job.setCompletedAt(Instant.now());
            jobRepository.save(job);
            sendEvent(jobId, "error", Map.of("message", e.getMessage() != null ? e.getMessage() : "Unknown error"));
        }
    }

    private void updateProgress(GenerationJob job, UUID jobId, int layer, String step, int progress) {
        job.setCurrentLayer(layer);
        job.setCurrentStep(step);
        job.setProgress(progress);
        jobRepository.save(job);
        sendEvent(jobId, "progress", Map.of("layer", layer, "step", step, "progress", progress));
    }

    private void sendEvent(UUID jobId, String eventType, Map<String, Object> data) {
        SseEmitter emitter = emitters.get(jobId);
        if (emitter != null) {
            try { emitter.send(SseEmitter.event().name(eventType).data(data)); }
            catch (IOException e) { emitters.remove(jobId); }
        }
    }

    public String getArtifactContent(String key) {
        return storageService.download(key);
    }
}
