package dev.forge.generation.pipeline;

import dev.forge.catalog.DeviceCategory;
import dev.forge.project.entity.Project;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class MicroPythonPipeline implements GenerationPipeline {
    @Override public DeviceCategory getCategory() { return DeviceCategory.MICROPYTHON; }
    @Override public String getSystemPrompt(Project project) {
        return "You are an expert MicroPython developer for RP2040, ESP32, and similar microcontrollers. " +
            "Generate clean, well-structured MicroPython code with proper async patterns using uasyncio. " +
            "Include boot.py, main.py, and modular library files. Handle WiFi setup, sensor drivers, and peripheral configuration. " +
            "Output each file with a clear filename header: === filename.ext ===";
    }
    @Override public String getUserPrompt(Project project) {
        return String.format("Generate MicroPython firmware for: Board: %s, Project: %s, Description: %s, Connections: %s, Behavior: %s. " +
            "Generate: boot.py, main.py, lib/ modules, and requirements.txt",
            project.getBoardId(), project.getName(), project.getDescription(), project.getConnectionsConfig(), project.getBehaviorSpec());
    }
    @Override public Map<String, String> getAdditionalPrompts() { return Map.of(); }
}
