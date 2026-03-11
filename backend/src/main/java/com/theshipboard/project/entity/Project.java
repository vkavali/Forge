package com.theshipboard.project.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private String category;

    @Column(name = "board_id", nullable = false)
    private String boardId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "connections_config", columnDefinition = "jsonb")
    private Map<String, Object> connectionsConfig;

    @Column(name = "behavior_spec")
    private String behaviorSpec;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "extra_config", columnDefinition = "jsonb")
    private Map<String, Object> extraConfig;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "intent_model", columnDefinition = "jsonb")
    private Map<String, Object> intentModel;

    @Column(name = "education_mode")
    @Builder.Default
    private Boolean educationMode = false;

    @Column(name = "education_level")
    private String educationLevel;

    @Column(name = "subject_area")
    private String subjectArea;

    @Column(nullable = false)
    @Builder.Default
    private String status = "CREATED";

    @CreationTimestamp
    @Column(name = "created_at")
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
