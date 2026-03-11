package com.theshipboard.generation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "generation_jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerationJob {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING";

    @Column(name = "pipeline_type", nullable = false)
    private String pipelineType;

    @Builder.Default
    private Integer progress = 0;

    @Column(name = "current_step", columnDefinition = "text")
    private String currentStep;

    @Column(name = "current_layer")
    @Builder.Default
    private Integer currentLayer = 0;

    @Column(name = "compile_success")
    private Boolean compileSuccess;

    @Column(name = "compile_log", columnDefinition = "text")
    private String compileLog;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "result_content", columnDefinition = "jsonb")
    private java.util.Map<String, Object> resultContent;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "artifact_keys", columnDefinition = "jsonb")
    @Builder.Default
    private List<String> artifactKeys = List.of();

    @Column(name = "error_message", columnDefinition = "text")
    private String errorMessage;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @CreationTimestamp
    @Column(name = "created_at")
    private Instant createdAt;
}
