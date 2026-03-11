package com.theshipboard.education.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "assignment_submissions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AssignmentSubmission {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "assignment_id", nullable = false)
    private UUID assignmentId;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "project_id")
    private UUID projectId;

    @Column(nullable = false)
    @Builder.Default
    private String status = "SUBMITTED";

    private String feedback;
    private Integer grade;

    @CreationTimestamp
    @Column(name = "submitted_at")
    private Instant submittedAt;
}
