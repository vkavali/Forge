package dev.forge.generation.service;

import dev.forge.generation.entity.GenerationJob;
import dev.forge.generation.pipeline.GenerationPipeline;
import dev.forge.generation.pipeline.PipelineRouter;
import dev.forge.generation.repository.GenerationJobRepository;
import dev.forge.project.entity.Project;
import dev.forge.project.service.ProjectService;
import dev.forge.shared.ClaudeApiService;
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
public class GenerationService {

    private static final Logger log = LoggerFactory.getLogger(GenerationService.class);
    private final GenerationJobRepository jobRepository;
    private final ProjectService projectService;
    private final PipelineRouter pipelineRouter;
    private final ClaudeApiService claudeApi;
    private final MinioStorageService storageService;
    private final DocsGenerator docsGenerator;
    private final BomGenerator bomGenerator;
    private final ReadmeGenerator readmeGenerator;
    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    public GenerationService(GenerationJobRepository jobRepository, ProjectService projectService,
                             PipelineRouter pipelineRouter, ClaudeApiService claudeApi,
                             MinioStorageService storageService, DocsGenerator docsGenerator,
                             BomGenerator bomGenerator, ReadmeGenerator readmeGenerator) {
        this.jobRepository = jobRepository;
        this.projectService = projectService;
        this.pipelineRouter = pipelineRouter;
        this.claudeApi = claudeApi;
        this.storageService = storageService;
        this.docsGenerator = docsGenerator;
        this.bomGenerator = bomGenerator;
        this.readmeGenerator = readmeGenerator;
    }

    public GenerationJob startGeneration(UUID projectId, UUID userId) {
        Project project = projectService.getProjectEntity(projectId, userId);
        GenerationJob job = GenerationJob.builder()
                .projectId(projectId).pipelineType(project.getCategory()).status("PENDING").build();
        job = jobRepository.save(job);
        runGeneration(job.getId(), project);
        return job;
    }

    public SseEmitter subscribe(UUID jobId) {
        SseEmitter emitter = new SseEmitter(300_000L);
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
            sendEvent(jobId, "progress", Map.of("step", "Generating code...", "progress", 10));
            job.setCurrentStep("Generating code");
            job.setProgress(10);
            jobRepository.save(job);

            GenerationPipeline pipeline = pipelineRouter.route(project.getCategory());
            String code = claudeApi.sendMessage(pipeline.getSystemPrompt(project), pipeline.getUserPrompt(project));
            String codeKey = basePath + "/code.txt";
            storageService.upload(codeKey, code, "text/plain");
            artifactKeys.add(codeKey);

            sendEvent(jobId, "progress", Map.of("step", "Generating documentation...", "progress", 40));
            job.setCurrentStep("Generating documentation");
            job.setProgress(40);
            jobRepository.save(job);

            String docs = docsGenerator.generate(project);
            String docsKey = basePath + "/docs.md";
            storageService.upload(docsKey, docs, "text/markdown");
            artifactKeys.add(docsKey);

            sendEvent(jobId, "progress", Map.of("step", "Generating BOM...", "progress", 65));
            job.setCurrentStep("Generating BOM");
            job.setProgress(65);
            jobRepository.save(job);

            String bom = bomGenerator.generate(project);
            String bomKey = basePath + "/bom.csv";
            storageService.upload(bomKey, bom, "text/csv");
            artifactKeys.add(bomKey);

            sendEvent(jobId, "progress", Map.of("step", "Generating README...", "progress", 85));
            job.setCurrentStep("Generating README");
            job.setProgress(85);
            jobRepository.save(job);

            String readme = readmeGenerator.generate(project);
            String readmeKey = basePath + "/README.md";
            storageService.upload(readmeKey, readme, "text/markdown");
            artifactKeys.add(readmeKey);

            job.setStatus("COMPLETED");
            job.setProgress(100);
            job.setCurrentStep("Complete");
            job.setArtifactKeys(artifactKeys);
            job.setCompletedAt(Instant.now());
            jobRepository.save(job);
            projectService.updateStatus(project.getId(), "GENERATED");
            sendEvent(jobId, "complete", Map.of("artifactKeys", artifactKeys));
        } catch (Exception e) {
            log.error("Generation failed for job {}", jobId, e);
            job.setStatus("FAILED");
            job.setErrorMessage(e.getMessage());
            job.setCompletedAt(Instant.now());
            jobRepository.save(job);
            sendEvent(jobId, "error", Map.of("message", e.getMessage()));
        }
    }

    private void sendEvent(UUID jobId, String eventType, Map<String, Object> data) {
        SseEmitter emitter = emitters.get(jobId);
        if (emitter != null) {
            try { emitter.send(SseEmitter.event().name(eventType).data(data)); }
            catch (IOException e) { emitters.remove(jobId); }
        }
    }

    public List<GenerationJob> getJobsByProject(UUID projectId) {
        return jobRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    public GenerationJob getJob(UUID jobId) {
        return jobRepository.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Job not found"));
    }

    public String getArtifactContent(UUID jobId, String key, UUID userId) {
        return storageService.download(key);
    }
}
