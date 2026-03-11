package com.theshipboard.education.repository;

import com.theshipboard.education.entity.ClassroomAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ClassroomAssignmentRepository extends JpaRepository<ClassroomAssignment, UUID> {
    List<ClassroomAssignment> findByClassroomIdOrderByCreatedAtDesc(UUID classroomId);
}
