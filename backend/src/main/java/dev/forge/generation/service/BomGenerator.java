package dev.forge.generation.service;

import dev.forge.project.entity.Project;
import dev.forge.shared.ClaudeApiService;
import org.springframework.stereotype.Component;

@Component
public class BomGenerator {
    private final ClaudeApiService claudeApi;
    public BomGenerator(ClaudeApiService claudeApi) { this.claudeApi = claudeApi; }

    public String generate(Project project) {
        String systemPrompt = "You are a hardware BOM (Bill of Materials) specialist. " +
            "Generate a detailed BOM in CSV format with columns: Item,Quantity,Description,Manufacturer,Part Number,Supplier,Estimated Cost (USD),Link. " +
            "Include the main board, all required components, cables, connectors, and optional accessories. End with a total estimated cost line.";
        String userPrompt = String.format("Generate BOM for project '%s' using %s board. Category: %s. Connections: %s. Behavior: %s",
            project.getName(), project.getBoardId(), project.getCategory(), project.getConnectionsConfig(), project.getBehaviorSpec());
        return claudeApi.sendMessage(systemPrompt, userPrompt);
    }
}
