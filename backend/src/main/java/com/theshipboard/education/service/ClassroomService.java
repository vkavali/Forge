package com.theshipboard.education.service;

import com.theshipboard.education.entity.*;
import com.theshipboard.education.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ClassroomService {
    private final ClassroomRepository classroomRepo;
    private final ClassroomMemberRepository memberRepo;
    private final ClassroomAssignmentRepository assignmentRepo;
    private final AssignmentSubmissionRepository submissionRepo;
    private final ProjectTemplateRepository templateRepo;

    public ClassroomService(ClassroomRepository classroomRepo, ClassroomMemberRepository memberRepo,
                           ClassroomAssignmentRepository assignmentRepo, AssignmentSubmissionRepository submissionRepo,
                           ProjectTemplateRepository templateRepo) {
        this.classroomRepo = classroomRepo;
        this.memberRepo = memberRepo;
        this.assignmentRepo = assignmentRepo;
        this.submissionRepo = submissionRepo;
        this.templateRepo = templateRepo;
    }

    public void verifyTeacher(UUID classroomId, UUID userId) {
        Classroom classroom = classroomRepo.findById(classroomId)
                .orElseThrow(() -> new IllegalArgumentException("Classroom not found"));
        if (!classroom.getTeacherId().equals(userId)) {
            throw new IllegalArgumentException("Only the teacher can perform this action");
        }
    }

    public void verifyClassroomAccess(UUID classroomId, UUID userId) {
        Classroom classroom = classroomRepo.findById(classroomId)
                .orElseThrow(() -> new IllegalArgumentException("Classroom not found"));
        if (classroom.getTeacherId().equals(userId)) return;
        if (!memberRepo.existsByClassroomIdAndUserId(classroomId, userId)) {
            throw new IllegalArgumentException("You are not a member of this classroom");
        }
    }

    public void verifySubmissionsAccess(UUID assignmentId, UUID userId) {
        ClassroomAssignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found"));
        verifyTeacher(assignment.getClassroomId(), userId);
    }

    public Classroom createClassroom(UUID teacherId, String name, String description) {
        String joinCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Classroom classroom = Classroom.builder()
                .teacherId(teacherId).name(name).description(description).joinCode(joinCode).build();
        return classroomRepo.save(classroom);
    }

    public List<Classroom> getTeacherClassrooms(UUID teacherId) {
        return classroomRepo.findByTeacherIdOrderByCreatedAtDesc(teacherId);
    }

    public Classroom joinClassroom(UUID userId, String joinCode) {
        Classroom classroom = classroomRepo.findByJoinCode(joinCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid join code"));
        if (!memberRepo.existsByClassroomIdAndUserId(classroom.getId(), userId)) {
            memberRepo.save(ClassroomMember.builder().classroomId(classroom.getId()).userId(userId).role("STUDENT").build());
        }
        return classroom;
    }

    public List<Classroom> getStudentClassrooms(UUID userId) {
        return memberRepo.findByUserId(userId).stream()
                .map(m -> classroomRepo.findById(m.getClassroomId()).orElse(null))
                .filter(java.util.Objects::nonNull).toList();
    }

    public List<ClassroomMember> getMembers(UUID classroomId) {
        return memberRepo.findByClassroomId(classroomId);
    }

    public ClassroomAssignment createAssignment(UUID classroomId, UUID templateId, String title, String instructions) {
        if (templateId != null) {
            templateRepo.findById(templateId)
                    .orElseThrow(() -> new IllegalArgumentException("Template not found: " + templateId));
        }
        return assignmentRepo.save(ClassroomAssignment.builder()
                .classroomId(classroomId).templateId(templateId).title(title).instructions(instructions).build());
    }

    public List<ClassroomAssignment> getAssignments(UUID classroomId) {
        return assignmentRepo.findByClassroomIdOrderByCreatedAtDesc(classroomId);
    }

    public AssignmentSubmission submitAssignment(UUID assignmentId, UUID studentId, UUID projectId) {
        return submissionRepo.save(AssignmentSubmission.builder()
                .assignmentId(assignmentId).studentId(studentId).projectId(projectId).build());
    }

    public List<AssignmentSubmission> getSubmissions(UUID assignmentId) {
        return submissionRepo.findByAssignmentIdOrderBySubmittedAtDesc(assignmentId);
    }
}
