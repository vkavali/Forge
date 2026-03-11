package com.theshipboard.enrichment;

import com.theshipboard.assembler.AssembledCode;
import com.theshipboard.assembler.CodeFile;
import com.theshipboard.shared.ClaudeApiService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnotationService {

    private final ClaudeApiService claudeApi;

    public AnnotationService(ClaudeApiService claudeApi) {
        this.claudeApi = claudeApi;
    }

    public AssembledCode annotate(AssembledCode code, String educationLevel) {
        if (educationLevel == null) return code;

        List<CodeFile> annotated = code.getFiles().stream().map(file -> {
            if (!file.getFilename().endsWith(".cpp") && !file.getFilename().endsWith(".py") && !file.getFilename().endsWith(".v"))
                return file;

            try {
                String prompt = String.format(
                        "Add educational inline comments to this code for a %s level student. " +
                        "Explain what each section does. Return only the annotated code.\n\n```\n%s\n```",
                        educationLevel, file.getContent());
                String annotatedContent = claudeApi.sendMessage("You annotate code with educational comments.", prompt);
                String clean = annotatedContent.trim();
                if (clean.startsWith("```")) clean = clean.replaceAll("^```[a-z]*\\n?", "").replaceAll("\\n?```$", "").trim();
                return CodeFile.builder().filename(file.getFilename()).content(clean).contentType(file.getContentType()).build();
            } catch (Exception e) {
                return file;
            }
        }).toList();

        return AssembledCode.builder().files(annotated).platformioBoard(code.getPlatformioBoard())
                .framework(code.getFramework()).libraries(code.getLibraries()).build();
    }
}
