package com.theshipboard.assembler.pipelines;

import com.theshipboard.assembler.*;
import com.theshipboard.catalog.DeviceCategory;
import com.theshipboard.catalog.LibraryCatalog;
import com.theshipboard.intent.*;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class RoboticsAssembler implements CodeAssembler {
    private final TemplateEngine te;
    private final TemplateRegistry tr;
    private final LibraryCatalog lc;
    public RoboticsAssembler(TemplateEngine te, TemplateRegistry tr, LibraryCatalog lc) { this.te = te; this.tr = tr; this.lc = lc; }
    @Override public DeviceCategory getCategory() { return DeviceCategory.ROBOTICS; }
    @Override public AssembledCode assemble(IntentModel intent) {
        Map<String, String> vars = CommonAssemblerHelper.buildCppVariables(intent, lc);
        List<CodeFile> files = new ArrayList<>();
        files.add(CodeFile.builder().filename("src/main.cpp").content(te.loadAndRender(tr.getMainTemplate(getCategory()), vars)).contentType("text/x-c++src").build());
        files.add(CodeFile.builder().filename("platformio.ini").content(te.loadAndRender(tr.getConfigTemplate(getCategory()), vars)).contentType("text/plain").build());
        if (tr.hasHeaderTemplate(getCategory())) files.add(CodeFile.builder().filename("include/config.h").content(te.loadAndRender(tr.getHeaderTemplate(getCategory()), vars)).contentType("text/x-c++hdr").build());
        return AssembledCode.builder().files(files).platformioBoard(intent.getBoardId()).framework(intent.getFramework()).libraries(CommonAssemblerHelper.resolveLibs(intent, lc)).build();
    }
}
