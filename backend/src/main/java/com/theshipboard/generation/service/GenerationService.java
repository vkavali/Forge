package com.theshipboard.generation.service;

import com.theshipboard.generation.entity.GenerationJob;
import com.theshipboard.generation.repository.GenerationJobRepository;
import com.theshipboard.project.entity.Project;
import com.theshipboard.project.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.Instant;
import java.util.*;

@Service
public class GenerationService {

    private static final Logger log = LoggerFactory.getLogger(GenerationService.class);

    private final GenerationJobRepository jobRepository;
    private final ProjectService projectService;
    private final GenerationRunner generationRunner;

    public GenerationService(GenerationJobRepository jobRepository, ProjectService projectService,
                             GenerationRunner generationRunner) {
        this.jobRepository = jobRepository;
        this.projectService = projectService;
        this.generationRunner = generationRunner;
    }

    @PostConstruct
    public void cleanupStaleJobs() {
        List<GenerationJob> stale = jobRepository.findByStatus("RUNNING");
        stale.addAll(jobRepository.findByStatus("PENDING"));
        for (GenerationJob job : stale) {
            job.setStatus("FAILED");
            job.setErrorMessage("Server restarted during generation");
            job.setCompletedAt(Instant.now());
            jobRepository.save(job);
        }
        if (!stale.isEmpty()) {
            log.info("Cleaned up {} stale jobs on startup", stale.size());
        }
    }

    public GenerationJob startGeneration(UUID projectId, UUID userId) {
        Project project = projectService.getProjectEntity(projectId, userId);
        GenerationJob job = GenerationJob.builder()
                .projectId(projectId).pipelineType(project.getCategory()).status("PENDING").build();
        job = jobRepository.save(job);
        // Call through the Spring proxy bean so @Async is respected
        generationRunner.runGeneration(job.getId(), project);
        return job;
    }

    public SseEmitter subscribe(UUID jobId) {
        return generationRunner.subscribe(jobId);
    }

    public List<GenerationJob> getJobsByProject(UUID projectId) {
        return jobRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    public GenerationJob getJob(UUID jobId) {
        return jobRepository.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Job not found"));
    }

    public String getArtifactContent(UUID jobId, String key, UUID userId) {
        return generationRunner.getArtifactContent(key);
    }
}
