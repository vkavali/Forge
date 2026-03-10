package dev.forge.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Map;

@Data
public class CreateProjectRequest {
    @NotBlank
    private String name;
    private String description;
    @NotBlank
    private String category;
    @NotBlank
    private String boardId;
    private Map<String, Object> connectionsConfig;
    private String behaviorSpec;
    private Map<String, Object> extraConfig;
}
