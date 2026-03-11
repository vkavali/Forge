package com.theshipboard.generation.controller;

import com.theshipboard.generation.entity.GenerationJob;
import com.theshipboard.generation.service.GenerationService;
import com.theshipboard.shared.ApiResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class GenerationController {

    private final GenerationService generationService;

    public GenerationController(GenerationService generationService) {
        this.generationService = generationService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<GenerationJob>> generate(
            Authentication auth, @RequestBody Map<String, String> body) {
        UUID userId = (UUID) auth.getPrincipal();
        UUID projectId = UUID.fromString(body.get("projectId"));
        return ResponseEntity.ok(ApiResponse.ok("Generation started", generationService.startGeneration(projectId, userId)));
    }

    @GetMapping(value = "/generate/stream/{jobId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@PathVariable UUID jobId) {
        return generationService.subscribe(jobId);
    }

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<List<GenerationJob>>> getJobs(@RequestParam UUID projectId) {
        return ResponseEntity.ok(ApiResponse.ok(generationService.getJobsByProject(projectId)));
    }

    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<ApiResponse<GenerationJob>> getJob(@PathVariable UUID jobId) {
        return ResponseEntity.ok(ApiResponse.ok(generationService.getJob(jobId)));
    }

    @GetMapping("/artifacts/{jobId}")
    public ResponseEntity<ApiResponse<String>> getArtifact(
            Authentication auth, @PathVariable UUID jobId, @RequestParam String key) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(generationService.getArtifactContent(jobId, key, userId)));
    }
}
