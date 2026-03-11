package com.theshipboard.education.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "classroom_members")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClassroomMember {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "classroom_id", nullable = false)
    private UUID classroomId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    @Builder.Default
    private String role = "STUDENT";

    @CreationTimestamp
    @Column(name = "joined_at")
    private Instant joinedAt;
}
