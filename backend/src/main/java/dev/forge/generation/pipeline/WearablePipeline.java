package dev.forge.generation.pipeline;

import dev.forge.catalog.DeviceCategory;
import dev.forge.project.entity.Project;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class WearablePipeline implements GenerationPipeline {
    @Override public DeviceCategory getCategory() { return DeviceCategory.WEARABLE; }
    @Override public String getSystemPrompt(Project project) {
        return "You are a wearable/IoT expert specializing in BLE, low-power design, sensor integration, and compact firmware. " +
            "Generate power-efficient code with proper sleep modes, BLE GATT services, sensor polling, and battery management. " +
            "Support nRF SDK, ESP-IDF BLE, and Arduino BLE. " +
            "Output each file with a clear filename header: === filename.ext ===";
    }
    @Override public String getUserPrompt(Project project) {
        return String.format("Generate wearable/IoT project for: Board: %s, Project: %s, Description: %s, Connections: %s, Behavior: %s. " +
            "Generate: firmware, BLE service definitions, sensor drivers, power management config",
            project.getBoardId(), project.getName(), project.getDescription(), project.getConnectionsConfig(), project.getBehaviorSpec());
    }
    @Override public Map<String, String> getAdditionalPrompts() { return Map.of(); }
}
