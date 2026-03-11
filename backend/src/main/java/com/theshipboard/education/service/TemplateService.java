package com.theshipboard.education.service;

import com.theshipboard.education.entity.ProjectTemplate;
import com.theshipboard.education.repository.ProjectTemplateRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TemplateService {
    private final ProjectTemplateRepository templateRepository;

    public TemplateService(ProjectTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    public List<ProjectTemplate> getPublicTemplates() {
        return templateRepository.findByIsPublicTrueOrderByCreatedAtDesc();
    }

    public List<ProjectTemplate> getByCategory(String category) {
        return templateRepository.findByCategoryAndIsPublicTrue(category);
    }

    public List<ProjectTemplate> getByDifficulty(String level) {
        return templateRepository.findByDifficultyLevelAndIsPublicTrue(level);
    }

    public ProjectTemplate getById(UUID id) {
        return templateRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Template not found"));
    }

    public ProjectTemplate create(ProjectTemplate template) {
        return templateRepository.save(template);
    }

    public List<ProjectTemplate> getByCreator(UUID userId) {
        return templateRepository.findByCreatedByOrderByCreatedAtDesc(userId);
    }
}
