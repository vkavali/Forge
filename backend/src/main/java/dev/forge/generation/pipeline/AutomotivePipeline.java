package dev.forge.generation.pipeline;

import dev.forge.catalog.DeviceCategory;
import dev.forge.project.entity.Project;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class AutomotivePipeline implements GenerationPipeline {
    @Override public DeviceCategory getCategory() { return DeviceCategory.AUTOMOTIVE; }
    @Override public String getSystemPrompt(Project project) {
        return "You are an automotive embedded expert specializing in CAN bus, OBD-II, and vehicle diagnostics. " +
            "Generate firmware/software for CAN bus communication, OBD-II PID reading, DTC management, and dashboard displays. " +
            "Include DBC file parsing, CAN message definitions, and proper bus timing. " +
            "Output each file with a clear filename header: === filename.ext ===";
    }
    @Override public String getUserPrompt(Project project) {
        return String.format("Generate automotive project for: Board: %s, Project: %s, Description: %s, Connections: %s, Behavior: %s. " +
            "Generate: firmware, CAN config/DBC, OBD PID definitions, dashboard logic",
            project.getBoardId(), project.getName(), project.getDescription(), project.getConnectionsConfig(), project.getBehaviorSpec());
    }
    @Override public Map<String, String> getAdditionalPrompts() { return Map.of(); }
}
