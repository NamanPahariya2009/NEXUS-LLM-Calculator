# NEXUS INDUSTRIES | LLM INFERENCE HARDWARE CALCULATOR

**Developed by: Naman Pahariya**

Welcome to the internal computational architecture sizing tool for Nexus Industries. This advanced interface calculates exact VRAM, System RAM, and Physical Disk limits required to run complex neural networks and Large Language Models (LLMs) locally.

Built with a high-fidelity Heads-Up Display (HUD) mimicking Stark-level design, this application strips away guesswork when initializing multi-billion parameter configurations.

---

### ⚡ Core Capabilities

- **Real-Time VRAM Telemetry:** Calculate instant projections based on:
  - Neural Network Matrix Size (Parameter Count)
  - Memory Quantization Profiles (FP32 down to INT2 precision scales, including GPTQ & AWQ)
  - Active Context Length Memory Allocation
  - KV Cache state caching
- **Dynamic System Mapping:** Toggle between Discrete GPU computations (configurable cluster sizing) or Unified Memory architecture (Silicon SoC).
- **Physical Footprint Analysis:** Live forecasting of on-disk storage requirements for frozen checkpoints.

---

### 🛠️ Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite

---

### 🔧 Installation / Initialization Protocol

Execute the following commands to initialize dependencies and launch the HUD server locally:

```bash
# 1. Install dependencies
npm install

# 2. Boot HUD Server in development mode
npm run dev
```

### 📦 Available Scripts

- `npm run dev` — Starts the local Vite development server with hot module reloading.
- `npm run build` — Compiles TypeScript and packages optimized static production assets.
- `npm run preview` — Locally previews the production build.

---

### 🖥️ Accessing the UI

Once the HUD server is initiated, you can access the interface through your local terminal network at:
👉 **[http://localhost:5173/](http://localhost:5173/)** on the local device, or **`http://<your-ip>:5173/`** from any device on the local network.

---

### 🎮 Interface Control Protocol

1. **Input Configuration:** Use the left-side telemetry panel to set your model's billion-parameter count.
2. **Precision Calibration:** Adjust the "Model Quantization" dropdown to simulate different compression levels (e.g., Q4 for standard consumer hardware, F16 for high-fidelity clusters).
3. **KV Cache & Context:** Calibrate context length and toggle KV caching to monitor attention vector memory allocation.
4. **Hardware Architecture:** Toggle between "Discrete GPU" (RTX/NVIDIA style) or "Unified Memory" (Stark/Apple style) to observe scaling and memory limits.
5. **Real-Time Telemetry:** Monitor the right-side "Hardware Requirements" panel for instant VRAM, GPU count, and system memory projections.

---

### 🧠 Technical Operations

- **KV Cache Allocation:** Enabling KV Cache re-uses attention vectors, significantly accelerating real-time decoding, monitored directly in your VRAM overhead.
- **Unified Limitations:** Unified memory forecasts strictly abide by the 75% rule to ensure host OS stability during extreme calculation spikes.
- **Hardware Agnostic Calculations:** Base hardware parameters are generalized approximations extrapolated for optimal matrix execution. Actual compute times and exact byte loads will vary depending on your specific ML engine (vLLM, Ollama, TensorRT-LLM).

---

### 📁 Project Architecture

```text
├── index.html              # Application entry point
├── package.json            # Lightweight dependencies & scripts
├── vite.config.ts          # Vite bundler configuration
├── tsconfig.json           # TypeScript configuration
├── public/
│   └── llm_calc_icon.png   # HUD favicon & system icon
└── src/
    ├── App.tsx             # Main HUD telemetry view
    ├── App.css             # HUD styling & Stark-inspired aesthetics
    ├── calculations.ts     # Core mathematical inference logic
    ├── types.ts            # Type definitions for quantization & memory
    ├── main.tsx            # React application bootstrap
    └── components/
        ├── Tooltip.tsx     # Telemetry tooltip component
        └── Tooltip.css     # Tooltip presentation styles
```

---

### 🛡️ Nexus Industries System Integrity

This project is maintained privately by Naman Pahariya for Nexus Industries internal operations and computation estimation.

_Licensed under MIT (c) 2026 Naman Pahariya (Nexus Industries)._
