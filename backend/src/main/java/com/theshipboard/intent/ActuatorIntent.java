package com.theshipboard.intent;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActuatorIntent {
    private String type;
    private String pin;
    private String protocol;
    private String variableName;
    private String defaultState;
}
