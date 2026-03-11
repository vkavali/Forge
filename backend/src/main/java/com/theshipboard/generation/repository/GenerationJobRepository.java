package com.theshipboard.generation.repository;

import com.theshipboard.generation.entity.GenerationJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GenerationJobRepository extends JpaRepository<GenerationJob, UUID> {
    List<GenerationJob> findByProjectIdOrderByCreatedAtDesc(UUID projectId);
    List<GenerationJob> findByStatus(String status);
}
