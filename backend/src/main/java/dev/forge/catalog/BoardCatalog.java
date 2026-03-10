package dev.forge.catalog;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class BoardCatalog {

    private final List<BoardDefinition> boards = List.of(
            // === MICROCONTROLLER ===
            new BoardDefinition("arduino-uno-r3", "Arduino Uno R3", DeviceCategory.MICROCONTROLLER, "ATmega328P", "Standard", List.of("UART", "SPI", "I2C"), List.of("14 digital I/O", "6 analog inputs", "16 MHz"), null),
            new BoardDefinition("arduino-mega-2560", "Arduino Mega 2560", DeviceCategory.MICROCONTROLLER, "ATmega2560", "Mega", List.of("UART x4", "SPI", "I2C"), List.of("54 digital I/O", "16 analog inputs", "16 MHz"), null),
            new BoardDefinition("arduino-nano", "Arduino Nano", DeviceCategory.MICROCONTROLLER, "ATmega328P", "Nano", List.of("UART", "SPI", "I2C"), List.of("14 digital I/O", "8 analog inputs", "compact"), null),
            new BoardDefinition("esp32-devkit-v1", "ESP32 DevKit V1", DeviceCategory.MICROCONTROLLER, "ESP32-WROOM-32", "DevKit", List.of("WiFi", "BLE", "UART", "SPI", "I2C"), List.of("34 GPIO", "240 MHz dual-core", "4MB flash"), null),
            new BoardDefinition("esp32-s3-devkit", "ESP32-S3 DevKitC", DeviceCategory.MICROCONTROLLER, "ESP32-S3", "DevKit", List.of("WiFi", "BLE 5.0", "USB-OTG", "SPI", "I2C"), List.of("45 GPIO", "AI acceleration", "vector instructions"), null),
            new BoardDefinition("esp32-c3-mini", "ESP32-C3 Mini", DeviceCategory.MICROCONTROLLER, "ESP32-C3", "Mini", List.of("WiFi", "BLE 5.0", "UART", "SPI", "I2C"), List.of("22 GPIO", "RISC-V core", "low power"), null),
            new BoardDefinition("stm32-bluepill", "STM32 Blue Pill", DeviceCategory.MICROCONTROLLER, "STM32F103C8T6", "Pill", List.of("UART", "SPI", "I2C", "CAN", "USB"), List.of("72 MHz ARM Cortex-M3", "64KB flash", "20KB SRAM"), null),
            new BoardDefinition("stm32-nucleo-f446re", "STM32 Nucleo-F446RE", DeviceCategory.MICROCONTROLLER, "STM32F446RE", "Nucleo-64", List.of("UART", "SPI", "I2C", "CAN", "USB"), List.of("180 MHz Cortex-M4", "512KB flash", "128KB SRAM"), null),
            new BoardDefinition("teensy-41", "Teensy 4.1", DeviceCategory.MICROCONTROLLER, "i.MX RT1062", "Teensy", List.of("USB", "Ethernet", "SPI", "I2C", "CAN"), List.of("600 MHz Cortex-M7", "8MB flash", "1MB SRAM"), null),
            new BoardDefinition("adafruit-feather-m4", "Adafruit Feather M4", DeviceCategory.MICROCONTROLLER, "ATSAMD51", "Feather", List.of("UART", "SPI", "I2C", "USB"), List.of("120 MHz Cortex-M4F", "512KB flash", "LiPo charger"), null),
            // === MICROPYTHON ===
            new BoardDefinition("rpi-pico", "Raspberry Pi Pico", DeviceCategory.MICROPYTHON, "RP2040", "Pico", List.of("UART", "SPI", "I2C", "PIO"), List.of("264KB SRAM", "dual-core 133 MHz", "26 GPIO"), null),
            new BoardDefinition("rpi-pico-w", "Raspberry Pi Pico W", DeviceCategory.MICROPYTHON, "RP2040", "Pico", List.of("WiFi", "BLE", "UART", "SPI", "I2C", "PIO"), List.of("264KB SRAM", "wireless", "26 GPIO"), null),
            new BoardDefinition("esp32-micropython", "ESP32 (MicroPython)", DeviceCategory.MICROPYTHON, "ESP32-WROOM-32", "DevKit", List.of("WiFi", "BLE", "UART", "SPI", "I2C"), List.of("MicroPython native", "4MB flash", "520KB SRAM"), null),
            new BoardDefinition("rpi-pico-2", "Raspberry Pi Pico 2", DeviceCategory.MICROPYTHON, "RP2350", "Pico", List.of("UART", "SPI", "I2C", "PIO"), List.of("520KB SRAM", "dual-core 150 MHz", "RISC-V option"), null),
            new BoardDefinition("adafruit-qtpy-rp2040", "Adafruit QT Py RP2040", DeviceCategory.MICROPYTHON, "RP2040", "QT Py", List.of("UART", "SPI", "I2C", "STEMMA QT"), List.of("Tiny form factor", "8MB flash", "CircuitPython"), null),
            // === LINUX SBC ===
            new BoardDefinition("rpi-4b", "Raspberry Pi 4B", DeviceCategory.LINUX_SBC, "BCM2711", "SBC", List.of("USB 3.0", "Gigabit Ethernet", "HDMI x2", "GPIO 40-pin", "WiFi", "BLE"), List.of("Quad Cortex-A72", "up to 8GB RAM", "USB-C power"), null),
            new BoardDefinition("rpi-5", "Raspberry Pi 5", DeviceCategory.LINUX_SBC, "BCM2712", "SBC", List.of("USB 3.0", "Gigabit Ethernet", "HDMI x2", "GPIO 40-pin", "WiFi 6", "BLE 5.0", "PCIe"), List.of("Quad Cortex-A76", "up to 8GB RAM", "RP1 I/O controller"), null),
            new BoardDefinition("jetson-nano", "NVIDIA Jetson Nano", DeviceCategory.LINUX_SBC, "Tegra X1", "Jetson", List.of("USB 3.0", "Gigabit Ethernet", "HDMI", "CSI", "GPIO 40-pin"), List.of("128 CUDA cores", "4GB RAM", "AI inference"), null),
            new BoardDefinition("jetson-orin-nano", "NVIDIA Jetson Orin Nano", DeviceCategory.LINUX_SBC, "Orin", "Jetson", List.of("USB 3.0", "Gigabit Ethernet", "HDMI", "CSI", "GPIO"), List.of("1024 CUDA cores", "up to 8GB RAM", "40 TOPS"), null),
            new BoardDefinition("beaglebone-black", "BeagleBone Black", DeviceCategory.LINUX_SBC, "AM3358", "BeagleBone", List.of("USB", "Ethernet", "HDMI", "GPIO", "PRU"), List.of("1 GHz Cortex-A8", "512MB RAM", "eMMC"), null),
            new BoardDefinition("orange-pi-5", "Orange Pi 5", DeviceCategory.LINUX_SBC, "RK3588S", "SBC", List.of("USB 3.0", "Gigabit Ethernet", "HDMI", "M.2", "GPIO 26-pin"), List.of("Octa-core A76+A55", "up to 16GB RAM", "6 TOPS NPU"), null),
            // === ROBOTICS ===
            new BoardDefinition("rpi-4b-ros2", "RPi 4B + ROS2", DeviceCategory.ROBOTICS, "BCM2711", "SBC", List.of("USB", "GPIO", "I2C", "Camera CSI"), List.of("ROS2 Humble", "SLAM capable", "Navigation2"), null),
            new BoardDefinition("jetson-nano-ros2", "Jetson Nano + ROS2", DeviceCategory.ROBOTICS, "Tegra X1", "Jetson", List.of("USB", "GPIO", "CSI", "I2C"), List.of("GPU-accelerated perception", "128 CUDA cores", "AI inference"), null),
            new BoardDefinition("esp32-microros", "ESP32 + micro-ROS", DeviceCategory.ROBOTICS, "ESP32", "DevKit", List.of("WiFi", "UART", "I2C", "SPI"), List.of("Real-time control", "micro-ROS agent", "wireless telemetry"), null),
            new BoardDefinition("arduino-servo-shield", "Arduino + Servo Shield", DeviceCategory.ROBOTICS, "ATmega328P", "Standard+Shield", List.of("I2C (PCA9685)", "UART", "SPI"), List.of("16-channel PWM", "servo control", "robotic arm compatible"), null),
            new BoardDefinition("stm32-robot-controller", "STM32 Robot Controller", DeviceCategory.ROBOTICS, "STM32F4", "Custom", List.of("CAN", "UART", "SPI", "I2C", "PWM"), List.of("Motor driver integration", "encoder input", "real-time control"), null),
            // === DRONE ===
            new BoardDefinition("pixhawk-6c", "Pixhawk 6C", DeviceCategory.DRONE, "STM32H743", "Pixhawk", List.of("CAN", "UART x6", "SPI", "I2C", "PWM x16"), List.of("PX4/ArduPilot", "triple IMU", "barometer"), null),
            new BoardDefinition("matek-h743", "Matek H743-Wing V3", DeviceCategory.DRONE, "STM32H743", "Wing FC", List.of("UART x7", "I2C", "SPI", "CAN", "PWM x12"), List.of("ArduPilot", "dual IMU", "OSD"), null),
            new BoardDefinition("speedybee-f405", "SpeedyBee F405 V4", DeviceCategory.DRONE, "STM32F405", "Whoop FC", List.of("UART x6", "SPI", "I2C", "PWM x8"), List.of("Betaflight/iNav", "built-in BLE", "30x30 mount"), null),
            new BoardDefinition("esp32-drone-micro", "ESP32 Micro Drone", DeviceCategory.DRONE, "ESP32", "Micro", List.of("WiFi", "UART", "I2C", "PWM x4"), List.of("Lightweight", "WiFi control", "sub-250g"), null),
            new BoardDefinition("kakute-h7-v2", "Holybro Kakute H7 V2", DeviceCategory.DRONE, "STM32H743", "Standard FC", List.of("UART x7", "SPI", "I2C", "CAN", "PWM x8"), List.of("Betaflight", "128MB flash", "dual gyro"), null),
            // === AUTOMOTIVE ===
            new BoardDefinition("esp32-obd2", "ESP32 + OBD-II", DeviceCategory.AUTOMOTIVE, "ESP32", "DevKit+Shield", List.of("CAN", "OBD-II", "WiFi", "BLE", "UART"), List.of("Vehicle diagnostics", "real-time data", "DTC reading"), null),
            new BoardDefinition("stm32-can-gateway", "STM32 CAN Gateway", DeviceCategory.AUTOMOTIVE, "STM32F446", "Nucleo+CAN", List.of("CAN x2", "UART", "SPI", "USB"), List.of("CAN bus sniffer", "gateway/bridge", "120 MHz"), null),
            new BoardDefinition("teensy-can-bus", "Teensy 4.1 CAN Bus", DeviceCategory.AUTOMOTIVE, "i.MX RT1062", "Teensy+CAN", List.of("CAN x3", "USB", "Ethernet", "UART"), List.of("FlexCAN library", "600 MHz", "data logging"), null),
            new BoardDefinition("rpi-carplay", "RPi 4 CarPlay", DeviceCategory.AUTOMOTIVE, "BCM2711", "SBC", List.of("USB", "HDMI", "WiFi", "BLE", "CAN HAT"), List.of("OpenAuto Pro", "CarPlay/Android Auto", "touchscreen"), null),
            new BoardDefinition("arduino-can-shield", "Arduino + CAN Shield", DeviceCategory.AUTOMOTIVE, "ATmega328P", "Standard+Shield", List.of("CAN (MCP2515)", "SPI", "UART"), List.of("CAN bus interface", "OBD-II compatible", "simple setup"), null),
            // === MOTOR CONTROL ===
            new BoardDefinition("odrive-s1", "ODrive S1", DeviceCategory.MOTOR_CONTROL, "STM32", "ODrive", List.of("CAN", "UART", "SPI", "USB", "Encoder"), List.of("FOC control", "BLDC/stepper", "56V 120A"), null),
            new BoardDefinition("stm32-foc", "STM32 + SimpleFOC", DeviceCategory.MOTOR_CONTROL, "STM32F4", "Nucleo+Driver", List.of("PWM x6", "ADC", "Encoder", "UART", "SPI"), List.of("SimpleFOC library", "BLDC/stepper", "current sensing"), null),
            new BoardDefinition("esp32-stepper", "ESP32 + TMC2209", DeviceCategory.MOTOR_CONTROL, "ESP32", "DevKit+Driver", List.of("UART (TMC)", "STEP/DIR", "SPI", "WiFi"), List.of("Silent stepper", "StallGuard", "CoolStep"), null),
            new BoardDefinition("arduino-motor-shield", "Arduino + Motor Shield", DeviceCategory.MOTOR_CONTROL, "ATmega328P", "Standard+Shield", List.of("PWM x4", "I2C", "UART"), List.of("Dual H-bridge", "DC motor x4 or stepper x2", "1.2A per channel"), null),
            new BoardDefinition("teensy-bldc", "Teensy 4.1 BLDC", DeviceCategory.MOTOR_CONTROL, "i.MX RT1062", "Teensy+Driver", List.of("PWM x6", "ADC", "Encoder", "USB", "CAN"), List.of("High-speed FOC", "600 MHz", "multi-motor"), null),
            // === CNC ===
            new BoardDefinition("esp32-grbl", "ESP32 GRBL Controller", DeviceCategory.CNC, "ESP32", "CNC Board", List.of("STEP/DIR x4", "WiFi", "UART", "SD"), List.of("FluidNC/GRBL_ESP32", "WiFi pendant", "4-axis"), null),
            new BoardDefinition("skr-mini-e3", "BTT SKR Mini E3 V3", DeviceCategory.CNC, "STM32G0B1", "3DP Board", List.of("UART (TMC2209)", "USB", "SD", "BLTouch"), List.of("Marlin/Klipper", "silent drivers", "Ender-3 drop-in"), null),
            new BoardDefinition("octopus-pro", "BTT Octopus Pro", DeviceCategory.CNC, "STM32F446", "3DP Board", List.of("UART/SPI (TMC)", "USB", "CAN", "SD", "Ethernet"), List.of("8 stepper drivers", "Klipper/Marlin", "high power"), null),
            new BoardDefinition("rpi-klipper", "RPi + Klipper", DeviceCategory.CNC, "BCM2711", "SBC+MCU", List.of("USB", "GPIO", "UART", "SPI"), List.of("Klipper host", "input shaping", "pressure advance"), null),
            new BoardDefinition("arduino-cnc-shield", "Arduino + CNC Shield", DeviceCategory.CNC, "ATmega328P", "Standard+Shield", List.of("STEP/DIR x3", "Spindle PWM", "Limit switches"), List.of("GRBL", "3-axis CNC", "A4988/DRV8825"), null),
            // === FPGA ===
            new BoardDefinition("tang-nano-9k", "Sipeed Tang Nano 9K", DeviceCategory.FPGA, "GW1NR-9C", "Nano", List.of("HDMI", "SPI Flash", "GPIO", "USB-C"), List.of("8640 LUT4", "Gowin EDA", "open-source friendly"), null),
            new BoardDefinition("ice40-icebreaker", "iCEBreaker FPGA", DeviceCategory.FPGA, "iCE40UP5K", "Breadboard", List.of("SPI", "I2C", "GPIO", "PMOD x3"), List.of("5280 LUT4", "Yosys/nextpnr", "fully open-source"), null),
            new BoardDefinition("de10-nano", "Terasic DE10-Nano", DeviceCategory.FPGA, "Cyclone V SE", "SBC+FPGA", List.of("HDMI", "Gigabit Ethernet", "USB", "GPIO 40-pin", "Arduino header"), List.of("110K LE", "Dual Cortex-A9 HPS", "MiSTer compatible"), null),
            new BoardDefinition("arty-a7-35t", "Digilent Arty A7-35T", DeviceCategory.FPGA, "Artix-7 XC7A35T", "Dev Board", List.of("Ethernet", "UART", "SPI", "PMOD x4", "Arduino header"), List.of("33280 LUT", "Vivado", "RISC-V soft-core"), null),
            new BoardDefinition("colorlight-5a-75e", "Colorlight 5A-75E", DeviceCategory.FPGA, "ECP5 LFE5U-25F", "LED Receiver", List.of("Gigabit Ethernet x2", "GPIO", "HUB75"), List.of("24K LUT4", "Yosys/nextpnr", "ultra low cost"), null),
            // === WEARABLE ===
            new BoardDefinition("esp32-c3-wearable", "ESP32-C3 Wearable", DeviceCategory.WEARABLE, "ESP32-C3", "Mini", List.of("BLE 5.0", "WiFi", "I2C", "SPI"), List.of("RISC-V", "ultra low power", "tiny footprint"), null),
            new BoardDefinition("nrf52840-feather", "Adafruit Feather nRF52840", DeviceCategory.WEARABLE, "nRF52840", "Feather", List.of("BLE 5.0", "USB", "I2C", "SPI", "NFC"), List.of("Cortex-M4F", "1MB flash", "LiPo charger"), null),
            new BoardDefinition("xiao-ble-sense", "Seeed XIAO BLE Sense", DeviceCategory.WEARABLE, "nRF52840", "XIAO", List.of("BLE 5.0", "I2C", "SPI", "USB-C"), List.of("IMU + microphone", "tiny 20x17mm", "battery connector"), null),
            new BoardDefinition("lilygo-t-display", "LILYGO T-Display S3", DeviceCategory.WEARABLE, "ESP32-S3", "T-Display", List.of("WiFi", "BLE", "USB-C", "I2C", "SPI"), List.of("1.9\" LCD", "touch", "battery management"), null),
            new BoardDefinition("rpi-pico-wearable", "Pico W Wearable", DeviceCategory.WEARABLE, "RP2040", "Pico", List.of("WiFi", "BLE", "I2C", "SPI"), List.of("Low power modes", "compact", "sensor hub"), null),
            // === AUDIO DSP ===
            new BoardDefinition("esp32-i2s-audio", "ESP32 I2S Audio", DeviceCategory.AUDIO_DSP, "ESP32", "DevKit+DAC", List.of("I2S", "WiFi", "BLE", "UART", "SPI"), List.of("PCM5102 DAC", "stereo output", "WiFi streaming"), null),
            new BoardDefinition("teensy-audio", "Teensy 4.1 Audio", DeviceCategory.AUDIO_DSP, "i.MX RT1062", "Teensy+Audio Shield", List.of("I2S", "USB Audio", "SPI", "I2C"), List.of("Teensy Audio Library", "SGTL5000 codec", "real-time effects"), null),
            new BoardDefinition("daisy-seed", "Electrosmith Daisy Seed", DeviceCategory.AUDIO_DSP, "STM32H750", "Seed", List.of("Audio I/O", "MIDI", "USB", "SPI", "I2C", "SAI"), List.of("480 MHz Cortex-M7", "stereo 96kHz/24bit", "libDaisy"), null),
            new BoardDefinition("rpi-hifiberry", "RPi + HiFiBerry DAC", DeviceCategory.AUDIO_DSP, "BCM2711", "SBC+HAT", List.of("I2S", "USB", "Ethernet", "WiFi", "GPIO"), List.of("Hi-Fi audio output", "ALSA/PulseAudio", "multi-room"), null),
            new BoardDefinition("adafruit-music-maker", "Arduino + Music Maker", DeviceCategory.AUDIO_DSP, "ATmega328P", "Standard+Shield", List.of("SPI (VS1053)", "MIDI", "SD card", "Line out"), List.of("MP3/MIDI/Ogg playback", "recording", "3.7W amp"), null),
            // === INDUSTRIAL ===
            new BoardDefinition("esp32-modbus", "ESP32 Modbus RTU/TCP", DeviceCategory.INDUSTRIAL, "ESP32", "DevKit+RS485", List.of("RS-485", "Modbus RTU/TCP", "WiFi", "UART", "I2C"), List.of("Industrial gateway", "WiFi bridge", "DIN rail mount option"), null),
            new BoardDefinition("stm32-industrial", "STM32 Industrial I/O", DeviceCategory.INDUSTRIAL, "STM32F4", "Industrial", List.of("RS-485", "RS-232", "CAN", "4-20mA", "0-10V", "DI/DO"), List.of("PLC replacement", "analog I/O", "real-time control"), null),
            new BoardDefinition("rpi-industrial", "RPi + Industrial HAT", DeviceCategory.INDUSTRIAL, "BCM2711", "SBC+HAT", List.of("RS-485", "CAN", "DI x8", "DO x4", "AI x4", "Ethernet"), List.of("Node-RED", "MQTT", "SCADA gateway"), null),
            new BoardDefinition("arduino-plc", "Arduino Opta (PLC)", DeviceCategory.INDUSTRIAL, "STM32H747", "Micro PLC", List.of("Ethernet", "RS-485", "USB-C", "I2C", "DI x8", "Relay x4"), List.of("IEC 61131-3", "Arduino IDE + PLC IDE", "industrial rated"), null),
            new BoardDefinition("wago-pfc200", "WAGO PFC200", DeviceCategory.INDUSTRIAL, "Cortex-A7", "PLC", List.of("Ethernet x2", "RS-232/485", "CAN", "PROFIBUS", "Modbus"), List.of("CODESYS runtime", "Docker support", "e!COCKPIT"), null)
    );

    public List<BoardDefinition> getAll() {
        return boards;
    }

    public List<BoardDefinition> getByCategory(DeviceCategory category) {
        return boards.stream().filter(b -> b.category() == category).collect(Collectors.toList());
    }

    public Optional<BoardDefinition> findById(String id) {
        return boards.stream().filter(b -> b.id().equals(id)).findFirst();
    }

    public List<DeviceCategory> getCategories() {
        return List.of(DeviceCategory.values());
    }
}
