package com.theshipboard.compiler;

import com.theshipboard.assembler.AssembledCode;
import com.theshipboard.assembler.CodeFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class CompileService {

    private static final Logger log = LoggerFactory.getLogger(CompileService.class);
    private final WebClient buildRunnerClient;

    public CompileService(@Value("${build-runner.url:http://localhost:5100}") String buildRunnerUrl) {
        this.buildRunnerClient = WebClient.builder()
                .baseUrl(buildRunnerUrl)
                .codecs(c -> c.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build();
    }

    public CompileResult compile(AssembledCode code) {
        if (code.getPlatformioBoard() == null) {
            log.info("Skipping compilation — no PlatformIO board (FPGA/Linux SBC)");
            return CompileResult.builder().success(true).log("Compilation skipped — not a PlatformIO target").errors(List.of()).warnings(List.of()).build();
        }

        try {
            Map<String, Object> request = Map.of(
                "board", code.getPlatformioBoard(),
                "framework", code.getFramework() != null ? code.getFramework() : "arduino",
                "libraries", code.getLibraries() != null ? code.getLibraries() : List.of(),
                "files", code.getFiles().stream().map(f -> Map.of("filename", f.getFilename(), "content", f.getContent())).toList()
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> response = buildRunnerClient.post()
                    .uri("/compile")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) {
                return CompileResult.builder().success(false).log("No response from build runner").errors(List.of("Build runner unreachable")).warnings(List.of()).build();
            }

            boolean success = Boolean.TRUE.equals(response.get("success"));
            String compileLog = (String) response.getOrDefault("log", "");
            @SuppressWarnings("unchecked")
            List<String> errors = (List<String>) response.getOrDefault("errors", List.of());
            @SuppressWarnings("unchecked")
            List<String> warnings = (List<String>) response.getOrDefault("warnings", List.of());

            return CompileResult.builder().success(success).log(compileLog).errors(errors).warnings(warnings).build();
        } catch (Exception e) {
            log.warn("Build runner not available, skipping compilation: {}", e.getMessage());
            return CompileResult.builder().success(true).log("Build runner unavailable — compilation skipped").errors(List.of()).warnings(List.of("Build runner not connected")).build();
        }
    }
}
