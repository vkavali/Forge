package com.theshipboard.catalog;

import java.util.List;

public record BoardDefinition(
        String id,
        String name,
        DeviceCategory category,
        String processor,
        String formFactor,
        List<String> interfaces,
        List<String> features,
        String imageUrl,
        String platformioId,
        String framework,
        String language
) {
    public BoardDefinition(String id, String name, DeviceCategory category, String processor,
                           String formFactor, List<String> interfaces, List<String> features, String imageUrl) {
        this(id, name, category, processor, formFactor, interfaces, features, imageUrl, null, "arduino", "cpp");
    }
}
