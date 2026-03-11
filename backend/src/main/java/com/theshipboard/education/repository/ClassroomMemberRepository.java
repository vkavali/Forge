package com.theshipboard.education.repository;

import com.theshipboard.education.entity.ClassroomMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ClassroomMemberRepository extends JpaRepository<ClassroomMember, UUID> {
    List<ClassroomMember> findByClassroomId(UUID classroomId);
    List<ClassroomMember> findByUserId(UUID userId);
    boolean existsByClassroomIdAndUserId(UUID classroomId, UUID userId);
}
