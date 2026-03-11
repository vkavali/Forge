package com.theshipboard.intent;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimingIntent {
    private String name;
    private Integer intervalMs;
    private String description;
}
