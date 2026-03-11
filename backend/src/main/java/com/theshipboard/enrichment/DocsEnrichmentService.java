package com.theshipboard.enrichment;

import com.theshipboard.assembler.AssembledCode;
import com.theshipboard.assembler.CodeFile;
import com.theshipboard.intent.IntentModel;
import com.theshipboard.project.entity.Project;
import com.theshipboard.shared.ClaudeApiService;
import org.springframework.stereotype.Service;

@Service
public class DocsEnrichmentService {

    private final ClaudeApiService claudeApi;

    public DocsEnrichmentService(ClaudeApiService claudeApi) {
        this.claudeApi = claudeApi;
    }

    public String generate(Project project, IntentModel intent, AssembledCode code) {
        String mainCode = code.getFiles().stream()
                .filter(f -> f.getFilename().contains("main"))
                .findFirst().map(CodeFile::getContent).orElse("(no main file)");

        String systemPrompt = "You are a technical documentation writer for embedded systems projects. " +
                "Write clear, comprehensive documentation in Markdown. Include: project overview, hardware requirements, " +
                "pin connections, software architecture, setup instructions, and API reference if applicable.";

        String userPrompt = String.format(
                "Write documentation for this project.\n\nProject: %s\nBoard: %s\nCategory: %s\nDescription: %s\n\nMain code:\n```\n%s\n```\n\nSensors: %s\nActuators: %s",
                project.getName(), project.getBoardId(), project.getCategory(), project.getDescription(),
                mainCode,
                intent.getSensors() != null ? intent.getSensors().toString() : "none",
                intent.getActuators() != null ? intent.getActuators().toString() : "none");

        return claudeApi.sendMessage(systemPrompt, userPrompt);
    }
}
