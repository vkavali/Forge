package dev.forge.generation.service;

import dev.forge.project.entity.Project;
import dev.forge.shared.ClaudeApiService;
import org.springframework.stereotype.Component;

@Component
public class ReadmeGenerator {
    private final ClaudeApiService claudeApi;
    public ReadmeGenerator(ClaudeApiService claudeApi) { this.claudeApi = claudeApi; }

    public String generate(Project project) {
        String systemPrompt = "You are a developer advocate writing README.md files for hardware projects. " +
            "Generate a polished GitHub-style README with badges, project title, description, features list, " +
            "quick start guide, hardware photo placeholder, license section, and contributing guidelines.";
        String userPrompt = String.format("Generate README.md for project '%s' using %s. Category: %s. Description: %s",
            project.getName(), project.getBoardId(), project.getCategory(), project.getDescription());
        return claudeApi.sendMessage(systemPrompt, userPrompt);
    }
}
