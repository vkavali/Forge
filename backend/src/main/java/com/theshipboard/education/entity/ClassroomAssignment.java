package com.theshipboard.education.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "classroom_assignments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClassroomAssignment {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "classroom_id", nullable = false)
    private UUID classroomId;

    @Column(name = "template_id")
    private UUID templateId;

    @Column(nullable = false)
    private String title;

    private String instructions;

    @Column(name = "due_date")
    private Instant dueDate;

    @CreationTimestamp
    @Column(name = "created_at")
    private Instant createdAt;
}
