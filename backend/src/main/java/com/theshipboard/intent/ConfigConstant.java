package com.theshipboard.intent;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfigConstant {
    private String name;
    private String type;
    private String value;
    private String description;
}
