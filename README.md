# TheShipboard

> Universal firmware, docs, BOM, and deploy config generator for **any** DIY hardware project.

## What is TheShipboard?

TheShipboard is an AI-powered full-stack SaaS that generates production-ready firmware, documentation, bill of materials, and deployment configurations for DIY hardware projects across **12 device categories**:

- **Microcontroller** — Arduino, ESP32, STM32 (C/C++)
- **MicroPython** — RP2040, ESP32 (Python)
- **Linux SBC** — Raspberry Pi, Jetson, BeagleBone
- **Robotics** — ROS2, servo/stepper, kinematics
- **Drone / UAV** — PX4, ArduPilot, Betaflight
- **Automotive** — CAN bus, OBD-II, ADAS
- **Motor Control** — BLDC, stepper, FOC
- **CNC / 3D Printer** — GRBL, Marlin, Klipper
- **FPGA / HDL** — Verilog, VHDL, Yosys
- **Wearable / IoT** — BLE, sensors, low-power
- **Audio / DSP** — I2S, effects, synth
- **Industrial** — Modbus, PLC, RS-485

Supporting **60+ development boards** out of the box.

## Architecture

```
Forge/
├── backend/          # Spring Boot 3.4.3 (Java 21)
│   ├── src/main/java/dev/forge/
│   │   ├── auth/         # JWT authentication
│   │   ├── catalog/      # Board catalog (60+ boards)
│   │   ├── config/       # Security, CORS, Async, Redis, MinIO
│   │   ├── generation/   # 12 AI pipelines + orchestrator
│   │   ├── project/      # Project CRUD
│   │   └── shared/       # Claude API client, error handling
│   └── Dockerfile
├── frontend/         # Next.js 14 (TypeScript + Tailwind)
│   ├── src/
│   │   ├── app/          # Pages (landing, auth, dashboard, wizard, project detail)
│   │   ├── components/   # UI, layout, wizard, project components
│   │   ├── lib/          # API client, auth, types
│   │   └── stores/       # Zustand stores
│   └── Dockerfile
├── docker-compose.yml  # Postgres 15 + Redis 7 + MinIO
└── .env.example
```

## Quick Start

### Prerequisites
- Java 21
- Node.js 20+
- Docker & Docker Compose

### Development

1. **Start infrastructure:**
   ```bash
   docker compose up -d
   ```

2. **Start backend:**
   ```bash
   cd backend
   cp ../.env.example ../.env  # edit with your Claude API key
   ./mvnw spring-boot:run
   ```

3. **Start frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Open** http://localhost:3000

### Environment Variables

Copy `.env.example` and set:
- `CLAUDE_API_KEY` — Your Anthropic API key (required for generation)
- `JWT_SECRET` — Change in production
- Database, Redis, MinIO credentials as needed

## How It Works

1. **Choose a category** from 12 hardware domains
2. **Select a board** from 60+ supported development boards
3. **Configure connections** — map pins, sensors, and actuators
4. **Describe behavior** — tell the AI what your project should do
5. **Generate** — get firmware, docs, BOM, and deploy configs via SSE streaming

## Tech Stack

- **Backend:** Spring Boot 3.4.3, JPA/Hibernate, Flyway, Spring Security + JWT, WebFlux (WebClient), SSE
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Zustand, Monaco Editor, Radix UI
- **AI:** Direct WebClient to Claude API (no Spring AI)
- **Storage:** PostgreSQL 15, Redis 7, MinIO (S3-compatible)
- **Deploy:** Docker, Railway

## Deployment (Railway)

Both services have `railway.toml` and `Dockerfile` ready. Add a PostgreSQL plugin on Railway for the database.

```bash
# Backend
cd backend && railway up

# Frontend
cd frontend && railway up
```

## License

MIT
