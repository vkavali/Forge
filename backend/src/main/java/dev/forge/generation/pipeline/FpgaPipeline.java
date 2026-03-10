package dev.forge.generation.pipeline;

import dev.forge.catalog.DeviceCategory;
import dev.forge.project.entity.Project;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class FpgaPipeline implements GenerationPipeline {
    @Override public DeviceCategory getCategory() { return DeviceCategory.FPGA; }
    @Override public String getSystemPrompt(Project project) {
        return "You are an FPGA/HDL expert specializing in Verilog, VHDL, SystemVerilog, and FPGA toolchains. " +
            "Generate synthesizable RTL code with proper testbenches, constraint files, and build scripts. " +
            "Support Yosys/nextpnr for open-source flows and Vivado/Quartus for commercial tools. " +
            "Output each file with a clear filename header: === filename.ext ===";
    }
    @Override public String getUserPrompt(Project project) {
        return String.format("Generate FPGA project for: Board: %s, Project: %s, Description: %s, Connections: %s, Behavior: %s. " +
            "Generate: RTL source, testbench, constraints file, Makefile/build script",
            project.getBoardId(), project.getName(), project.getDescription(), project.getConnectionsConfig(), project.getBehaviorSpec());
    }
    @Override public Map<String, String> getAdditionalPrompts() { return Map.of(); }
}
