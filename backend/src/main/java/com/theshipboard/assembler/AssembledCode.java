package com.theshipboard.assembler;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssembledCode {
    private List<CodeFile> files;
    private String platformioBoard;
    private String framework;
    private List<String> libraries;
}
