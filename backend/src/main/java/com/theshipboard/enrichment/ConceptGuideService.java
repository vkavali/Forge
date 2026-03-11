package com.theshipboard.enrichment;

import com.theshipboard.intent.IntentModel;
import com.theshipboard.shared.ClaudeApiService;
import org.springframework.stereotype.Service;

@Service
public class ConceptGuideService {

    private final ClaudeApiService claudeApi;

    public ConceptGuideService(ClaudeApiService claudeApi) {
        this.claudeApi = claudeApi;
    }

    public String generate(IntentModel intent, String educationLevel, String subjectArea) {
        String systemPrompt = "You are an electronics/programming educator. Write a concept guide in Markdown " +
                "explaining the key concepts used in this project at the appropriate education level.";

        String userPrompt = String.format(
                "Generate a concept guide.\nLevel: %s\nSubject: %s\nProject summary: %s\nSensors: %s\nActuators: %s\nConnectivity: %s",
                educationLevel, subjectArea, intent.getSummary(),
                intent.getSensors(), intent.getActuators(), intent.getConnectivity());

        return claudeApi.sendMessage(systemPrompt, userPrompt);
    }
}
