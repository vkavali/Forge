package com.theshipboard.education.repository;

import com.theshipboard.education.entity.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClassroomRepository extends JpaRepository<Classroom, UUID> {
    List<Classroom> findByTeacherIdOrderByCreatedAtDesc(UUID teacherId);
    Optional<Classroom> findByJoinCode(String joinCode);
}
