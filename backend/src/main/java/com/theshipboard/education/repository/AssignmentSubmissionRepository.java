package com.theshipboard.education.repository;

import com.theshipboard.education.entity.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, UUID> {
    List<AssignmentSubmission> findByAssignmentIdOrderBySubmittedAtDesc(UUID assignmentId);
    List<AssignmentSubmission> findByStudentIdOrderBySubmittedAtDesc(UUID studentId);
}
