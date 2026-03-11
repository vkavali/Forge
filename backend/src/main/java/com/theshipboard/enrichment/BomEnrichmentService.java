package com.theshipboard.enrichment;

import com.theshipboard.catalog.BoardCatalog;
import com.theshipboard.catalog.BoardDefinition;
import com.theshipboard.catalog.LibraryCatalog;
import com.theshipboard.intent.IntentModel;
import com.theshipboard.intent.SensorIntent;
import com.theshipboard.intent.ActuatorIntent;
import com.theshipboard.project.entity.Project;
import com.theshipboard.shared.ClaudeApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BomEnrichmentService {

    private static final Logger log = LoggerFactory.getLogger(BomEnrichmentService.class);
    private final ClaudeApiService claudeApi;
    private final BoardCatalog boardCatalog;

    public BomEnrichmentService(ClaudeApiService claudeApi, BoardCatalog boardCatalog) {
        this.claudeApi = claudeApi;
        this.boardCatalog = boardCatalog;
    }

    public String generate(Project project, IntentModel intent) {
        StringBuilder bom = new StringBuilder();
        bom.append("Component,Quantity,Description,Estimated Price (USD),Purchase Link\n");

        BoardDefinition board = boardCatalog.findById(project.getBoardId()).orElse(null);
        if (board != null) {
            bom.append(String.format("%s,1,\"%s — %s\",,-\n", board.name(), board.processor(), board.formFactor()));
        }

        if (intent.getSensors() != null) {
            for (SensorIntent s : intent.getSensors()) {
                bom.append(String.format("%s sensor,1,\"%s sensor (%s)\",,-\n", s.getType(), s.getType(), s.getProtocol()));
            }
        }
        if (intent.getActuators() != null) {
            for (ActuatorIntent a : intent.getActuators()) {
                bom.append(String.format("%s,1,\"%s actuator (%s)\",,-\n", a.getType(), a.getType(), a.getProtocol()));
            }
        }

        bom.append("Breadboard,1,\"830-point breadboard\",,-\n");
        bom.append("Jumper wires,1,\"Assorted M-M / M-F / F-F\",,-\n");
        bom.append("USB Cable,1,\"USB cable for programming\",,-\n");

        // Ask Claude to fill in estimated prices
        String systemPrompt = "You are an electronics pricing expert. Given a BOM CSV, fill in realistic estimated prices. Return only the CSV with prices filled in.";
        String userPrompt = "Fill in the estimated prices for this BOM:\n\n" + bom;

        try {
            return claudeApi.sendMessage(systemPrompt, userPrompt);
        } catch (Exception e) {
            log.warn("BOM price enrichment failed, returning base BOM", e);
            return bom.toString();
        }
    }
}
