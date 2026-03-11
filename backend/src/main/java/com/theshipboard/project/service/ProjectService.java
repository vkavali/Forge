package com.theshipboard.project.service;

import com.theshipboard.project.dto.CreateProjectRequest;
import com.theshipboard.project.dto.ProjectResponse;
import com.theshipboard.project.entity.Project;
import com.theshipboard.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public ProjectResponse create(UUID userId, CreateProjectRequest request) {
        Project project = Project.builder()
                .userId(userId).name(request.getName()).description(request.getDescription())
                .category(request.getCategory()).boardId(request.getBoardId())
                .connectionsConfig(request.getConnectionsConfig()).behaviorSpec(request.getBehaviorSpec())
                .extraConfig(request.getExtraConfig())
                .educationMode(request.getEducationMode() != null ? request.getEducationMode() : false)
                .educationLevel(request.getEducationLevel())
                .subjectArea(request.getSubjectArea())
                .build();
        return ProjectResponse.from(projectRepository.save(project));
    }

    public List<ProjectResponse> getUserProjects(UUID userId) {
        return projectRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(ProjectResponse::from).toList();
    }

    public ProjectResponse getProject(UUID projectId, UUID userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        if (!project.getUserId().equals(userId)) throw new IllegalArgumentException("Access denied");
        return ProjectResponse.from(project);
    }

    public Project getProjectEntity(UUID projectId, UUID userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        if (!project.getUserId().equals(userId)) throw new IllegalArgumentException("Access denied");
        return project;
    }

    public void updateStatus(UUID projectId, String status) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        project.setStatus(status);
        projectRepository.save(project);
    }

    public void updateIntentModel(UUID projectId, Map<String, Object> intentModel) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        project.setIntentModel(intentModel);
        projectRepository.save(project);
    }
}
