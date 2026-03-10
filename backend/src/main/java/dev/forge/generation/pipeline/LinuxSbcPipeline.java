package dev.forge.generation.pipeline;

import dev.forge.catalog.DeviceCategory;
import dev.forge.project.entity.Project;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class LinuxSbcPipeline implements GenerationPipeline {
    @Override public DeviceCategory getCategory() { return DeviceCategory.LINUX_SBC; }
    @Override public String getSystemPrompt(Project project) {
        return "You are an expert Linux embedded developer for Raspberry Pi, Jetson, and similar SBCs. " +
            "Generate Python/C++ applications with proper systemd services, GPIO access via gpiod/lgpio, " +
            "camera integration, Docker configs, and setup scripts. Include requirements.txt and install.sh. " +
            "Output each file with a clear filename header: === filename.ext ===";
    }
    @Override public String getUserPrompt(Project project) {
        return String.format("Generate Linux SBC application for: Board: %s, Project: %s, Description: %s, Connections: %s, Behavior: %s. " +
            "Generate: main app, systemd service, Dockerfile, setup script, requirements.txt",
            project.getBoardId(), project.getName(), project.getDescription(), project.getConnectionsConfig(), project.getBehaviorSpec());
    }
    @Override public Map<String, String> getAdditionalPrompts() { return Map.of(); }
}
