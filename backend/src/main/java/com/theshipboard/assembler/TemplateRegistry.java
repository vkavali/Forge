package com.theshipboard.assembler;

import com.theshipboard.catalog.DeviceCategory;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class TemplateRegistry {

    private static final Map<DeviceCategory, String> MAIN_TEMPLATES = Map.ofEntries(
        Map.entry(DeviceCategory.MICROCONTROLLER, "microcontroller/main.cpp.tpl"),
        Map.entry(DeviceCategory.MICROPYTHON, "micropython/main.py.tpl"),
        Map.entry(DeviceCategory.LINUX_SBC, "linux_sbc/main.py.tpl"),
        Map.entry(DeviceCategory.ROBOTICS, "robotics/main.cpp.tpl"),
        Map.entry(DeviceCategory.DRONE, "drone/main.cpp.tpl"),
        Map.entry(DeviceCategory.AUTOMOTIVE, "automotive/main.cpp.tpl"),
        Map.entry(DeviceCategory.MOTOR_CONTROL, "motor_control/main.cpp.tpl"),
        Map.entry(DeviceCategory.CNC, "cnc/main.cpp.tpl"),
        Map.entry(DeviceCategory.FPGA, "fpga/top.v.tpl"),
        Map.entry(DeviceCategory.WEARABLE, "wearable/main.cpp.tpl"),
        Map.entry(DeviceCategory.AUDIO_DSP, "audio_dsp/main.cpp.tpl"),
        Map.entry(DeviceCategory.INDUSTRIAL, "industrial/main.cpp.tpl")
    );

    private static final Map<DeviceCategory, String> CONFIG_TEMPLATES = Map.ofEntries(
        Map.entry(DeviceCategory.MICROCONTROLLER, "microcontroller/platformio.ini.tpl"),
        Map.entry(DeviceCategory.MICROPYTHON, "micropython/boot.py.tpl"),
        Map.entry(DeviceCategory.LINUX_SBC, "linux_sbc/requirements.txt.tpl"),
        Map.entry(DeviceCategory.ROBOTICS, "robotics/platformio.ini.tpl"),
        Map.entry(DeviceCategory.DRONE, "drone/platformio.ini.tpl"),
        Map.entry(DeviceCategory.AUTOMOTIVE, "automotive/platformio.ini.tpl"),
        Map.entry(DeviceCategory.MOTOR_CONTROL, "motor_control/platformio.ini.tpl"),
        Map.entry(DeviceCategory.CNC, "cnc/platformio.ini.tpl"),
        Map.entry(DeviceCategory.FPGA, "fpga/Makefile.tpl"),
        Map.entry(DeviceCategory.WEARABLE, "wearable/platformio.ini.tpl"),
        Map.entry(DeviceCategory.AUDIO_DSP, "audio_dsp/platformio.ini.tpl"),
        Map.entry(DeviceCategory.INDUSTRIAL, "industrial/platformio.ini.tpl")
    );

    private static final Map<DeviceCategory, String> HEADER_TEMPLATES = Map.ofEntries(
        Map.entry(DeviceCategory.MICROCONTROLLER, "microcontroller/config.h.tpl"),
        Map.entry(DeviceCategory.ROBOTICS, "robotics/config.h.tpl"),
        Map.entry(DeviceCategory.DRONE, "drone/config.h.tpl"),
        Map.entry(DeviceCategory.AUTOMOTIVE, "automotive/config.h.tpl"),
        Map.entry(DeviceCategory.MOTOR_CONTROL, "motor_control/config.h.tpl"),
        Map.entry(DeviceCategory.CNC, "cnc/config.h.tpl"),
        Map.entry(DeviceCategory.WEARABLE, "wearable/config.h.tpl"),
        Map.entry(DeviceCategory.AUDIO_DSP, "audio_dsp/config.h.tpl"),
        Map.entry(DeviceCategory.INDUSTRIAL, "industrial/config.h.tpl")
    );

    public String getMainTemplate(DeviceCategory category) {
        return MAIN_TEMPLATES.get(category);
    }

    public String getConfigTemplate(DeviceCategory category) {
        return CONFIG_TEMPLATES.get(category);
    }

    public String getHeaderTemplate(DeviceCategory category) {
        return HEADER_TEMPLATES.get(category);
    }

    public boolean hasHeaderTemplate(DeviceCategory category) {
        return HEADER_TEMPLATES.containsKey(category);
    }
}
