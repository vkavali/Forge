package com.theshipboard.intent;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class ConnectivityDeserializer extends JsonDeserializer<ConnectivityIntent> {
    @Override
    public ConnectivityIntent deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        ObjectMapper mapper = (ObjectMapper) p.getCodec();
        JsonNode node = mapper.readTree(p);
        if (node.isArray()) {
            if (node.isEmpty()) return null;
            return mapper.treeToValue(node.get(0), ConnectivityIntent.class);
        }
        return mapper.treeToValue(node, ConnectivityIntent.class);
    }
}
