package dev.forge.generation.pipeline;

import dev.forge.catalog.DeviceCategory;
import dev.forge.project.entity.Project;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class IndustrialPipeline implements GenerationPipeline {
    @Override public DeviceCategory getCategory() { return DeviceCategory.INDUSTRIAL; }
    @Override public String getSystemPrompt(Project project) {
        return "You are an industrial automation expert specializing in Modbus RTU/TCP, PLC programming, 4-20mA analog I/O, " +
            "RS-485 communication, and SCADA integration. Generate code for industrial gateways, PLC logic, HMI definitions, " +
            "and protocol converters. Follow IEC standards. " +
            "Output each file with a clear filename header: === filename.ext ===";
    }
    @Override public String getUserPrompt(Project project) {
        return String.format("Generate industrial automation project for: Board: %s, Project: %s, Description: %s, Connections: %s, Behavior: %s. " +
            "Generate: firmware/PLC code, Modbus register map, I/O config, HMI layout",
            project.getBoardId(), project.getName(), project.getDescription(), project.getConnectionsConfig(), project.getBehaviorSpec());
    }
    @Override public Map<String, String> getAdditionalPrompts() { return Map.of(); }
}
