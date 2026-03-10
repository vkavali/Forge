package dev.forge.shared;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

@Service
public class ClaudeApiService {

    private static final Logger log = LoggerFactory.getLogger(ClaudeApiService.class);
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final String model;
    private final int maxTokens;

    public ClaudeApiService(
            @Value("${claude.api-key}") String apiKey,
            @Value("${claude.model}") String model,
            @Value("${claude.max-tokens}") int maxTokens,
            ObjectMapper objectMapper) {
        this.model = model;
        this.maxTokens = maxTokens;
        this.objectMapper = objectMapper;
        this.webClient = WebClient.builder()
                .baseUrl("https://api.anthropic.com")
                .defaultHeader("x-api-key", apiKey)
                .defaultHeader("anthropic-version", "2023-06-01")
                .defaultHeader("content-type", "application/json")
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build();
    }

    public String sendMessage(String systemPrompt, String userMessage) {
        ObjectNode body = objectMapper.createObjectNode();
        body.put("model", model);
        body.put("max_tokens", maxTokens);
        body.put("system", systemPrompt);
        ArrayNode messages = body.putArray("messages");
        ObjectNode msg = messages.addObject();
        msg.put("role", "user");
        msg.put("content", userMessage);

        JsonNode response = webClient.post()
                .uri("/v1/messages")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response != null && response.has("content")) {
            JsonNode content = response.get("content");
            if (content.isArray() && !content.isEmpty()) {
                return content.get(0).get("text").asText();
            }
        }
        throw new RuntimeException("Empty response from Claude API");
    }

    public Flux<String> streamMessage(String systemPrompt, String userMessage) {
        ObjectNode body = objectMapper.createObjectNode();
        body.put("model", model);
        body.put("max_tokens", maxTokens);
        body.put("stream", true);
        body.put("system", systemPrompt);
        ArrayNode messages = body.putArray("messages");
        ObjectNode msg = messages.addObject();
        msg.put("role", "user");
        msg.put("content", userMessage);

        return webClient.post()
                .uri("/v1/messages")
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(String.class)
                .filter(line -> line.startsWith("data: "))
                .map(line -> line.substring(6))
                .filter(data -> !data.equals("[DONE]"))
                .map(data -> {
                    try {
                        JsonNode node = objectMapper.readTree(data);
                        if (node.has("delta") && node.get("delta").has("text")) {
                            return node.get("delta").get("text").asText();
                        }
                        return "";
                    } catch (Exception e) {
                        return "";
                    }
                })
                .filter(text -> !text.isEmpty());
    }
}
