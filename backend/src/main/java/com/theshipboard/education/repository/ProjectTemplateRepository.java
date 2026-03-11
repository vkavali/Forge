package com.theshipboard.education.repository;

import com.theshipboard.education.entity.ProjectTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProjectTemplateRepository extends JpaRepository<ProjectTemplate, UUID> {
    List<ProjectTemplate> findByIsPublicTrueOrderByCreatedAtDesc();
    List<ProjectTemplate> findByCategoryAndIsPublicTrue(String category);
    List<ProjectTemplate> findByDifficultyLevelAndIsPublicTrue(String level);
    List<ProjectTemplate> findByCreatedByOrderByCreatedAtDesc(UUID userId);
}
