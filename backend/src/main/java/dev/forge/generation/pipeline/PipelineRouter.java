package dev.forge.generation.pipeline;

import dev.forge.catalog.DeviceCategory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class PipelineRouter {

    private final Map<DeviceCategory, GenerationPipeline> pipelines;

    public PipelineRouter(List<GenerationPipeline> pipelineList) {
        this.pipelines = pipelineList.stream()
                .collect(Collectors.toMap(GenerationPipeline::getCategory, Function.identity()));
    }

    public GenerationPipeline route(String category) {
        DeviceCategory cat = DeviceCategory.valueOf(category.toUpperCase());
        GenerationPipeline pipeline = pipelines.get(cat);
        if (pipeline == null) {
            throw new IllegalArgumentException("No pipeline for category: " + category);
        }
        return pipeline;
    }
}
