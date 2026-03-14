package com.theshipboard.education.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "project_templates")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectTemplate {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    private String description;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;

    @NotBlank(message = "Board ID is required")
    @Column(name = "board_id", nullable = false)
    private String boardId;

    @Column(name = "difficulty_level")
    private String difficultyLevel;

    @Column(name = "subject_area")
    private String subjectArea;

    @Column(name = "behavior_spec", columnDefinition = "text")
    private String behaviorSpec;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "connections_config", columnDefinition = "jsonb")
    private Map<String, Object> connectionsConfig;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "learning_objectives", columnDefinition = "jsonb")
    private java.util.List<String> learningObjectives;

    @Column(name = "estimated_minutes")
    private Integer estimatedMinutes;

    @Builder.Default
    @Column(name = "is_public")
    private Boolean isPublic = true;

    @Column(name = "created_by")
    private UUID createdBy;

    @CreationTimestamp
    @Column(name = "created_at")
    private Instant createdAt;
}
