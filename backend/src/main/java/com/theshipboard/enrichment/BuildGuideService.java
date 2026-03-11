package com.theshipboard.enrichment;

import com.theshipboard.assembler.AssembledCode;
import com.theshipboard.intent.IntentModel;
import com.theshipboard.project.entity.Project;
import com.theshipboard.shared.ClaudeApiService;
import org.springframework.stereotype.Service;

@Service
public class BuildGuideService {

    private final ClaudeApiService claudeApi;

    public BuildGuideService(ClaudeApiService claudeApi) {
        this.claudeApi = claudeApi;
    }

    public String generate(Project project, IntentModel intent, String educationLevel) {
        String systemPrompt = "You are a maker/electronics instructor. Write a step-by-step build guide in Markdown. " +
                "Include: parts checklist, wiring steps with pin references, software upload instructions, testing steps, " +
                "and common mistakes to avoid. Target the appropriate education level.";

        String userPrompt = String.format(
                "Generate a build guide.\nProject: %s\nBoard: %s\nLevel: %s\nSensors: %s\nActuators: %s",
                project.getName(), project.getBoardId(), educationLevel,
                intent.getSensors(), intent.getActuators());

        return claudeApi.sendMessage(systemPrompt, userPrompt);
    }
}
