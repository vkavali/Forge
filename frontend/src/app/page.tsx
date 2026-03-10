'use client';

import Link from 'next/link';
import {
  Cpu, Code, Server, Bot, Navigation, Car, Zap, Printer, CircuitBoard, Watch,
  Music, Factory, ArrowRight, Sparkles, FileCode, FileText, ShoppingCart, Rocket,
  Terminal, GitBranch, Shield, Clock, Layers, Download,
  Wrench, GraduationCap, Briefcase, Lightbulb, ChevronRight, Activity, Wifi,
  Settings, Box, Cog,
} from 'lucide-react';
import { Button } from '../components/ui/button';

const categories = [
  {
    name: 'Microcontroller',
    desc: 'Arduino, ESP32, STM32, ATmega',
    icon: Cpu,
    color: 'blue',
    examples: ['Smart home sensor hub', 'Weather station', 'LED matrix controller'],
    boards: '15+ boards',
  },
  {
    name: 'MicroPython',
    desc: 'RP2040, ESP32 with Python',
    icon: Code,
    color: 'yellow',
    examples: ['Wi-Fi thermostat', 'Data logger', 'MQTT gateway'],
    boards: '8+ boards',
  },
  {
    name: 'Linux SBC',
    desc: 'Raspberry Pi, Jetson Nano, BeagleBone',
    icon: Server,
    color: 'green',
    examples: ['AI camera system', 'Media server', 'Network monitor'],
    boards: '10+ boards',
  },
  {
    name: 'Robotics',
    desc: 'ROS2, Servo, Kinematics',
    icon: Bot,
    color: 'purple',
    examples: ['6-DOF arm controller', 'Line follower', 'Warehouse bot'],
    boards: '6+ boards',
  },
  {
    name: 'Drone / UAV',
    desc: 'PX4, ArduPilot, Betaflight',
    icon: Navigation,
    color: 'cyan',
    examples: ['Agricultural surveyor', 'FPV racing quad', 'Delivery drone'],
    boards: '5+ boards',
  },
  {
    name: 'Automotive',
    desc: 'CAN bus, OBD-II, J1939',
    icon: Car,
    color: 'red',
    examples: ['OBD-II data logger', 'CAN bus analyzer', 'EV battery monitor'],
    boards: '4+ boards',
  },
  {
    name: 'Motor Control',
    desc: 'BLDC, FOC, Stepper, Servo',
    icon: Zap,
    color: 'orange',
    examples: ['CNC spindle driver', 'E-bike controller', 'Gimbal stabilizer'],
    boards: '5+ boards',
  },
  {
    name: 'CNC / 3D Printer',
    desc: 'GRBL, Marlin, Klipper',
    icon: Printer,
    color: 'pink',
    examples: ['Custom 3D printer', 'Laser engraver', 'PCB mill'],
    boards: '4+ boards',
  },
  {
    name: 'FPGA / HDL',
    desc: 'Verilog, VHDL, Yosys, Lattice',
    icon: CircuitBoard,
    color: 'indigo',
    examples: ['Video processor', 'Logic analyzer', 'SDR receiver'],
    boards: '4+ boards',
  },
  {
    name: 'Wearable / IoT',
    desc: 'BLE, Sensors, Low-power',
    icon: Watch,
    color: 'teal',
    examples: ['Fitness tracker', 'Air quality badge', 'Smart ring'],
    boards: '5+ boards',
  },
  {
    name: 'Audio / DSP',
    desc: 'I2S, Effects, Synth, DAC',
    icon: Music,
    color: 'violet',
    examples: ['Guitar pedal', 'Synthesizer module', 'Spatial audio engine'],
    boards: '4+ boards',
  },
  {
    name: 'Industrial',
    desc: 'Modbus, PLC, RS-485, 4-20mA',
    icon: Factory,
    color: 'amber',
    examples: ['Modbus RTU gateway', 'PLC replacement', 'Tank level monitor'],
    boards: '4+ boards',
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  blue:   { bg: 'bg-blue-600/5',   border: 'border-blue-600/20',   text: 'text-blue-400',   iconBg: 'bg-blue-600/10' },
  yellow: { bg: 'bg-yellow-600/5', border: 'border-yellow-600/20', text: 'text-yellow-400', iconBg: 'bg-yellow-600/10' },
  green:  { bg: 'bg-green-600/5',  border: 'border-green-600/20',  text: 'text-green-400',  iconBg: 'bg-green-600/10' },
  purple: { bg: 'bg-purple-600/5', border: 'border-purple-600/20', text: 'text-purple-400', iconBg: 'bg-purple-600/10' },
  cyan:   { bg: 'bg-cyan-600/5',   border: 'border-cyan-600/20',   text: 'text-cyan-400',   iconBg: 'bg-cyan-600/10' },
  red:    { bg: 'bg-red-600/5',    border: 'border-red-600/20',    text: 'text-red-400',    iconBg: 'bg-red-600/10' },
  orange: { bg: 'bg-orange-600/5', border: 'border-orange-600/20', text: 'text-orange-400', iconBg: 'bg-orange-600/10' },
  pink:   { bg: 'bg-pink-600/5',   border: 'border-pink-600/20',   text: 'text-pink-400',   iconBg: 'bg-pink-600/10' },
  indigo: { bg: 'bg-indigo-600/5', border: 'border-indigo-600/20', text: 'text-indigo-400', iconBg: 'bg-indigo-600/10' },
  teal:   { bg: 'bg-teal-600/5',   border: 'border-teal-600/20',   text: 'text-teal-400',   iconBg: 'bg-teal-600/10' },
  violet: { bg: 'bg-violet-600/5', border: 'border-violet-600/20', text: 'text-violet-400', iconBg: 'bg-violet-600/10' },
  amber:  { bg: 'bg-amber-600/5',  border: 'border-amber-600/20',  text: 'text-amber-400',  iconBg: 'bg-amber-600/10' },
};

const steps = [
  {
    num: '1',
    title: 'Choose Category',
    desc: 'Pick from 12 hardware categories — microcontrollers, robotics, drones, industrial, and more.',
    icon: Layers,
  },
  {
    num: '2',
    title: 'Pick Your Board',
    desc: 'Select from 60+ supported development boards with full pinout and spec data.',
    icon: Cpu,
  },
  {
    num: '3',
    title: 'Configure Connections',
    desc: 'Map pins, sensors, actuators, and communication buses with a visual configurator.',
    icon: Settings,
  },
  {
    num: '4',
    title: 'Describe Behavior',
    desc: 'Tell us what your project should do in plain English — our AI understands hardware.',
    icon: Terminal,
  },
  {
    num: '5',
    title: 'Generate Everything',
    desc: 'Get production-ready firmware, docs, BOM, and deploy instructions in seconds.',
    icon: Rocket,
  },
];

const outputs = [
  {
    icon: FileCode,
    title: 'Production Firmware',
    desc: 'Complete, compilable source code tailored to your board and peripherals. Includes initialization, main loop, interrupt handlers, and driver code.',
    color: 'text-blue-400',
    bg: 'bg-blue-600/10',
  },
  {
    icon: FileText,
    title: 'Full Documentation',
    desc: 'Architecture overview, pin mapping tables, wiring diagrams in text, configuration reference, and API docs — all in Markdown.',
    color: 'text-green-400',
    bg: 'bg-green-600/10',
  },
  {
    icon: ShoppingCart,
    title: 'Bill of Materials',
    desc: 'CSV-formatted parts list with component names, quantities, specifications, and supplier links. Ready to import into procurement tools.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-600/10',
  },
  {
    icon: Rocket,
    title: 'Deploy Instructions',
    desc: 'Step-by-step build, flash, and deploy guides specific to your toolchain. Includes IDE setup, CLI commands, and troubleshooting tips.',
    color: 'text-purple-400',
    bg: 'bg-purple-600/10',
  },
];

const personas = [
  {
    icon: Wrench,
    title: 'Hardware Hobbyists',
    desc: 'Skip the boilerplate. Go from idea to working firmware in minutes instead of days. Focus on the creative part of your project.',
    color: 'text-blue-400',
    bg: 'bg-blue-600/10',
  },
  {
    icon: GraduationCap,
    title: 'Students & Educators',
    desc: 'Learn embedded systems with real, working code examples. Great for coursework, labs, and capstone projects across multiple platforms.',
    color: 'text-green-400',
    bg: 'bg-green-600/10',
  },
  {
    icon: Briefcase,
    title: 'Professional Engineers',
    desc: 'Rapid prototyping for client projects. Generate baseline firmware and docs, then customize. Cut proof-of-concept time by 10x.',
    color: 'text-purple-400',
    bg: 'bg-purple-600/10',
  },
  {
    icon: Lightbulb,
    title: 'Startup Founders',
    desc: 'Validate hardware product ideas fast. Get a working prototype with professional docs and BOM before committing to full development.',
    color: 'text-orange-400',
    bg: 'bg-orange-600/10',
  },
];

const stats = [
  { value: '12', label: 'Device Categories', icon: Layers },
  { value: '60+', label: 'Supported Boards', icon: Cpu },
  { value: '4', label: 'Generated Artifacts', icon: Box },
  { value: '< 30s', label: 'Generation Time', icon: Clock },
];

const features = [
  { icon: Activity, title: 'Real-Time Streaming', desc: 'Watch your firmware generate in real-time with live SSE progress updates.' },
  { icon: GitBranch, title: 'Version History', desc: 'Every generation is saved. Compare versions and roll back anytime.' },
  { icon: Download, title: 'One-Click Export', desc: 'Download everything as a ZIP — firmware, docs, BOM, and deploy configs.' },
  { icon: Shield, title: 'Secure by Default', desc: 'JWT authentication, encrypted storage, and isolated project workspaces.' },
  { icon: Wifi, title: 'IoT-Ready Output', desc: 'Wi-Fi, BLE, MQTT, and HTTP client code generated for connected devices.' },
  { icon: Cog, title: 'Customizable Pipelines', desc: 'Each category uses a specialized AI pipeline tuned for that hardware domain.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Nav */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-7 h-7 text-blue-500" />
            <span className="text-xl font-bold text-white">TheShipboard</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#categories" className="hover:text-white transition-colors">Categories</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#outputs" className="hover:text-white transition-colors">What You Get</a>
            <a href="#who" className="hover:text-white transition-colors">Who It&apos;s For</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login"><Button variant="ghost">Sign In</Button></Link>
            <Link href="/auth/register"><Button>Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 py-28 text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400">AI-Powered Hardware Development Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Build Any Hardware Project<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">In Minutes, Not Months</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Describe your hardware project and get production-ready firmware, comprehensive documentation,
            bill of materials, and deploy instructions — all generated by AI that understands embedded systems.
          </p>
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 h-12">
                Start Building Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="text-lg px-8 h-12">See How It Works</Button>
            </a>
          </div>

          {/* Stats bar */}
          <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">12 Device Categories</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            From Arduino sketches to industrial PLC replacements. Each category has a specialized AI pipeline
            tuned with domain-specific knowledge for that hardware ecosystem.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const colors = colorMap[cat.color];
            return (
              <div
                key={cat.name}
                className={`${colors.bg} border ${colors.border} rounded-xl p-6 hover:border-opacity-60 transition-all group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                    <cat.icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <span className="text-xs text-gray-600 font-mono">{cat.boards}</span>
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{cat.desc}</p>
                <div className="space-y-1.5">
                  {cat.examples.map((ex) => (
                    <div key={ex} className="flex items-center gap-2 text-xs text-gray-500">
                      <ChevronRight className="w-3 h-3 text-gray-600 flex-shrink-0" />
                      <span>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-900/30 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Five simple steps from idea to production-ready hardware project. No boilerplate, no guesswork.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-gray-700 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 text-blue-400 text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="text-xs text-blue-400 font-mono mb-2">Step {step.num}</div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section id="outputs" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What You Get</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Every generation produces four complete artifacts — ready to use, share, or deploy.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {outputs.map((out) => (
            <div key={out.title} className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-colors">
              <div className={`w-14 h-14 ${out.bg} rounded-xl flex items-center justify-center mb-5`}>
                <out.icon className={`w-7 h-7 ${out.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{out.title}</h3>
              <p className="text-gray-400 leading-relaxed">{out.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Code Preview Mock */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-950 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="text-xs text-gray-500 ml-2 font-mono">main.cpp — ESP32 Soil Moisture Monitor</span>
          </div>
          <pre className="p-6 text-sm font-mono text-gray-400 overflow-x-auto leading-relaxed">
            <code>{`#include <WiFi.h>
#include <PubSubClient.h>
#include "config.h"

// Pin definitions — auto-configured for ESP32-DevKitC
#define MOISTURE_PIN    34   // ADC1_CH6
#define PUMP_RELAY_PIN  25   // GPIO25
#define LED_STATUS_PIN   2   // Built-in LED

WiFiClient wifiClient;
PubSubClient mqtt(wifiClient);

void setup() {
    Serial.begin(115200);
    pinMode(PUMP_RELAY_PIN, OUTPUT);
    pinMode(LED_STATUS_PIN, OUTPUT);

    WiFi.begin(WIFI_SSID, WIFI_PASS);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        digitalWrite(LED_STATUS_PIN, !digitalRead(LED_STATUS_PIN));
    }

    mqtt.setServer(MQTT_BROKER, MQTT_PORT);
    mqtt.connect(DEVICE_ID);

    Serial.println("[ TheShipboard ] Firmware ready.");
}

void loop() {
    int moisture = analogRead(MOISTURE_PIN);
    float percent = map(moisture, 4095, 0, 0, 100);

    mqtt.publish("garden/moisture", String(percent).c_str());

    if (percent < THRESHOLD_DRY) {
        digitalWrite(PUMP_RELAY_PIN, HIGH);
        mqtt.publish("garden/pump", "ON");
    } else {
        digitalWrite(PUMP_RELAY_PIN, LOW);
    }

    delay(READ_INTERVAL_MS);
}`}</code>
          </pre>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          Example output — generated firmware for an ESP32 soil moisture monitoring system
        </p>
      </section>

      {/* Who It's For */}
      <section id="who" className="bg-gray-900/30 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built For Hardware Makers</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Whether you&apos;re a weekend tinkerer or a professional engineer, TheShipboard accelerates your workflow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {personas.map((p) => (
              <div key={p.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
                <div className={`w-12 h-12 ${p.bg} rounded-lg flex items-center justify-center mb-4`}>
                  <p.icon className={`w-6 h-6 ${p.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Platform Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            More than a code generator — a complete hardware development companion.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4 p-5 rounded-xl border border-gray-800 bg-gray-900/30 hover:border-gray-700 transition-colors">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center">
                <f.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-600/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Something?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8 text-lg">
            Stop writing boilerplate. Start with production-ready firmware generated in seconds.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 h-12">
                Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-600 mt-4">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-white">TheShipboard</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                AI-powered hardware development platform. Generate firmware, docs, BOM, and deploy configs for any DIY project.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Microcontroller</li>
                <li>MicroPython</li>
                <li>Linux SBC</li>
                <li>Robotics</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">More Categories</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Drone / UAV</li>
                <li>Motor Control</li>
                <li>FPGA / HDL</li>
                <li>Industrial</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>60+ Supported Boards</li>
                <li>Real-time Generation</li>
                <li>ZIP Export</li>
                <li>Version History</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">Built with AI for hardware makers</p>
            <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} TheShipboard</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
