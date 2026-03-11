package com.theshipboard.project.controller;

import com.theshipboard.project.dto.CreateProjectRequest;
import com.theshipboard.project.dto.ProjectResponse;
import com.theshipboard.project.service.ProjectService;
import com.theshipboard.shared.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> create(
            Authentication auth, @Valid @RequestBody CreateProjectRequest request) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok("Project created", projectService.create(userId, request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> list(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(projectService.getUserProjects(userId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> get(Authentication auth, @PathVariable UUID id) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(projectService.getProject(id, userId)));
    }
}
