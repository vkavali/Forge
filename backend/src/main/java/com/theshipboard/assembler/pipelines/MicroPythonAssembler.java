package com.theshipboard.assembler.pipelines;

import com.theshipboard.assembler.*;
import com.theshipboard.catalog.DeviceCategory;
import com.theshipboard.catalog.LibraryCatalog;
import com.theshipboard.intent.*;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class MicroPythonAssembler implements CodeAssembler {

    private final TemplateEngine templateEngine;
    private final TemplateRegistry templateRegistry;

    public MicroPythonAssembler(TemplateEngine templateEngine, TemplateRegistry templateRegistry) {
        this.templateEngine = templateEngine;
        this.templateRegistry = templateRegistry;
    }

    @Override
    public DeviceCategory getCategory() { return DeviceCategory.MICROPYTHON; }

    @Override
    public AssembledCode assemble(IntentModel intent) {
        Map<String, String> vars = buildVariables(intent);
        List<CodeFile> files = new ArrayList<>();

        files.add(CodeFile.builder().filename("main.py")
                .content(templateEngine.loadAndRender(templateRegistry.getMainTemplate(getCategory()), vars))
                .contentType("text/x-python").build());

        files.add(CodeFile.builder().filename("boot.py")
                .content(templateEngine.loadAndRender(templateRegistry.getConfigTemplate(getCategory()), vars))
                .contentType("text/x-python").build());

        return AssembledCode.builder().files(files)
                .platformioBoard(intent.getBoardId())
                .framework("micropython").libraries(List.of()).build();
    }

    private Map<String, String> buildVariables(IntentModel intent) {
        Map<String, String> vars = new HashMap<>();
        vars.put("projectName", intent.getProjectName());
        vars.put("boardId", intent.getBoardId());
        vars.put("summary", intent.getSummary() != null ? intent.getSummary() : "");

        StringBuilder imports = new StringBuilder("from machine import Pin, I2C, SPI, ADC, PWM\nimport time\n");
        StringBuilder sensorSetup = new StringBuilder();
        StringBuilder sensorReads = new StringBuilder();
        StringBuilder actuatorSetup = new StringBuilder();
        StringBuilder logic = new StringBuilder();

        if (intent.getSensors() != null) {
            for (SensorIntent s : intent.getSensors()) {
                sensorSetup.append(String.format("# Setup %s on pin %s\n", s.getType(), s.getPin()));
                sensorReads.append(String.format("    # Read %s\n    # %s = read_%s()\n", s.getType(), s.getVariableName(), s.getType()));
            }
        }
        if (intent.getActuators() != null) {
            for (ActuatorIntent a : intent.getActuators()) {
                actuatorSetup.append(String.format("# Setup %s on pin %s\n", a.getType(), a.getPin()));
            }
        }
        if (intent.getLogicRules() != null) {
            for (LogicRule rule : intent.getLogicRules()) {
                logic.append(String.format("    # %s\n    if %s:\n        %s\n", rule.getDescription(), rule.getCondition(), rule.getAction()));
            }
        }

        vars.put("imports", imports.toString());
        vars.put("sensorSetup", sensorSetup.toString());
        vars.put("sensorReads", sensorReads.toString());
        vars.put("actuatorSetup", actuatorSetup.toString());
        vars.put("logicRules", logic.toString());
        vars.put("hasWifi", intent.getConnectivity() != null ? "true" : "");
        vars.put("wifiSsid", intent.getConnectivity() != null && intent.getConnectivity().getSsid() != null ? intent.getConnectivity().getSsid() : "YOUR_SSID");
        vars.put("loopDelay", intent.getTimers() != null && !intent.getTimers().isEmpty() ? String.valueOf(intent.getTimers().get(0).getIntervalMs() / 1000.0) : "1");
        return vars;
    }
}
