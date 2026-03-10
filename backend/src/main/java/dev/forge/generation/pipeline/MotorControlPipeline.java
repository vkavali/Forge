package dev.forge.generation.pipeline;

import dev.forge.catalog.DeviceCategory;
import dev.forge.project.entity.Project;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class MotorControlPipeline implements GenerationPipeline {
    @Override public DeviceCategory getCategory() { return DeviceCategory.MOTOR_CONTROL; }
    @Override public String getSystemPrompt(Project project) {
        return "You are a motor control expert specializing in BLDC FOC, stepper control, H-bridge drivers, and motion control algorithms. " +
            "Generate firmware with proper PWM configuration, current sensing, encoder reading, PID tuning, and safety limits. " +
            "Support SimpleFOC, ODrive, and custom implementations. " +
            "Output each file with a clear filename header: === filename.ext ===";
    }
    @Override public String getUserPrompt(Project project) {
        return String.format("Generate motor control project for: Board: %s, Project: %s, Description: %s, Connections: %s, Behavior: %s. " +
            "Generate: firmware, motor config, PID parameters, safety limits",
            project.getBoardId(), project.getName(), project.getDescription(), project.getConnectionsConfig(), project.getBehaviorSpec());
    }
    @Override public Map<String, String> getAdditionalPrompts() { return Map.of(); }
}
