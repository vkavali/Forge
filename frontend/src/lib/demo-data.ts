import { DeviceCategoryInfo, BoardDefinition, Project, GenerationJob } from './types';

export const DEMO_TOKEN = 'demo-token';
export const DEMO_USER = { userId: 'demo-user', email: 'demo@theshipboard.dev', name: 'Demo User' };

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('token') === DEMO_TOKEN;
}

export function enterDemoMode() {
  localStorage.setItem('token', DEMO_TOKEN);
  localStorage.setItem('userId', DEMO_USER.userId);
  localStorage.setItem('userEmail', DEMO_USER.email);
  localStorage.setItem('userName', DEMO_USER.name);
}

export const demoCategories: DeviceCategoryInfo[] = [
  { id: 'MICROCONTROLLER', displayName: 'Microcontroller', description: 'Arduino, ESP32, STM32, ATmega', icon: 'cpu' },
  { id: 'MICROPYTHON', displayName: 'MicroPython', description: 'RP2040, ESP32 with Python', icon: 'code' },
  { id: 'LINUX_SBC', displayName: 'Linux SBC', description: 'Raspberry Pi, Jetson Nano, BeagleBone', icon: 'server' },
  { id: 'ROBOTICS', displayName: 'Robotics', description: 'ROS2, Servo, Kinematics', icon: 'bot' },
  { id: 'DRONE', displayName: 'Drone / UAV', description: 'PX4, ArduPilot, Betaflight', icon: 'navigation' },
  { id: 'AUTOMOTIVE', displayName: 'Automotive', description: 'CAN bus, OBD-II, J1939', icon: 'car' },
  { id: 'MOTOR_CONTROL', displayName: 'Motor Control', description: 'BLDC, FOC, Stepper, Servo', icon: 'zap' },
  { id: 'CNC', displayName: 'CNC / 3D Printer', description: 'GRBL, Marlin, Klipper', icon: 'printer' },
  { id: 'FPGA', displayName: 'FPGA / HDL', description: 'Verilog, VHDL, Yosys, Lattice', icon: 'chip' },
  { id: 'WEARABLE', displayName: 'Wearable / IoT', description: 'BLE, Sensors, Low-power', icon: 'watch' },
  { id: 'AUDIO_DSP', displayName: 'Audio / DSP', description: 'I2S, Effects, Synth, DAC', icon: 'music' },
  { id: 'INDUSTRIAL', displayName: 'Industrial', description: 'Modbus, PLC, RS-485, 4-20mA', icon: 'factory' },
];

export const demoBoards: BoardDefinition[] = [
  // MICROCONTROLLER
  { id: 'arduino-uno-r3', name: 'Arduino Uno R3', category: 'MICROCONTROLLER', processor: 'ATmega328P @ 16MHz', formFactor: 'Standard', interfaces: ['UART', 'SPI', 'I2C', 'GPIO'], features: ['14 Digital I/O', '6 Analog Inputs', '32KB Flash'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'arduino-mega-2560', name: 'Arduino Mega 2560', category: 'MICROCONTROLLER', processor: 'ATmega2560 @ 16MHz', formFactor: 'Mega', interfaces: ['UART x4', 'SPI', 'I2C', 'GPIO'], features: ['54 Digital I/O', '16 Analog', '256KB Flash'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'esp32-devkitc', name: 'ESP32-DevKitC', category: 'MICROCONTROLLER', processor: 'ESP32 Dual-Core @ 240MHz', formFactor: 'DevKit', interfaces: ['WiFi', 'BLE', 'SPI', 'I2C', 'UART', 'ADC', 'DAC'], features: ['520KB SRAM', '4MB Flash', 'WiFi + BLE'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'esp32-s3-devkitc', name: 'ESP32-S3-DevKitC', category: 'MICROCONTROLLER', processor: 'ESP32-S3 Dual-Core @ 240MHz', formFactor: 'DevKit', interfaces: ['WiFi', 'BLE 5.0', 'USB OTG', 'SPI', 'I2C', 'LCD'], features: ['512KB SRAM', 'AI Acceleration', 'USB OTG'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'stm32-bluepill', name: 'STM32 Blue Pill', category: 'MICROCONTROLLER', processor: 'STM32F103C8T6 @ 72MHz', formFactor: 'Breadboard', interfaces: ['UART', 'SPI', 'I2C', 'CAN', 'USB'], features: ['64KB Flash', '20KB SRAM', 'ARM Cortex-M3'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'stm32-nucleo-f446re', name: 'STM32 Nucleo-F446RE', category: 'MICROCONTROLLER', processor: 'STM32F446RE @ 180MHz', formFactor: 'Nucleo-64', interfaces: ['UART', 'SPI', 'I2C', 'CAN', 'USB', 'DAC'], features: ['512KB Flash', '128KB SRAM', 'Arduino-compatible'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'teensy-41', name: 'Teensy 4.1', category: 'MICROCONTROLLER', processor: 'ARM Cortex-M7 @ 600MHz', formFactor: 'Breadboard', interfaces: ['USB', 'Ethernet', 'SPI', 'I2C', 'CAN', 'I2S'], features: ['8MB Flash', '1MB RAM', 'SD Card'], imageUrl: '', platformioId: null, framework: null, language: null },

  // MICROPYTHON
  { id: 'rp2040-pico', name: 'Raspberry Pi Pico', category: 'MICROPYTHON', processor: 'RP2040 Dual-Core @ 133MHz', formFactor: 'Pico', interfaces: ['UART', 'SPI', 'I2C', 'ADC', 'PWM'], features: ['264KB SRAM', '2MB Flash', 'PIO'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'rp2040-pico-w', name: 'Raspberry Pi Pico W', category: 'MICROPYTHON', processor: 'RP2040 @ 133MHz + CYW43439', formFactor: 'Pico', interfaces: ['WiFi', 'BLE', 'UART', 'SPI', 'I2C'], features: ['264KB SRAM', '2MB Flash', 'WiFi'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'esp32-micropython', name: 'ESP32 (MicroPython)', category: 'MICROPYTHON', processor: 'ESP32 Dual-Core @ 240MHz', formFactor: 'DevKit', interfaces: ['WiFi', 'BLE', 'SPI', 'I2C', 'ADC'], features: ['520KB SRAM', 'MicroPython REPL', 'WiFi'], imageUrl: '', platformioId: null, framework: null, language: null },

  // LINUX_SBC
  { id: 'rpi-4b', name: 'Raspberry Pi 4 Model B', category: 'LINUX_SBC', processor: 'BCM2711 Quad-Core @ 1.8GHz', formFactor: 'SBC', interfaces: ['USB 3.0', 'Gigabit Ethernet', 'WiFi', 'BLE', 'HDMI x2', 'GPIO'], features: ['Up to 8GB RAM', 'USB-C Power', 'Full Linux'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'rpi-5', name: 'Raspberry Pi 5', category: 'LINUX_SBC', processor: 'BCM2712 Quad-Core @ 2.4GHz', formFactor: 'SBC', interfaces: ['USB 3.0', 'PCIe', 'Gigabit Ethernet', 'WiFi 5', 'BLE 5.0', 'HDMI x2'], features: ['Up to 8GB RAM', 'PCIe 2.0', 'Real-time Clock'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'jetson-nano', name: 'NVIDIA Jetson Nano', category: 'LINUX_SBC', processor: 'Quad-Core A57 @ 1.43GHz + 128-core GPU', formFactor: 'Module', interfaces: ['USB 3.0', 'Gigabit Ethernet', 'HDMI', 'CSI', 'GPIO'], features: ['4GB RAM', 'CUDA Cores', 'AI Inference'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'beaglebone-black', name: 'BeagleBone Black', category: 'LINUX_SBC', processor: 'AM3358 @ 1GHz', formFactor: 'SBC', interfaces: ['USB', 'Ethernet', 'HDMI', 'GPIO', 'PRU'], features: ['512MB RAM', 'PRU Processors', 'Cape Support'], imageUrl: '', platformioId: null, framework: null, language: null },

  // ROBOTICS
  { id: 'arduino-mega-ros', name: 'Arduino Mega (ROS)', category: 'ROBOTICS', processor: 'ATmega2560 @ 16MHz', formFactor: 'Mega', interfaces: ['UART x4', 'SPI', 'I2C', 'PWM'], features: ['rosserial', '54 I/O', 'Motor Shields'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'rpi-4-ros2', name: 'Raspberry Pi 4 (ROS2)', category: 'ROBOTICS', processor: 'BCM2711 @ 1.8GHz', formFactor: 'SBC', interfaces: ['USB', 'WiFi', 'I2C', 'SPI', 'Camera'], features: ['ROS2 Humble', 'Nav2', 'Computer Vision'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'jetson-orin-nano', name: 'Jetson Orin Nano', category: 'ROBOTICS', processor: 'Arm A78AE + Ampere GPU', formFactor: 'Module', interfaces: ['USB 3.2', 'PCIe', 'CSI', 'I2C', 'SPI'], features: ['40 TOPS AI', '8GB RAM', 'Isaac ROS'], imageUrl: '', platformioId: null, framework: null, language: null },

  // DRONE
  { id: 'pixhawk-6c', name: 'Pixhawk 6C', category: 'DRONE', processor: 'STM32H743 @ 480MHz', formFactor: 'Flight Controller', interfaces: ['UART x8', 'CAN x2', 'SPI', 'I2C', 'PWM x16', 'USB'], features: ['IMU x3', 'Barometer x2', 'ArduPilot/PX4'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'speedybee-f405', name: 'SpeedyBee F405 V4', category: 'DRONE', processor: 'STM32F405 @ 168MHz', formFactor: 'Stack', interfaces: ['UART x6', 'I2C', 'SPI', 'USB', 'OSD'], features: ['Betaflight', 'Blackbox', 'Bluetooth Config'], imageUrl: '', platformioId: null, framework: null, language: null },

  // AUTOMOTIVE
  { id: 'esp32-can', name: 'ESP32 + MCP2515 CAN', category: 'AUTOMOTIVE', processor: 'ESP32 @ 240MHz', formFactor: 'DevKit', interfaces: ['CAN Bus', 'WiFi', 'BLE', 'OBD-II', 'UART'], features: ['CAN 2.0B', 'OBD-II Scanner', 'Data Logging'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'stm32-canbus', name: 'STM32 Nucleo CAN', category: 'AUTOMOTIVE', processor: 'STM32F446RE @ 180MHz', formFactor: 'Nucleo-64', interfaces: ['CAN x2', 'UART', 'SPI', 'I2C', 'USB'], features: ['Dual CAN', 'J1939', 'ISO-TP'], imageUrl: '', platformioId: null, framework: null, language: null },

  // MOTOR_CONTROL
  { id: 'odrive-s1', name: 'ODrive S1', category: 'MOTOR_CONTROL', processor: 'STM32H725 @ 550MHz', formFactor: 'Module', interfaces: ['CAN', 'USB', 'UART', 'Encoder', 'Hall'], features: ['FOC Control', '120A Peak', 'BLDC/PMSM'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'esp32-bldc', name: 'ESP32 + SimpleFOC', category: 'MOTOR_CONTROL', processor: 'ESP32 @ 240MHz', formFactor: 'DevKit', interfaces: ['PWM', 'ADC', 'Encoder', 'I2C', 'WiFi'], features: ['SimpleFOC Library', '3-Phase', 'Stepper/BLDC'], imageUrl: '', platformioId: null, framework: null, language: null },

  // CNC
  { id: 'skr-mini-e3', name: 'BTT SKR Mini E3 V3', category: 'CNC', processor: 'STM32G0B1RE @ 64MHz', formFactor: '3D Printer Board', interfaces: ['UART', 'USB', 'SPI', 'TMC2209 x4'], features: ['Marlin/Klipper', 'TMC Drivers', 'Silent Steppers'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'arduino-cnc-shield', name: 'Arduino CNC Shield', category: 'CNC', processor: 'ATmega328P @ 16MHz', formFactor: 'Shield', interfaces: ['UART', 'Step/Dir x4', 'Limit Switches'], features: ['GRBL', '3-Axis', 'A4988/DRV8825'], imageUrl: '', platformioId: null, framework: null, language: null },

  // FPGA
  { id: 'tang-nano-9k', name: 'Tang Nano 9K', category: 'FPGA', processor: 'GW1NR-9 (Gowin)', formFactor: 'Breadboard', interfaces: ['HDMI', 'SPI Flash', 'GPIO', 'USB-C'], features: ['8640 LUT', 'Open-source Toolchain', 'HDMI Output'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'ice40-icebreaker', name: 'iCEBreaker FPGA', category: 'FPGA', processor: 'iCE40UP5K (Lattice)', formFactor: 'Breadboard', interfaces: ['SPI', 'I2C', 'GPIO', 'PMOD'], features: ['5280 LUT', 'Yosys/nextpnr', 'Open-source'], imageUrl: '', platformioId: null, framework: null, language: null },

  // WEARABLE
  { id: 'xiao-nrf52840', name: 'Seeed XIAO nRF52840', category: 'WEARABLE', processor: 'nRF52840 @ 64MHz', formFactor: 'Tiny', interfaces: ['BLE 5.0', 'NFC', 'I2C', 'SPI', 'USB'], features: ['21x17.5mm', 'IMU', 'Ultra Low-power'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'esp32-c3-mini', name: 'ESP32-C3 SuperMini', category: 'WEARABLE', processor: 'ESP32-C3 RISC-V @ 160MHz', formFactor: 'Tiny', interfaces: ['WiFi', 'BLE 5.0', 'I2C', 'SPI', 'ADC'], features: ['22x18mm', '400KB SRAM', 'Deep Sleep 5uA'], imageUrl: '', platformioId: null, framework: null, language: null },

  // AUDIO_DSP
  { id: 'esp32-a1s', name: 'ESP32-A1S Audio', category: 'AUDIO_DSP', processor: 'ESP32 @ 240MHz + ES8388', formFactor: 'Module', interfaces: ['I2S', 'WiFi', 'BLE', 'Line In/Out', 'MIC'], features: ['24-bit DAC/ADC', 'Audio Codec', 'ADF Support'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'daisy-seed', name: 'Electrosmith Daisy Seed', category: 'AUDIO_DSP', processor: 'STM32H750 @ 480MHz', formFactor: 'Breadboard', interfaces: ['I2S', 'USB', 'UART', 'ADC x12', 'DAC x2'], features: ['24-bit Audio', '64MB SDRAM', 'DSP Library'], imageUrl: '', platformioId: null, framework: null, language: null },

  // INDUSTRIAL
  { id: 'esp32-modbus', name: 'ESP32 + RS-485', category: 'INDUSTRIAL', processor: 'ESP32 @ 240MHz', formFactor: 'DIN Rail', interfaces: ['RS-485', 'Modbus RTU', 'WiFi', 'I2C', 'ADC'], features: ['Modbus Master/Slave', 'DIN Rail', '24V Input'], imageUrl: '', platformioId: null, framework: null, language: null },
  { id: 'arduino-opta', name: 'Arduino Opta', category: 'INDUSTRIAL', processor: 'STM32H747 Dual-Core', formFactor: 'DIN Rail', interfaces: ['Ethernet', 'RS-485', 'USB-C', 'I2C', 'Relays x4'], features: ['PLC Runtime', 'Industrial Grade', 'WiFi/BLE'], imageUrl: '', platformioId: null, framework: null, language: null },
];

export function getDemoBoardsByCategory(category: string): BoardDefinition[] {
  return demoBoards.filter((b) => b.category === category);
}

export const demoCodeArtifact = `#include <WiFi.h>
#include <PubSubClient.h>
#include "config.h"

// ===== Pin Definitions =====
#define MOISTURE_PIN    34   // ADC1_CH6
#define PUMP_RELAY_PIN  25   // GPIO25
#define LED_STATUS_PIN   2   // Built-in LED

// ===== Configuration =====
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASS     = "YOUR_WIFI_PASS";
const char* MQTT_BROKER   = "broker.hivemq.com";
const int   MQTT_PORT     = 1883;
const char* DEVICE_ID     = "shipboard-soil-001";
const float THRESHOLD_DRY = 30.0;
const int   READ_INTERVAL = 5000;

WiFiClient wifiClient;
PubSubClient mqtt(wifiClient);

// ===== Setup =====
void setup() {
    Serial.begin(115200);
    delay(1000);
    Serial.println("[TheShipboard] Initializing...");

    // Configure pins
    pinMode(PUMP_RELAY_PIN, OUTPUT);
    pinMode(LED_STATUS_PIN, OUTPUT);
    digitalWrite(PUMP_RELAY_PIN, LOW);

    // Connect WiFi
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
        digitalWrite(LED_STATUS_PIN, !digitalRead(LED_STATUS_PIN));
    }
    Serial.println(" Connected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());

    // Connect MQTT
    mqtt.setServer(MQTT_BROKER, MQTT_PORT);
    while (!mqtt.connected()) {
        if (mqtt.connect(DEVICE_ID)) {
            Serial.println("MQTT connected");
        } else {
            delay(2000);
        }
    }

    digitalWrite(LED_STATUS_PIN, HIGH);
    Serial.println("[TheShipboard] Firmware ready.");
}

// ===== Main Loop =====
void loop() {
    mqtt.loop();

    // Read moisture sensor
    int raw = analogRead(MOISTURE_PIN);
    float percent = map(raw, 4095, 0, 0, 100);

    Serial.printf("Moisture: %.1f%%\\n", percent);

    // Publish to MQTT
    char payload[32];
    snprintf(payload, sizeof(payload), "%.1f", percent);
    mqtt.publish("garden/moisture", payload);

    // Auto-irrigation control
    if (percent < THRESHOLD_DRY) {
        digitalWrite(PUMP_RELAY_PIN, HIGH);
        mqtt.publish("garden/pump", "ON");
        Serial.println("Pump ON - soil is dry");
    } else {
        digitalWrite(PUMP_RELAY_PIN, LOW);
        mqtt.publish("garden/pump", "OFF");
    }

    delay(READ_INTERVAL);
}`;

export const demoDocsArtifact = `# Smart Soil Moisture Monitor

## Architecture Overview

This project uses an **ESP32-DevKitC** to monitor soil moisture levels and automatically control an irrigation pump. Data is published to an MQTT broker for remote monitoring.

## Pin Mapping

| Pin | Component | Function |
|-----|-----------|----------|
| GPIO34 (ADC1_CH6) | Capacitive Soil Moisture Sensor v1.2 | Analog moisture reading |
| GPIO25 | 5V Relay Module | Pump control (active HIGH) |
| GPIO2 | Built-in LED | Status indicator |

## Wiring Diagram

\`\`\`
ESP32-DevKitC
├── GPIO34 ──── Moisture Sensor (Analog Out)
├── GPIO25 ──── Relay Module (IN) ──── Water Pump (NO)
├── GPIO2  ──── Built-in LED
├── 3V3    ──── Moisture Sensor (VCC)
├── 5V     ──── Relay Module (VCC)
└── GND    ──── Common Ground
\`\`\`

## Communication Protocol

- **WiFi**: 802.11 b/g/n for network connectivity
- **MQTT**: QoS 0 publish to \`garden/moisture\` and \`garden/pump\` topics
- **Serial**: 115200 baud for debug output

## Configuration

Edit the following constants in \`main.cpp\`:
- \`WIFI_SSID\` / \`WIFI_PASS\`: Your WiFi credentials
- \`MQTT_BROKER\`: MQTT broker address (default: broker.hivemq.com)
- \`THRESHOLD_DRY\`: Moisture percentage below which pump activates (default: 30%)
- \`READ_INTERVAL\`: Sensor read interval in ms (default: 5000)

## Behavior

1. On boot: connects to WiFi, then MQTT broker
2. Every 5 seconds: reads moisture sensor via ADC
3. Publishes moisture percentage to MQTT topic
4. If moisture < 30%: activates pump relay
5. If moisture >= 30%: deactivates pump relay
6. LED blinks during WiFi connection, stays solid when ready
`;

export const demoBomArtifact = `Component,Quantity,Specification,Estimated Cost (USD),Supplier
ESP32-DevKitC V4,1,Dual-core 240MHz WiFi+BLE,8.50,Amazon/AliExpress
Capacitive Soil Moisture Sensor v1.2,1,Analog output 0-3V,2.50,Amazon/AliExpress
5V Relay Module,1,Single channel optocoupler isolated,1.50,Amazon/AliExpress
Mini Water Pump,1,3-6V DC submersible,3.00,Amazon/AliExpress
Silicone Tubing,1m,6mm OD 4mm ID,1.00,Hardware store
Jumper Wires,10,Male-to-Female Dupont,1.50,Amazon
Breadboard,1,830-point full size,3.00,Amazon
USB-C Cable,1,Data + Power,2.00,Amazon
5V 2A Power Supply,1,USB-C or Micro-USB,4.00,Amazon
,,Total,27.00,`;

export const demoReadmeArtifact = `# Deploy Instructions — Smart Soil Moisture Monitor

## Prerequisites

- **PlatformIO** or **Arduino IDE** installed
- USB-C cable for flashing
- WiFi network available

## Quick Start with PlatformIO

\`\`\`bash
# Clone the generated project
cd smart-soil-moisture-monitor

# Build
pio run

# Flash to ESP32
pio run --target upload

# Monitor serial output
pio device monitor --baud 115200
\`\`\`

## Quick Start with Arduino IDE

1. Open Arduino IDE
2. Go to **File → Preferences**, add ESP32 board URL:
   \`https://dl.espressif.com/dl/package_esp32_index.json\`
3. Go to **Tools → Board → Board Manager**, install "ESP32 by Espressif"
4. Select board: **ESP32 Dev Module**
5. Install libraries via Library Manager:
   - \`PubSubClient\` by Nick O'Leary
   - \`WiFi\` (built-in)
6. Open \`main.cpp\`, update WiFi credentials
7. Click **Upload**

## Testing

1. Open Serial Monitor at 115200 baud
2. Watch for "Firmware ready" message
3. Insert moisture sensor into soil or water
4. Verify MQTT messages at \`garden/moisture\`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| WiFi won't connect | Check SSID/password, ensure 2.4GHz network |
| MQTT connection fails | Verify broker address, check firewall |
| Moisture reads 0% always | Check wiring on GPIO34, verify sensor VCC |
| Pump won't activate | Check relay wiring, verify GPIO25 output |
`;

let demoProjectCounter = 0;

export function createDemoProject(data: {
  name: string;
  description: string;
  category: string;
  boardId: string;
  connectionsConfig: Record<string, unknown>;
  behaviorSpec: string;
}): { project: Project; job: GenerationJob } {
  demoProjectCounter++;
  const projectId = `demo-project-${demoProjectCounter}`;
  const jobId = `demo-job-${demoProjectCounter}`;
  const now = new Date().toISOString();

  const project: Project = {
    id: projectId,
    name: data.name,
    description: data.description,
    category: data.category,
    boardId: data.boardId,
    connectionsConfig: data.connectionsConfig,
    behaviorSpec: data.behaviorSpec,
    extraConfig: {},
    intentModel: null,
    educationMode: false,
    educationLevel: null,
    subjectArea: null,
    status: 'GENERATED',
    createdAt: now,
    updatedAt: now,
  };

  const job: GenerationJob = {
    id: jobId,
    projectId,
    status: 'COMPLETED',
    pipelineType: 'HYBRID',
    progress: 100,
    currentStep: 'Complete',
    currentLayer: 4,
    compileSuccess: null,
    compileLog: null,
    artifactKeys: [
      `${projectId}/code.txt`,
      `${projectId}/docs.md`,
      `${projectId}/bom.csv`,
      `${projectId}/README.md`,
    ],
    errorMessage: null,
    startedAt: now,
    completedAt: now,
    createdAt: now,
  };

  // Store in localStorage for the demo
  const stored = JSON.parse(localStorage.getItem('demoProjects') || '[]');
  stored.unshift(project);
  localStorage.setItem('demoProjects', JSON.stringify(stored));

  const storedJobs = JSON.parse(localStorage.getItem('demoJobs') || '[]');
  storedJobs.unshift(job);
  localStorage.setItem('demoJobs', JSON.stringify(storedJobs));

  return { project, job };
}

export function getDemoProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('demoProjects') || '[]');
}

export function getDemoProject(id: string): Project | null {
  return getDemoProjects().find((p) => p.id === id) || null;
}

export function getDemoJobs(projectId: string): GenerationJob[] {
  if (typeof window === 'undefined') return [];
  const all: GenerationJob[] = JSON.parse(localStorage.getItem('demoJobs') || '[]');
  return all.filter((j) => j.projectId === projectId);
}

export function getDemoArtifacts(): Record<string, string> {
  return {
    '/code.txt': demoCodeArtifact,
    '/docs.md': demoDocsArtifact,
    '/bom.csv': demoBomArtifact,
    '/README.md': demoReadmeArtifact,
  };
}
