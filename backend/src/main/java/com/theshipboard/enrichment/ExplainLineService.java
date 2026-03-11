package com.theshipboard.enrichment;

import com.theshipboard.shared.ClaudeApiService;
import org.springframework.stereotype.Service;

@Service
public class ExplainLineService {

    private final ClaudeApiService claudeApi;

    public ExplainLineService(ClaudeApiService claudeApi) {
        this.claudeApi = claudeApi;
    }

    public String explain(String codeLine, String context, String educationLevel) {
        String systemPrompt = "You are a coding tutor. Explain the given line of code in simple terms " +
                "appropriate for the student's level. Be concise but thorough.";

        String userPrompt = String.format(
                "Explain this line of code:\n```\n%s\n```\n\nContext (surrounding code):\n```\n%s\n```\n\nStudent level: %s",
                codeLine, context, educationLevel);

        return claudeApi.sendMessage(systemPrompt, userPrompt);
    }
}
