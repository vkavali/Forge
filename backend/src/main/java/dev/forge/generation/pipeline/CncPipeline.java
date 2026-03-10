package dev.forge.generation.pipeline;

import dev.forge.catalog.DeviceCategory;
import dev.forge.project.entity.Project;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class CncPipeline implements GenerationPipeline {
    @Override public DeviceCategory getCategory() { return DeviceCategory.CNC; }
    @Override public String getSystemPrompt(Project project) {
        return "You are a CNC/3D printing firmware expert specializing in GRBL, Marlin, Klipper, and FluidNC. " +
            "Generate complete configuration files with proper stepper settings, acceleration limits, homing sequences, probe configs, and machine-specific parameters. " +
            "Output each file with a clear filename header: === filename.ext ===";
    }
    @Override public String getUserPrompt(Project project) {
        return String.format("Generate CNC/3D printer config for: Board: %s, Project: %s, Description: %s, Connections: %s, Behavior: %s. " +
            "Generate: firmware config, stepper settings, macros, start/end gcode",
            project.getBoardId(), project.getName(), project.getDescription(), project.getConnectionsConfig(), project.getBehaviorSpec());
    }
    @Override public Map<String, String> getAdditionalPrompts() { return Map.of(); }
}
