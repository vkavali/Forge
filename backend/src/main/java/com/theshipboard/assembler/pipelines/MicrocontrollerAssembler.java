package com.theshipboard.assembler.pipelines;

import com.theshipboard.assembler.*;
import com.theshipboard.catalog.DeviceCategory;
import com.theshipboard.catalog.LibraryCatalog;
import com.theshipboard.intent.*;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class MicrocontrollerAssembler implements CodeAssembler {

    private final TemplateEngine templateEngine;
    private final TemplateRegistry templateRegistry;
    private final LibraryCatalog libraryCatalog;

    public MicrocontrollerAssembler(TemplateEngine templateEngine, TemplateRegistry templateRegistry, LibraryCatalog libraryCatalog) {
        this.templateEngine = templateEngine;
        this.templateRegistry = templateRegistry;
        this.libraryCatalog = libraryCatalog;
    }

    @Override
    public DeviceCategory getCategory() { return DeviceCategory.MICROCONTROLLER; }

    @Override
    public AssembledCode assemble(IntentModel intent) {
        Map<String, String> vars = buildVariables(intent);
        List<CodeFile> files = new ArrayList<>();

        files.add(CodeFile.builder()
                .filename("src/main.cpp")
                .content(templateEngine.loadAndRender(templateRegistry.getMainTemplate(getCategory()), vars))
                .contentType("text/x-c++src").build());

        files.add(CodeFile.builder()
                .filename("platformio.ini")
                .content(templateEngine.loadAndRender(templateRegistry.getConfigTemplate(getCategory()), vars))
                .contentType("text/plain").build());

        if (templateRegistry.hasHeaderTemplate(getCategory())) {
            files.add(CodeFile.builder()
                    .filename("include/config.h")
                    .content(templateEngine.loadAndRender(templateRegistry.getHeaderTemplate(getCategory()), vars))
                    .contentType("text/x-c++hdr").build());
        }

        List<String> libs = resolveLibraries(intent);

        return AssembledCode.builder()
                .files(files).platformioBoard(intent.getBoardId())
                .framework(intent.getFramework()).libraries(libs).build();
    }

    private Map<String, String> buildVariables(IntentModel intent) {
        Map<String, String> vars = new HashMap<>();
        vars.put("projectName", intent.getProjectName());
        vars.put("boardId", intent.getBoardId());
        vars.put("framework", intent.getFramework() != null ? intent.getFramework() : "arduino");

        // Build includes
        StringBuilder includes = new StringBuilder();
        if (intent.getRequiredLibraries() != null) {
            for (String lib : intent.getRequiredLibraries()) {
                libraryCatalog.getPrimaryLibrary(lib).ifPresent(entry -> {
                    if (!entry.headerInclude().isEmpty()) {
                        includes.append(entry.headerInclude()).append("\n");
                    }
                });
            }
        }
        vars.put("includes", includes.toString());
        vars.put("configInclude", "#include \"config.h\"");

        // Build pin definitions
        StringBuilder pinDefs = new StringBuilder();
        if (intent.getConstants() != null) {
            for (ConfigConstant c : intent.getConstants()) {
                pinDefs.append(String.format("#define %s %s\n", c.getName(), c.getValue()));
            }
        }
        vars.put("pinDefinitions", pinDefs.toString());

        // Build sensor declarations
        StringBuilder sensorDecls = new StringBuilder();
        StringBuilder sensorInits = new StringBuilder();
        StringBuilder sensorReads = new StringBuilder();
        if (intent.getSensors() != null) {
            for (SensorIntent s : intent.getSensors()) {
                sensorDecls.append(String.format("// Sensor: %s (%s)\n", s.getType(), s.getVariableName()));
                sensorInits.append(String.format("  // Initialize %s\n", s.getType()));
                sensorReads.append(String.format("  // Read %s\n  // float %s = read_%s();\n",
                        s.getType(), s.getVariableName(), s.getType()));
            }
        }
        vars.put("sensorDeclarations", sensorDecls.toString());
        vars.put("sensorInitialization", sensorInits.toString());
        vars.put("sensorReads", sensorReads.toString());

        // Build actuator declarations
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

        // Build logic
        StringBuilder logic = new StringBuilder();
        if (intent.getLogicRules() != null) {
            for (LogicRule rule : intent.getLogicRules()) {
                logic.append(String.format("  // %s\n  if (%s) {\n    %s;\n  }\n",
                        rule.getDescription(), rule.getCondition(), rule.getAction()));
            }
        }
        vars.put("logicRules", logic.toString());

        // Connectivity
        vars.put("hasWifi", intent.getConnectivity() != null && "wifi".equalsIgnoreCase(intent.getConnectivity().getProtocol()) ? "true" : "");
        vars.put("hasMqtt", intent.getConnectivity() != null && intent.getConnectivity().getMqttBroker() != null ? "true" : "");
        vars.put("hasBle", intent.getConnectivity() != null && "ble".equalsIgnoreCase(intent.getConnectivity().getProtocol()) ? "true" : "");
        if (intent.getConnectivity() != null) {
            vars.put("wifiSsid", intent.getConnectivity().getSsid() != null ? intent.getConnectivity().getSsid() : "YOUR_SSID");
            vars.put("mqttBroker", intent.getConnectivity().getMqttBroker() != null ? intent.getConnectivity().getMqttBroker() : "");
            vars.put("mqttTopic", intent.getConnectivity().getMqttTopic() != null ? intent.getConnectivity().getMqttTopic() : "");
        }

        // Libraries for platformio.ini
        StringBuilder libDeps = new StringBuilder();
        if (intent.getRequiredLibraries() != null) {
            for (String lib : intent.getRequiredLibraries()) {
                libraryCatalog.getPrimaryLibrary(lib).ifPresent(entry -> {
                    if (!entry.platformioLib().isEmpty()) {
                        libDeps.append("    ").append(entry.platformioLib()).append("\n");
                    }
                });
            }
        }
        vars.put("libDeps", libDeps.toString());

        // Loop delay
        vars.put("loopDelay", "1000");
        if (intent.getTimers() != null && !intent.getTimers().isEmpty()) {
            vars.put("loopDelay", String.valueOf(intent.getTimers().get(0).getIntervalMs()));
        }

        vars.put("summary", intent.getSummary() != null ? intent.getSummary() : "");

        return vars;
    }

    private List<String> resolveLibraries(IntentModel intent) {
        if (intent.getRequiredLibraries() == null) return List.of();
        return intent.getRequiredLibraries().stream()
                .map(libraryCatalog::getPrimaryLibrary)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(e -> !e.platformioLib().isEmpty())
                .map(LibraryCatalog.LibraryEntry::platformioLib)
                .collect(Collectors.toList());
    }
}
