package dev.forge.generation.pipeline;

import dev.forge.catalog.DeviceCategory;
import dev.forge.project.entity.Project;

import java.util.Map;

public interface GenerationPipeline {
    DeviceCategory getCategory();
    String getSystemPrompt(Project project);
    String getUserPrompt(Project project);
    Map<String, String> getAdditionalPrompts();
}
