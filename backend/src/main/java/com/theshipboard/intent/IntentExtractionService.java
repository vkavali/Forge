package com.theshipboard.intent;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.theshipboard.catalog.BoardCatalog;
import com.theshipboard.catalog.BoardDefinition;
import com.theshipboard.catalog.LibraryCatalog;
import com.theshipboard.project.entity.Project;
import com.theshipboard.shared.ClaudeApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class IntentExtractionService {

    private static final Logger log = LoggerFactory.getLogger(IntentExtractionService.class);
    private final ClaudeApiService claudeApi;
    private final BoardCatalog boardCatalog;
    private final LibraryCatalog libraryCatalog;
    private final ObjectMapper objectMapper;

    public IntentExtractionService(ClaudeApiService claudeApi, BoardCatalog boardCatalog,
                                   LibraryCatalog libraryCatalog, ObjectMapper objectMapper) {
        this.claudeApi = claudeApi;
        this.boardCatalog = boardCatalog;
        this.libraryCatalog = libraryCatalog;
        this.objectMapper = objectMapper;
    }

    public IntentModel extract(Project project) {
        BoardDefinition board = boardCatalog.findById(project.getBoardId())
                .orElseThrow(() -> new IllegalArgumentException("Board not found: " + project.getBoardId()));

        String systemPrompt = buildSystemPrompt(board);
        String userPrompt = buildUserPrompt(project, board);

        String jsonResponse = claudeApi.sendJsonMessage(systemPrompt, userPrompt);

        try {
            // Clean response - strip markdown fences if present
            String cleaned = jsonResponse.trim();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replaceAll("^```[a-z]*\\n?", "").replaceAll("\\n?```$", "").trim();
            }
            return objectMapper.readValue(cleaned, IntentModel.class);
        } catch (Exception e) {
            log.error("Failed to parse intent model from Claude response", e);
            throw new RuntimeException("Intent extraction failed: " + e.getMessage(), e);
        }
    }

    private String buildSystemPrompt(BoardDefinition board) {
        return """
            You are an embedded systems intent parser. Given a project description and board specification,
            extract a structured IntentModel JSON. You must identify:

            1. sensors: Each sensor with type (e.g. "dht22", "bme280", "hcsr04"), pin assignment, protocol (I2C/SPI/ANALOG/DIGITAL), variable name, unit, read interval
            2. actuators: Each actuator with type (e.g. "servo", "relay", "neopixel", "l298n"), pin, protocol, variable name, default state
            3. logicRules: Business logic as if-then rules (e.g. condition: "temperature > 30", action: "fan.on()", description: "Turn on fan when hot")
            4. connectivity: WiFi/BLE/MQTT/HTTP config if mentioned
            5. timers: Periodic tasks with intervals
            6. constants: Configuration values like thresholds, pin numbers
            7. requiredLibraries: List of library identifiers needed (e.g. ["dht22", "ssd1306", "mqtt"])
            8. summary: One-line summary of the project

            Available library types: dht11, dht22, bme280, bmp280, mpu6050, hcsr04, ds18b20, bh1750, max30102,
            ina219, vl53l0x, ads1115, ssd1306, lcd1602, st7735, ili9341, neopixel, max7219, servo, pca9685,
            stepper_a4988, tmc2209, l298n, relay, wifi, ble, mqtt, lorawan, espnow, can_bus, modbus_rtu, rs485,
            sd_card, eeprom, spiffs, littlefs, i2s_dac, dfplayer, simplefoc, encoder, ds3231, ntp,
            rfid_rc522, keypad, ir_remote, gps_neo6m

            Board: %s (%s) — %s
            Category: %s
            Framework: %s
            Language: %s
            Interfaces: %s
            """.formatted(board.name(), board.processor(), board.formFactor(),
                board.category().name(), board.framework(), board.language(),
                String.join(", ", board.interfaces()));
    }

    private String buildUserPrompt(Project project, BoardDefinition board) {
        StringBuilder sb = new StringBuilder();
        sb.append("Project: ").append(project.getName()).append("\n");
        sb.append("Description: ").append(project.getDescription()).append("\n");
        if (project.getBehaviorSpec() != null) {
            sb.append("Behavior: ").append(project.getBehaviorSpec()).append("\n");
        }
        if (project.getConnectionsConfig() != null) {
            sb.append("Connections: ").append(project.getConnectionsConfig()).append("\n");
        }
        sb.append("\nExtract the IntentModel JSON with fields: projectName, boardId, category, framework, language, sensors, actuators, logicRules, connectivity, timers, constants, requiredLibraries, summary");
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> toMap(IntentModel model) {
        return objectMapper.convertValue(model, Map.class);
    }
}
