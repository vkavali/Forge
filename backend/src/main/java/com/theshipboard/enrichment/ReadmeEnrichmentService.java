package com.theshipboard.enrichment;

import com.theshipboard.assembler.AssembledCode;
import com.theshipboard.assembler.CodeFile;
import com.theshipboard.intent.IntentModel;
import com.theshipboard.project.entity.Project;
import com.theshipboard.shared.ClaudeApiService;
import org.springframework.stereotype.Service;

@Service
public class ReadmeEnrichmentService {

    private final ClaudeApiService claudeApi;

    public ReadmeEnrichmentService(ClaudeApiService claudeApi) {
        this.claudeApi = claudeApi;
    }

    public String generate(Project project, IntentModel intent, AssembledCode code) {
        String systemPrompt = "You are a technical writer. Generate a comprehensive README.md for this embedded systems project. " +
                "Include: title, badges, description, features, hardware requirements, wiring diagram (ASCII), " +
                "quick start, build instructions, configuration, troubleshooting, and license (MIT).";

        String fileList = code.getFiles().stream()
                .map(CodeFile::getFilename)
                .reduce((a, b) -> a + ", " + b).orElse("none");

        String userPrompt = String.format(
                "Generate README.md.\n\nProject: %s\nDescription: %s\nBoard: %s\nCategory: %s\nFiles: %s\nSummary: %s",
                project.getName(), project.getDescription(), project.getBoardId(),
                project.getCategory(), fileList, intent.getSummary());

        return claudeApi.sendMessage(systemPrompt, userPrompt);
    }
}
