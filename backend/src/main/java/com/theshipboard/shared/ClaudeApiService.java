package com.theshipboard.shared;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
public class ClaudeApiService {

    private static final Logger log = LoggerFactory.getLogger(ClaudeApiService.class);
    private static final int MAX_RETRIES = 2;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final String model;
    private final int maxTokens;
    private final String apiKey;

    public ClaudeApiService(
            @Value("${claude.api-key}") String apiKey,
            @Value("${claude.model}") String model,
            @Value("${claude.max-tokens}") int maxTokens,
            @Value("${claude.api-version:2023-06-01}") String apiVersion,
            ObjectMapper objectMapper) {
        this.apiKey = apiKey;
        this.model = model;
        this.maxTokens = maxTokens;
        this.objectMapper = objectMapper;
        this.webClient = WebClient.builder()
                .baseUrl("https://api.anthropic.com")
                .defaultHeader("x-api-key", apiKey)
                .defaultHeader("anthropic-version", apiVersion)
                .defaultHeader("content-type", "application/json")
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build();
    }

    public String sendMessage(String systemPrompt, String userMessage) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("Claude API key is not configured. Set CLAUDE_API_KEY environment variable.");
        }

        ObjectNode body = objectMapper.createObjectNode();
        body.put("model", model);
        body.put("max_tokens", maxTokens);
        body.put("system", systemPrompt);
        ArrayNode messages = body.putArray("messages");
        ObjectNode msg = messages.addObject();
        msg.put("role", "user");
        msg.put("content", userMessage);

        for (int attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                JsonNode response = webClient.post()
                        .uri("/v1/messages")
                        .bodyValue(body)
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .block();

                if (response != null && response.has("content")) {
                    JsonNode content = response.get("content");
                    if (content.isArray() && !content.isEmpty()) {
                        JsonNode firstBlock = content.get(0);
                        if (firstBlock != null && firstBlock.has("text")) {
                            return firstBlock.get("text").asText();
                        }
                    }
                }
                throw new RuntimeException("Empty response from Claude API");
            } catch (WebClientResponseException e) {
                int status = e.getStatusCode().value();
                if ((status == 429 || status >= 500) && attempt < MAX_RETRIES) {
                    long delay = (long) Math.pow(2, attempt) * 1000;
                    log.warn("Claude API returned {}, retrying in {}ms (attempt {}/{})", status, delay, attempt + 1, MAX_RETRIES);
                    try { Thread.sleep(delay); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); throw new RuntimeException("Interrupted during retry", ie); }
                    continue;
                }
                log.error("Claude API error: HTTP {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
                throw new RuntimeException("Claude API error (" + e.getStatusCode() + "): " + e.getResponseBodyAsString(), e);
            } catch (RuntimeException e) {
                if (e.getMessage() != null && e.getMessage().startsWith("Claude API")) throw e;
                if (e.getMessage() != null && e.getMessage().startsWith("Empty response")) throw e;
                log.error("Claude API call failed: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to call Claude API: " + e.getMessage(), e);
            }
        }
        throw new RuntimeException("Claude API call failed after retries");
    }

    public String sendJsonMessage(String systemPrompt, String userMessage) {
        return sendMessage(systemPrompt + "\n\nIMPORTANT: Respond with valid JSON only. No markdown, no code fences, no explanation.", userMessage);
    }
}
