package dev.forge.generation.pipeline;

import dev.forge.catalog.DeviceCategory;
import dev.forge.project.entity.Project;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class DronePipeline implements GenerationPipeline {
    @Override public DeviceCategory getCategory() { return DeviceCategory.DRONE; }
    @Override public String getSystemPrompt(Project project) {
        return "You are a drone/UAV flight controller expert specializing in PX4, ArduPilot, Betaflight, and iNav. " +
            "Generate parameter files, custom flight modes, MAVLink integrations, and companion computer scripts. " +
            "Include proper safety parameters, failsafe configs, and tuning recommendations. " +
            "Output each file with a clear filename header: === filename.ext ===";
    }
    @Override public String getUserPrompt(Project project) {
        return String.format("Generate drone/UAV project for: Board: %s, Project: %s, Description: %s, Connections: %s, Behavior: %s. " +
            "Generate: parameter files, custom code/scripts, config, safety checklist",
            project.getBoardId(), project.getName(), project.getDescription(), project.getConnectionsConfig(), project.getBehaviorSpec());
    }
    @Override public Map<String, String> getAdditionalPrompts() { return Map.of(); }
}
