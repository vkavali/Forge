package com.theshipboard.assembler.pipelines;

import com.theshipboard.assembler.*;
import com.theshipboard.catalog.DeviceCategory;
import com.theshipboard.intent.*;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class LinuxSbcAssembler implements CodeAssembler {
    private final TemplateEngine templateEngine;
    private final TemplateRegistry templateRegistry;

    public LinuxSbcAssembler(TemplateEngine templateEngine, TemplateRegistry templateRegistry) {
        this.templateEngine = templateEngine;
        this.templateRegistry = templateRegistry;
    }

    @Override public DeviceCategory getCategory() { return DeviceCategory.LINUX_SBC; }

    @Override
    public AssembledCode assemble(IntentModel intent) {
        Map<String, String> vars = new HashMap<>();
        vars.put("projectName", intent.getProjectName());
        vars.put("summary", intent.getSummary() != null ? intent.getSummary() : "");
        vars.put("boardId", intent.getBoardId());

        StringBuilder imports = new StringBuilder("import RPi.GPIO as GPIO\nimport time\nimport json\n");
        StringBuilder gpioSetup = new StringBuilder();
        StringBuilder sensorReads = new StringBuilder();
        StringBuilder logic = new StringBuilder();

        if (intent.getSensors() != null) {
            for (SensorIntent s : intent.getSensors()) {
                gpioSetup.append(String.format("# Setup %s on pin %s\n", s.getType(), s.getPin()));
                sensorReads.append(String.format("        # Read %s\n", s.getType()));
            }
        }
        if (intent.getActuators() != null) {
            for (ActuatorIntent a : intent.getActuators()) {
                gpioSetup.append(String.format("# Setup %s on pin %s\n", a.getType(), a.getPin()));
            }
        }
        if (intent.getLogicRules() != null) {
            for (LogicRule r : intent.getLogicRules()) {
                logic.append(String.format("        # %s\n        if %s:\n            %s\n", r.getDescription(), r.getCondition(), r.getAction()));
            }
        }
        vars.put("imports", imports.toString());
        vars.put("gpioSetup", gpioSetup.toString());
        vars.put("sensorReads", sensorReads.toString());
        vars.put("logicRules", logic.toString());
        vars.put("hasWifi", "");
        vars.put("loopDelay", "1");

        List<CodeFile> files = new ArrayList<>();
        files.add(CodeFile.builder().filename("main.py")
                .content(templateEngine.loadAndRender(templateRegistry.getMainTemplate(getCategory()), vars))
                .contentType("text/x-python").build());
        files.add(CodeFile.builder().filename("requirements.txt")
                .content(templateEngine.loadAndRender(templateRegistry.getConfigTemplate(getCategory()), vars))
                .contentType("text/plain").build());

        return AssembledCode.builder().files(files).platformioBoard(null).framework(null).libraries(List.of()).build();
    }
}
