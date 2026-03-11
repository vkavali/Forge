package com.theshipboard.intent;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IntentModel {
    private String projectName;
    private String boardId;
    private String category;
    private String framework;
    private String language;
    private List<SensorIntent> sensors;
    private List<ActuatorIntent> actuators;
    private List<LogicRule> logicRules;
    private ConnectivityIntent connectivity;
    private List<TimingIntent> timers;
    private List<ConfigConstant> constants;
    private List<String> requiredLibraries;
    private String summary;
}
