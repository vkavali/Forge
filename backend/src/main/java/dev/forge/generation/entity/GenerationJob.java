package dev.forge.generation.entity;

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

    @Column(name = "current_step")
    private String currentStep;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "artifact_keys", columnDefinition = "jsonb")
    @Builder.Default
    private List<String> artifactKeys = List.of();

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @CreationTimestamp
    @Column(name = "created_at")
    private Instant createdAt;
}
