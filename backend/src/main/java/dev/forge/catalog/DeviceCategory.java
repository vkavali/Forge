package dev.forge.catalog;

import lombok.Getter;

@Getter
public enum DeviceCategory {
    MICROCONTROLLER("Microcontroller", "Arduino, ESP32, STM32 — C/C++ firmware", "cpu"),
    MICROPYTHON("MicroPython", "ESP32, RP2040 — Python firmware", "code"),
    LINUX_SBC("Linux SBC", "Raspberry Pi, Jetson, BeagleBone — Linux apps", "server"),
    ROBOTICS("Robotics", "ROS2, servo/stepper, kinematics", "bot"),
    DRONE("Drone / UAV", "Flight controllers, PX4, ArduPilot", "navigation"),
    AUTOMOTIVE("Automotive", "CAN bus, OBD-II, ADAS prototyping", "car"),
    MOTOR_CONTROL("Motor Control", "BLDC, stepper, FOC, H-bridge", "zap"),
    CNC("CNC / 3D Printer", "GRBL, Marlin, Klipper configs", "printer"),
    FPGA("FPGA / HDL", "Verilog, VHDL, Yosys, Vivado", "chip"),
    WEARABLE("Wearable / IoT", "BLE, sensors, low-power", "watch"),
    AUDIO_DSP("Audio / DSP", "Codec, I2S, effects, synth", "music"),
    INDUSTRIAL("Industrial", "Modbus, PLC, 4-20mA, RS-485", "factory");

    private final String displayName;
    private final String description;
    private final String icon;

    DeviceCategory(String displayName, String description, String icon) {
        this.displayName = displayName;
        this.description = description;
        this.icon = icon;
    }
}
