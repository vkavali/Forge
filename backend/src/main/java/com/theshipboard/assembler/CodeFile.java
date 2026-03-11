package com.theshipboard.assembler;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeFile {
    private String filename;
    private String content;
    private String contentType;
}
