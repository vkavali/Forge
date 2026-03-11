package com.theshipboard.catalog;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class LibraryCatalog {

    public record LibraryEntry(String name, String platformioLib, String headerInclude, String description) {}

    private final Map<String, List<LibraryEntry>> catalog = Map.ofEntries(
        // Sensors
        Map.entry("dht11", List.of(new LibraryEntry("DHT sensor library", "adafruit/DHT sensor library@^1.4.6", "#include <DHT.h>", "DHT11/22 temperature & humidity"))),
        Map.entry("dht22", List.of(new LibraryEntry("DHT sensor library", "adafruit/DHT sensor library@^1.4.6", "#include <DHT.h>", "DHT22 temperature & humidity"))),
        Map.entry("bme280", List.of(new LibraryEntry("Adafruit BME280", "adafruit/Adafruit BME280 Library@^2.2.4", "#include <Adafruit_BME280.h>", "Temp/humidity/pressure"))),
        Map.entry("bmp280", List.of(new LibraryEntry("Adafruit BMP280", "adafruit/Adafruit BMP280 Library@^2.6.8", "#include <Adafruit_BMP280.h>", "Temperature/pressure"))),
        Map.entry("mpu6050", List.of(new LibraryEntry("Adafruit MPU6050", "adafruit/Adafruit MPU6050@^2.2.6", "#include <Adafruit_MPU6050.h>", "6-axis IMU"))),
        Map.entry("hcsr04", List.of(new LibraryEntry("NewPing", "teckel12/NewPing@^1.9.7", "#include <NewPing.h>", "Ultrasonic distance"))),
        Map.entry("ds18b20", List.of(new LibraryEntry("DallasTemperature", "milesburton/DallasTemperature@^3.11.0", "#include <DallasTemperature.h>", "1-Wire temperature"))),
        Map.entry("bh1750", List.of(new LibraryEntry("BH1750", "claws/BH1750@^1.3.0", "#include <BH1750.h>", "Light intensity"))),
        Map.entry("max30102", List.of(new LibraryEntry("SparkFun MAX3010x", "sparkfun/SparkFun MAX3010x Pulse and Proximity Sensor Library@^1.1.2", "#include <MAX30105.h>", "Pulse oximeter"))),
        Map.entry("ina219", List.of(new LibraryEntry("Adafruit INA219", "adafruit/Adafruit INA219@^1.2.1", "#include <Adafruit_INA219.h>", "Current/voltage"))),
        Map.entry("vl53l0x", List.of(new LibraryEntry("Adafruit VL53L0X", "adafruit/Adafruit_VL53L0X@^1.2.4", "#include <Adafruit_VL53L0X.h>", "ToF distance"))),
        Map.entry("ads1115", List.of(new LibraryEntry("Adafruit ADS1X15", "adafruit/Adafruit ADS1X15@^2.5.0", "#include <Adafruit_ADS1X15.h>", "16-bit ADC"))),
        // Displays
        Map.entry("ssd1306", List.of(new LibraryEntry("Adafruit SSD1306", "adafruit/Adafruit SSD1306@^2.5.9", "#include <Adafruit_SSD1306.h>", "128x64 OLED"))),
        Map.entry("lcd1602", List.of(new LibraryEntry("LiquidCrystal I2C", "marcoschwartz/LiquidCrystal_I2C@^1.1.4", "#include <LiquidCrystal_I2C.h>", "16x2 LCD I2C"))),
        Map.entry("st7735", List.of(new LibraryEntry("Adafruit ST7735", "adafruit/Adafruit ST7735 and ST7789 Library@^1.10.4", "#include <Adafruit_ST7735.h>", "TFT color display"))),
        Map.entry("ili9341", List.of(new LibraryEntry("Adafruit ILI9341", "adafruit/Adafruit ILI9341@^1.6.0", "#include <Adafruit_ILI9341.h>", "2.4\" TFT"))),
        Map.entry("neopixel", List.of(new LibraryEntry("Adafruit NeoPixel", "adafruit/Adafruit NeoPixel@^1.12.0", "#include <Adafruit_NeoPixel.h>", "WS2812B LEDs"))),
        Map.entry("max7219", List.of(new LibraryEntry("MD_MAX72XX", "majicdesigns/MD_MAX72XX@^3.5.1", "#include <MD_MAX72XX.h>", "LED matrix"))),
        // Actuators
        Map.entry("servo", List.of(new LibraryEntry("Servo", "arduino-libraries/Servo@^1.2.1", "#include <Servo.h>", "Standard servo motor"))),
        Map.entry("pca9685", List.of(new LibraryEntry("Adafruit PWM Servo Driver", "adafruit/Adafruit PWM Servo Driver Library@^3.0.2", "#include <Adafruit_PWMServoDriver.h>", "16-ch PWM"))),
        Map.entry("stepper_a4988", List.of(new LibraryEntry("AccelStepper", "waspinator/AccelStepper@^1.64", "#include <AccelStepper.h>", "Stepper motor A4988"))),
        Map.entry("tmc2209", List.of(new LibraryEntry("TMCStepper", "teemuatlut/TMCStepper@^0.7.3", "#include <TMCStepper.h>", "TMC2209 stepper driver"))),
        Map.entry("l298n", List.of(new LibraryEntry("L298N", "andrea-steri/L298N@^2.0.0", "#include <L298N.h>", "Dual H-bridge"))),
        Map.entry("relay", List.of(new LibraryEntry("", "", "", "Relay module (GPIO)"))),
        // Communication
        Map.entry("wifi", List.of(new LibraryEntry("WiFi", "", "#include <WiFi.h>", "ESP32 WiFi"))),
        Map.entry("ble", List.of(new LibraryEntry("BLE", "", "#include <BLEDevice.h>", "ESP32 BLE"))),
        Map.entry("mqtt", List.of(new LibraryEntry("PubSubClient", "knolleary/PubSubClient@^2.8", "#include <PubSubClient.h>", "MQTT client"))),
        Map.entry("lorawan", List.of(new LibraryEntry("LMIC", "mcci-catena/MCCI LoRaWAN LMIC library@^4.1.1", "#include <lmic.h>", "LoRaWAN"))),
        Map.entry("espnow", List.of(new LibraryEntry("ESP-NOW", "", "#include <esp_now.h>", "ESP-NOW protocol"))),
        Map.entry("can_bus", List.of(new LibraryEntry("MCP_CAN", "coryjfowler/mcp_can@^1.5.0", "#include <mcp_can.h>", "CAN bus MCP2515"))),
        Map.entry("modbus_rtu", List.of(new LibraryEntry("ModbusMaster", "4-20ma/ModbusMaster@^2.0.1", "#include <ModbusMaster.h>", "Modbus RTU"))),
        Map.entry("rs485", List.of(new LibraryEntry("ArduinoRS485", "arduino-libraries/ArduinoRS485@^1.0.5", "#include <ArduinoRS485.h>", "RS-485"))),
        // Storage
        Map.entry("sd_card", List.of(new LibraryEntry("SD", "arduino-libraries/SD@^1.2.4", "#include <SD.h>", "SD card"))),
        Map.entry("eeprom", List.of(new LibraryEntry("EEPROM", "", "#include <EEPROM.h>", "EEPROM storage"))),
        Map.entry("spiffs", List.of(new LibraryEntry("SPIFFS", "", "#include <SPIFFS.h>", "SPI Flash File System"))),
        Map.entry("littlefs", List.of(new LibraryEntry("LittleFS", "", "#include <LittleFS.h>", "LittleFS"))),
        // Audio
        Map.entry("i2s_dac", List.of(new LibraryEntry("ESP32-audioI2S", "schreibfaul1/ESP32-audioI2S@^2.0.0", "#include <Audio.h>", "I2S DAC audio"))),
        Map.entry("dfplayer", List.of(new LibraryEntry("DFRobotDFPlayerMini", "dfrobot/DFRobotDFPlayerMini@^1.0.6", "#include <DFRobotDFPlayerMini.h>", "DFPlayer Mini MP3"))),
        // Motor control
        Map.entry("simplefoc", List.of(new LibraryEntry("Simple FOC", "askuric/Simple FOC@^2.3.3", "#include <SimpleFOC.h>", "Field Oriented Control"))),
        Map.entry("encoder", List.of(new LibraryEntry("Encoder", "paulstoffregen/Encoder@^1.4.4", "#include <Encoder.h>", "Rotary encoder"))),
        // RTC / Timing
        Map.entry("ds3231", List.of(new LibraryEntry("RTClib", "adafruit/RTClib@^2.1.3", "#include <RTClib.h>", "DS3231 RTC"))),
        Map.entry("ntp", List.of(new LibraryEntry("NTPClient", "arduino-libraries/NTPClient@^3.2.1", "#include <NTPClient.h>", "NTP time sync"))),
        // Misc
        Map.entry("rfid_rc522", List.of(new LibraryEntry("MFRC522", "miguelbalboa/MFRC522@^1.4.10", "#include <MFRC522.h>", "RFID RC522"))),
        Map.entry("keypad", List.of(new LibraryEntry("Keypad", "chris--a/Keypad@^3.1.1", "#include <Keypad.h>", "Matrix keypad"))),
        Map.entry("ir_remote", List.of(new LibraryEntry("IRremote", "Arduino-IRremote/IRremote@^4.3.0", "#include <IRremote.h>", "IR remote"))),
        Map.entry("gps_neo6m", List.of(new LibraryEntry("TinyGPSPlus", "mikalhart/TinyGPSPlus@^1.0.3", "#include <TinyGPSPlus.h>", "GPS NEO-6M")))
    );

    public List<LibraryEntry> getLibrariesFor(String componentType) {
        return catalog.getOrDefault(componentType.toLowerCase(), List.of());
    }

    public Optional<LibraryEntry> getPrimaryLibrary(String componentType) {
        List<LibraryEntry> entries = getLibrariesFor(componentType);
        return entries.isEmpty() ? Optional.empty() : Optional.of(entries.get(0));
    }

    public Set<String> getAllComponentTypes() {
        return catalog.keySet();
    }
}
