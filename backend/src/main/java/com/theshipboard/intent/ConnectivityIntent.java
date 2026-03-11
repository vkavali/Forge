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
public class ConnectivityIntent {
    private String protocol;
    private String ssid;
    private String mqttBroker;
    private String mqttTopic;
    private List<String> bleServices;
    private String endpoint;
}
