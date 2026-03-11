package com.theshipboard.compiler;

import com.theshipboard.assembler.AssembledCode;
import com.theshipboard.assembler.CodeFile;
import com.theshipboard.shared.ClaudeApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ErrorPatcher {

    private static final Logger log = LoggerFactory.getLogger(ErrorPatcher.class);
    private static final int MAX_PATCH_ATTEMPTS = 2;
    private final ClaudeApiService claudeApi;

    public ErrorPatcher(ClaudeApiService claudeApi) {
        this.claudeApi = claudeApi;
    }

    public AssembledCode attemptPatch(AssembledCode code, CompileResult failedResult) {
        for (int attempt = 0; attempt < MAX_PATCH_ATTEMPTS; attempt++) {
            log.info("Error patch attempt {}/{}", attempt + 1, MAX_PATCH_ATTEMPTS);
            try {
                String mainFile = code.getFiles().stream()
                        .filter(f -> f.getFilename().endsWith(".cpp") || f.getFilename().endsWith(".c") || f.getFilename().endsWith(".py"))
                        .findFirst()
                        .map(CodeFile::getContent)
                        .orElse("");

                String prompt = String.format(
                        "Fix the following compilation errors in this code.\n\nCode:\n```\n%s\n```\n\nErrors:\n%s\n\nReturn ONLY the fixed code, no explanations.",
                        mainFile, String.join("\n", failedResult.getErrors()));

                String fixed = claudeApi.sendMessage("You are a code-fixing assistant. Return only the corrected code.", prompt);

                // Replace the main source file with the fixed version
                List<CodeFile> updatedFiles = code.getFiles().stream().map(f -> {
                    if (f.getFilename().endsWith(".cpp") || f.getFilename().endsWith(".c") || f.getFilename().endsWith(".py")) {
                        // Strip markdown fences if present
                        String cleanFixed = fixed.trim();
                        if (cleanFixed.startsWith("```")) {
                            cleanFixed = cleanFixed.replaceAll("^```[a-z]*\\n?", "").replaceAll("\\n?```$", "").trim();
                        }
                        return CodeFile.builder().filename(f.getFilename()).content(cleanFixed).contentType(f.getContentType()).build();
                    }
                    return f;
                }).toList();

                return AssembledCode.builder()
                        .files(updatedFiles)
                        .platformioBoard(code.getPlatformioBoard())
                        .framework(code.getFramework())
                        .libraries(code.getLibraries())
                        .build();
            } catch (Exception e) {
                log.warn("Patch attempt {} failed: {}", attempt + 1, e.getMessage());
            }
        }
        return code;
    }
}
