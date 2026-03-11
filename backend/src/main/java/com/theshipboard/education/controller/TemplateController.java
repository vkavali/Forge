package com.theshipboard.education.controller;

import com.theshipboard.education.entity.ProjectTemplate;
import com.theshipboard.education.service.TemplateService;
import com.theshipboard.shared.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {
    private final TemplateService templateService;

    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<ProjectTemplate>>> listPublic(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty) {
        List<ProjectTemplate> templates;
        if (category != null) templates = templateService.getByCategory(category);
        else if (difficulty != null) templates = templateService.getByDifficulty(difficulty);
        else templates = templateService.getPublicTemplates();
        return ResponseEntity.ok(ApiResponse.ok(templates));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<ApiResponse<ProjectTemplate>> getTemplate(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(templateService.getById(id)));
    }

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<ProjectTemplate>>> myTemplates(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(templateService.getByCreator(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectTemplate>> create(Authentication auth, @RequestBody ProjectTemplate template) {
        UUID userId = (UUID) auth.getPrincipal();
        template.setCreatedBy(userId);
        return ResponseEntity.ok(ApiResponse.ok("Template created", templateService.create(template)));
    }
}
