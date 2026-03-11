package com.theshipboard.assembler;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class TemplateEngine {

    private static final Pattern VAR_PATTERN = Pattern.compile("\\{\\{\\s*(\\w+)\\s*\\}\\}");
    private static final Pattern BLOCK_PATTERN = Pattern.compile(
            "\\{\\{#if\\s+(\\w+)\\}\\}(.*?)\\{\\{/if\\}\\}", Pattern.DOTALL);

    public String load(String templatePath) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/" + templatePath);
            return resource.getContentAsString(StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Template not found: " + templatePath, e);
        }
    }

    public String render(String template, Map<String, String> variables) {
        // Process conditional blocks first
        String result = processConditionals(template, variables);
        // Then replace variables
        result = replaceVariables(result, variables);
        return result;
    }

    public String loadAndRender(String templatePath, Map<String, String> variables) {
        return render(load(templatePath), variables);
    }

    private String processConditionals(String template, Map<String, String> variables) {
        Matcher matcher = BLOCK_PATTERN.matcher(template);
        StringBuilder sb = new StringBuilder();
        while (matcher.find()) {
            String varName = matcher.group(1);
            String blockContent = matcher.group(2);
            String value = variables.getOrDefault(varName, "");
            boolean truthy = !value.isEmpty() && !"false".equalsIgnoreCase(value) && !"null".equalsIgnoreCase(value);
            matcher.appendReplacement(sb, Matcher.quoteReplacement(truthy ? blockContent : ""));
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String replaceVariables(String template, Map<String, String> variables) {
        Matcher matcher = VAR_PATTERN.matcher(template);
        StringBuilder sb = new StringBuilder();
        while (matcher.find()) {
            String varName = matcher.group(1);
            String value = variables.getOrDefault(varName, "");
            matcher.appendReplacement(sb, Matcher.quoteReplacement(value));
        }
        matcher.appendTail(sb);
        return sb.toString();
    }
}
