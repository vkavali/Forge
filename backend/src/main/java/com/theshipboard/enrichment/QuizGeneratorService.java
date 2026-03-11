package com.theshipboard.enrichment;

import com.theshipboard.intent.IntentModel;
import com.theshipboard.shared.ClaudeApiService;
import org.springframework.stereotype.Service;

@Service
public class QuizGeneratorService {

    private final ClaudeApiService claudeApi;

    public QuizGeneratorService(ClaudeApiService claudeApi) {
        this.claudeApi = claudeApi;
    }

    public String generate(IntentModel intent, String educationLevel) {
        String systemPrompt = "You are an electronics/programming quiz creator. Generate a quiz in JSON format with " +
                "10 multiple-choice questions about the concepts used in this project. Each question has: " +
                "question, options (A-D), correctAnswer, explanation.";

        String userPrompt = String.format(
                "Generate quiz.\nLevel: %s\nProject: %s\nSensors: %s\nActuators: %s\nConnectivity: %s",
                educationLevel, intent.getSummary(), intent.getSensors(), intent.getActuators(), intent.getConnectivity());

        return claudeApi.sendJsonMessage(systemPrompt, userPrompt);
    }
}
