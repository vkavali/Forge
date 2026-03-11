package com.theshipboard.project.dto;

import com.theshipboard.project.entity.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private UUID id;
    private String name;
    private String description;
    private String category;
    private String boardId;
    private Map<String, Object> connectionsConfig;
    private String behaviorSpec;
    private Map<String, Object> extraConfig;
    private Map<String, Object> intentModel;
    private Boolean educationMode;
    private String educationLevel;
    private String subjectArea;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;

    public static ProjectResponse from(Project p) {
        return ProjectResponse.builder()
                .id(p.getId()).name(p.getName()).description(p.getDescription())
                .category(p.getCategory()).boardId(p.getBoardId())
                .connectionsConfig(p.getConnectionsConfig()).behaviorSpec(p.getBehaviorSpec())
                .extraConfig(p.getExtraConfig()).intentModel(p.getIntentModel())
                .educationMode(p.getEducationMode()).educationLevel(p.getEducationLevel())
                .subjectArea(p.getSubjectArea()).status(p.getStatus())
                .createdAt(p.getCreatedAt()).updatedAt(p.getUpdatedAt()).build();
    }
}
