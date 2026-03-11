package com.theshipboard.compiler;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompileResult {
    private boolean success;
    private String log;
    private List<String> errors;
    private List<String> warnings;
    private Long binarySize;
}
