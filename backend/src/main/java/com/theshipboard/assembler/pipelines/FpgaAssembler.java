package com.theshipboard.assembler.pipelines;

import com.theshipboard.assembler.*;
import com.theshipboard.catalog.DeviceCategory;
import com.theshipboard.intent.*;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class FpgaAssembler implements CodeAssembler {
    private final TemplateEngine te;
    private final TemplateRegistry tr;
    public FpgaAssembler(TemplateEngine te, TemplateRegistry tr) { this.te = te; this.tr = tr; }
    @Override public DeviceCategory getCategory() { return DeviceCategory.FPGA; }
    @Override public AssembledCode assemble(IntentModel intent) {
        Map<String, String> vars = new HashMap<>();
        vars.put("projectName", intent.getProjectName());
        vars.put("summary", intent.getSummary() != null ? intent.getSummary() : "");
        vars.put("boardId", intent.getBoardId());

        StringBuilder ports = new StringBuilder();
        StringBuilder logic = new StringBuilder();
        if (intent.getSensors() != null) {
            for (SensorIntent s : intent.getSensors()) {
                ports.append(String.format("    input wire %s,\n", s.getVariableName()));
            }
        }
        if (intent.getActuators() != null) {
            for (ActuatorIntent a : intent.getActuators()) {
                ports.append(String.format("    output reg %s,\n", a.getVariableName()));
            }
        }
        if (intent.getLogicRules() != null) {
            for (LogicRule r : intent.getLogicRules()) {
                logic.append(String.format("        // %s\n", r.getDescription()));
            }
        }
        vars.put("ports", ports.toString());
        vars.put("logicRules", logic.toString());

        List<CodeFile> files = new ArrayList<>();
        files.add(CodeFile.builder().filename("rtl/top.v").content(te.loadAndRender(tr.getMainTemplate(getCategory()), vars)).contentType("text/x-verilog").build());
        files.add(CodeFile.builder().filename("Makefile").content(te.loadAndRender(tr.getConfigTemplate(getCategory()), vars)).contentType("text/plain").build());
        return AssembledCode.builder().files(files).platformioBoard(null).framework(null).libraries(List.of()).build();
    }
}
