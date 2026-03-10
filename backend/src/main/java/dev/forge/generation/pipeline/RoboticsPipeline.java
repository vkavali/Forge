package dev.forge.generation.pipeline;

import dev.forge.catalog.DeviceCategory;
import dev.forge.project.entity.Project;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class RoboticsPipeline implements GenerationPipeline {
    @Override public DeviceCategory getCategory() { return DeviceCategory.ROBOTICS; }
    @Override public String getSystemPrompt(Project project) {
        return "You are a robotics engineer expert in ROS2, servo/stepper control, kinematics, and sensor fusion. " +
            "Generate ROS2 packages with proper node structure, launch files, URDF models, and parameter configs. " +
            "For microcontroller-based robots, generate firmware with motor driver integration and encoder reading. " +
            "Output each file with a clear filename header: === filename.ext ===";
    }
    @Override public String getUserPrompt(Project project) {
        return String.format("Generate robotics project for: Board: %s, Project: %s, Description: %s, Connections: %s, Behavior: %s. " +
            "Generate: ROS2 nodes / firmware, launch files, config, URDF if applicable",
            project.getBoardId(), project.getName(), project.getDescription(), project.getConnectionsConfig(), project.getBehaviorSpec());
    }
    @Override public Map<String, String> getAdditionalPrompts() { return Map.of(); }
}
