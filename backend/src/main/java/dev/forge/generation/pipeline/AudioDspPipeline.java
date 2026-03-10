package dev.forge.generation.pipeline;

import dev.forge.catalog.DeviceCategory;
import dev.forge.project.entity.Project;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class AudioDspPipeline implements GenerationPipeline {
    @Override public DeviceCategory getCategory() { return DeviceCategory.AUDIO_DSP; }
    @Override public String getSystemPrompt(Project project) {
        return "You are an audio DSP expert specializing in I2S, codec configuration, real-time audio effects, and synthesizer design. " +
            "Generate firmware with proper DMA-based audio pipelines, filter implementations, and codec initialization. " +
            "Support Teensy Audio, ESP-ADF, and libDaisy. " +
            "Output each file with a clear filename header: === filename.ext ===";
    }
    @Override public String getUserPrompt(Project project) {
        return String.format("Generate audio/DSP project for: Board: %s, Project: %s, Description: %s, Connections: %s, Behavior: %s. " +
            "Generate: firmware, audio pipeline config, DSP algorithms, codec setup",
            project.getBoardId(), project.getName(), project.getDescription(), project.getConnectionsConfig(), project.getBehaviorSpec());
    }
    @Override public Map<String, String> getAdditionalPrompts() { return Map.of(); }
}
