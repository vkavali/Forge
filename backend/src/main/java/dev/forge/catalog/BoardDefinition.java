package dev.forge.catalog;

import java.util.List;

public record BoardDefinition(
        String id,
        String name,
        DeviceCategory category,
        String processor,
        String formFactor,
        List<String> interfaces,
        List<String> features,
        String imageUrl
) {}
