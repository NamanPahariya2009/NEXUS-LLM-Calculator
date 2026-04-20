# NEXUS INDUSTRIES | LLM INFERENCE HARDWARE CALCULATOR

**Developed by: Naman Pahariya**

Welcome to the internal computational architecture sizing tool for Nexus Industries. This advanced interface calculates exact VRAM, System RAM, and Physical Disk limits required to run complex neural networks and Large Language Models (LLMs) locally.

Built with a high-fidelity Heads-Up Display (HUD) mimicking Stark-level design, this application strips away guesswork when initializing multi-billion parameter configurations.

### ⚡ Core Capabilities

- **Real-Time VRAM Telemetry:** Calculate instant projections based on:
  - Neural Network Matrix Size (Parameter Count)
  - Memory Quantization Profiles (FP32 to INT4 precision scales)
  - Active Context Length Memory Allocation
  - KV Cache state caching
- **Dynamic System Mapping:** Toggle between Discrete GPU computations (24GB Clusters) or Unified Memory architecture (Silicon SoC).
- **Physical Footprint Analysis:** Live forecasting of on-disk storage requirements for frozen checkpoints.

---

### 🔧 Installation / Initialization Protocol

Execute the following network commands to bring the HUD online locally. 

```bash
# 1. Establish dependencies
npm install

# 2. Boot HUD Server
npm run dev
```

### 🖥️ Accessing the UI
Once the HUD server is initiated, you can access the interface through your local terminal network at:
👉 **[http://localhost:5173/](http://localhost:5173/)**

### 🎮 Interface Control Protocol
1.  **Input Configuration**: Use the left-side telemetry panel to set your model's billion-parameter count.
2.  **Precision Calibration**: Adjust the "Model Quantization" dropdown to simulate different compression levels (e.g., Q4 for standard consumer hardware, F16 for high-fidelity clusters).
3.  **Real-Time Feedback**: Monitor the right-side "Hardware Requirements" panel for instant VRAM and system memory projections.
4.  **Hardware Toggle**: Select between "Discrete GPU" (RTX/NVIDIA style) or "Unified Memory" (Stark/Apple style) to see how the architecture impact requirement scales.

### 🧠 Technical Operations

- **KV Cache Allocation:** Enabling KV Cache re-uses attention vectors, significantly accelerating real-time decoding, monitored directly in your VRAM overhead.
- **Unified Limitations:** Unified memory forecasts strictly abide by the 75% rule to ensure host OS stability during extreme calculation spikes.
- **Hardware Agnostic Calculations:** Base hardware parameters are generalized approximations extrapolated for optimal matrix execution. Actual compute times and exact byte loads will vary depending on your specific ML engine (vLLM, Ollama, TensorRT-LLM).

---

### 🛡️ Nexus Industries System Integrity

This project is maintained privately by Naman Pahariya for Nexus Industries internal operations and computation estimation.

*Licensed under MIT (c) 2026 Naman Pahariya (Nexus Industries).*
