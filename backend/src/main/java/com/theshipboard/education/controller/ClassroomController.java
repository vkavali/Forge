package com.theshipboard.education.controller;

import com.theshipboard.education.entity.*;
import com.theshipboard.education.service.ClassroomService;
import com.theshipboard.shared.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/classrooms")
public class ClassroomController {
    private final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Classroom>> create(Authentication auth, @RequestBody Map<String, String> body) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok("Classroom created",
                classroomService.createClassroom(userId, body.get("name"), body.get("description"))));
    }

    @GetMapping("/teaching")
    public ResponseEntity<ApiResponse<List<Classroom>>> teaching(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(classroomService.getTeacherClassrooms(userId)));
    }

    @GetMapping("/enrolled")
    public ResponseEntity<ApiResponse<List<Classroom>>> enrolled(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok(classroomService.getStudentClassrooms(userId)));
    }

    @PostMapping("/join")
    public ResponseEntity<ApiResponse<Classroom>> join(Authentication auth, @RequestBody Map<String, String> body) {
        UUID userId = (UUID) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.ok("Joined classroom",
                classroomService.joinClassroom(userId, body.get("joinCode"))));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<ApiResponse<List<ClassroomMember>>> members(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(classroomService.getMembers(id)));
    }

    @PostMapping("/{id}/assignments")
    public ResponseEntity<ApiResponse<ClassroomAssignment>> createAssignment(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        UUID templateId = body.get("templateId") != null ? UUID.fromString(body.get("templateId")) : null;
        return ResponseEntity.ok(ApiResponse.ok("Assignment created",
                classroomService.createAssignment(id, templateId, body.get("title"), body.get("instructions"))));
    }

    @GetMapping("/{id}/assignments")
    public ResponseEntity<ApiResponse<List<ClassroomAssignment>>> assignments(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(classroomService.getAssignments(id)));
    }

    @PostMapping("/assignments/{assignmentId}/submit")
    public ResponseEntity<ApiResponse<AssignmentSubmission>> submit(Authentication auth,
            @PathVariable UUID assignmentId, @RequestBody Map<String, String> body) {
        UUID userId = (UUID) auth.getPrincipal();
        UUID projectId = UUID.fromString(body.get("projectId"));
        return ResponseEntity.ok(ApiResponse.ok("Submitted",
                classroomService.submitAssignment(assignmentId, userId, projectId)));
    }

    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<ApiResponse<List<AssignmentSubmission>>> submissions(@PathVariable UUID assignmentId) {
        return ResponseEntity.ok(ApiResponse.ok(classroomService.getSubmissions(assignmentId)));
    }
}
