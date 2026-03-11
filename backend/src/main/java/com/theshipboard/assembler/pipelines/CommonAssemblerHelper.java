package com.theshipboard.assembler.pipelines;

import com.theshipboard.catalog.LibraryCatalog;
import com.theshipboard.intent.*;

import java.util.*;
import java.util.stream.Collectors;

public final class CommonAssemblerHelper {

    private CommonAssemblerHelper() {}

    public static Map<String, String> buildCppVariables(IntentModel intent, LibraryCatalog libraryCatalog) {
        Map<String, String> vars = new HashMap<>();
        vars.put("projectName", intent.getProjectName());
        vars.put("boardId", intent.getBoardId());
        vars.put("framework", intent.getFramework() != null ? intent.getFramework() : "arduino");
        vars.put("summary", intent.getSummary() != null ? intent.getSummary() : "");

        StringBuilder includes = new StringBuilder();
        if (intent.getRequiredLibraries() != null) {
            for (String lib : intent.getRequiredLibraries()) {
                libraryCatalog.getPrimaryLibrary(lib).ifPresent(entry -> {
                    if (!entry.headerInclude().isEmpty()) includes.append(entry.headerInclude()).append("\n");
                });
            }
        }
        vars.put("includes", includes.toString());
        vars.put("configInclude", "#include \"config.h\"");

        StringBuilder pinDefs = new StringBuilder();
        if (intent.getConstants() != null) {
            for (ConfigConstant c : intent.getConstants()) {
                pinDefs.append(String.format("#define %s %s\n", c.getName(), c.getValue()));
            }
        }
        vars.put("pinDefinitions", pinDefs.toString());

        StringBuilder sensorDecls = new StringBuilder();
        StringBuilder sensorInits = new StringBuilder();
        StringBuilder sensorReads = new StringBuilder();
        if (intent.getSensors() != null) {
            for (SensorIntent s : intent.getSensors()) {
                sensorDecls.append(String.format("// Sensor: %s (%s)\n", s.getType(), s.getVariableName()));
                sensorInits.append(String.format("  // Initialize %s\n", s.getType()));
                sensorReads.append(String.format("  // Read %s\n", s.getType()));
            }
        }
        vars.put("sensorDeclarations", sensorDecls.toString());
        vars.put("sensorInitialization", sensorInits.toString());
        vars.put("sensorReads", sensorReads.toString());

        StringBuilder actDecls = new StringBuilder();
        StringBuilder actInits = new StringBuilder();
        if (intent.getActuators() != null) {
            for (ActuatorIntent a : intent.getActuators()) {
                actDecls.append(String.format("// Actuator: %s (%s)\n", a.getType(), a.getVariableName()));
                actInits.append(String.format("  // Initialize %s\n", a.getType()));
            }
        }
        vars.put("actuatorDeclarations", actDecls.toString());
        vars.put("actuatorInitialization", actInits.toString());

        StringBuilder logic = new StringBuilder();
        if (intent.getLogicRules() != null) {
            for (LogicRule rule : intent.getLogicRules()) {
                logic.append(String.format("  // %s\n  if (%s) {\n    %s;\n  }\n", rule.getDescription(), rule.getCondition(), rule.getAction()));
            }
        }
        vars.put("logicRules", logic.toString());

        vars.put("hasWifi", intent.getConnectivity() != null && "wifi".equalsIgnoreCase(intent.getConnectivity().getProtocol()) ? "true" : "");
        vars.put("hasMqtt", intent.getConnectivity() != null && intent.getConnectivity().getMqttBroker() != null ? "true" : "");
        vars.put("hasBle", intent.getConnectivity() != null && "ble".equalsIgnoreCase(intent.getConnectivity().getProtocol()) ? "true" : "");
        vars.put("wifiSsid", intent.getConnectivity() != null && intent.getConnectivity().getSsid() != null ? intent.getConnectivity().getSsid() : "YOUR_SSID");
        vars.put("mqttBroker", intent.getConnectivity() != null && intent.getConnectivity().getMqttBroker() != null ? intent.getConnectivity().getMqttBroker() : "");
        vars.put("mqttTopic", intent.getConnectivity() != null && intent.getConnectivity().getMqttTopic() != null ? intent.getConnectivity().getMqttTopic() : "");

        StringBuilder libDeps = new StringBuilder();
        if (intent.getRequiredLibraries() != null) {
            for (String lib : intent.getRequiredLibraries()) {
                libraryCatalog.getPrimaryLibrary(lib).ifPresent(entry -> {
                    if (!entry.platformioLib().isEmpty()) libDeps.append("    ").append(entry.platformioLib()).append("\n");
                });
            }
        }
        vars.put("libDeps", libDeps.toString());
        vars.put("loopDelay", intent.getTimers() != null && !intent.getTimers().isEmpty() ? String.valueOf(intent.getTimers().get(0).getIntervalMs()) : "1000");

        return vars;
    }

    public static List<String> resolveLibs(IntentModel intent, LibraryCatalog libraryCatalog) {
        if (intent.getRequiredLibraries() == null) return List.of();
        return intent.getRequiredLibraries().stream()
                .map(libraryCatalog::getPrimaryLibrary)
                .filter(Optional::isPresent).map(Optional::get)
                .filter(e -> !e.platformioLib().isEmpty())
                .map(LibraryCatalog.LibraryEntry::platformioLib)
                .collect(Collectors.toList());
    }
}
