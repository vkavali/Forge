package com.theshipboard.assembler;

import com.theshipboard.catalog.DeviceCategory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class CodeAssemblerRouter {

    private final Map<DeviceCategory, CodeAssembler> assemblers;

    public CodeAssemblerRouter(List<CodeAssembler> assemblerList) {
        this.assemblers = assemblerList.stream()
                .collect(Collectors.toMap(CodeAssembler::getCategory, Function.identity()));
    }

    public CodeAssembler route(String category) {
        DeviceCategory cat = DeviceCategory.valueOf(category.toUpperCase());
        CodeAssembler assembler = assemblers.get(cat);
        if (assembler == null) {
            throw new IllegalArgumentException("No assembler found for category: " + category);
        }
        return assembler;
    }
}
