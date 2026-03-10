package dev.forge.generation.pipeline;

import dev.forge.catalog.DeviceCategory;
import dev.forge.project.entity.Project;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class MicrocontrollerPipeline implements GenerationPipeline {
    @Override public DeviceCategory getCategory() { return DeviceCategory.MICROCONTROLLER; }
    @Override public String getSystemPrompt(Project project) {
        return "You are an expert embedded systems engineer specializing in microcontroller firmware development. " +
            "You write production-quality C/C++ code for Arduino, ESP-IDF, STM32 HAL, and PlatformIO. " +
            "Generate complete, compilable firmware with proper pin definitions, initialization, main loop, and interrupt handlers. " +
            "Include platformio.ini or appropriate build configuration. Always include proper error handling and watchdog timers. " +
            "Output each file with a clear filename header: === filename.ext ===";
    }
    @Override public String getUserPrompt(Project project) {
        return String.format("Generate complete firmware for: Board: %s, Project: %s, Description: %s, Connections: %s, Behavior: %s. " +
            "Generate: 1) Main firmware source file 2) platformio.ini or build config 3) Required header files 4) config.h for pin definitions",
            project.getBoardId(), project.getName(), project.getDescription(), project.getConnectionsConfig(), project.getBehaviorSpec());
    }
    @Override public Map<String, String> getAdditionalPrompts() { return Map.of(); }
}
