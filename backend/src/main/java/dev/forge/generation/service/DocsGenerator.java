package dev.forge.generation.service;

import dev.forge.project.entity.Project;
import dev.forge.shared.ClaudeApiService;
import org.springframework.stereotype.Component;

@Component
public class DocsGenerator {
    private final ClaudeApiService claudeApi;
    public DocsGenerator(ClaudeApiService claudeApi) { this.claudeApi = claudeApi; }

    public String generate(Project project) {
        String systemPrompt = "You are a technical documentation writer for hardware projects. " +
            "Generate comprehensive project documentation in Markdown format including: " +
            "Project overview, hardware requirements, wiring diagram (ASCII art), software dependencies, " +
            "configuration guide, usage instructions, and troubleshooting guide.";
        String userPrompt = String.format("Generate documentation for project '%s' using %s board. Category: %s. Description: %s. Connections: %s. Behavior: %s",
            project.getName(), project.getBoardId(), project.getCategory(), project.getDescription(), project.getConnectionsConfig(), project.getBehaviorSpec());
        return claudeApi.sendMessage(systemPrompt, userPrompt);
    }
}
