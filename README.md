# Nexus LLM Inference Hardware Calculator

Created by **Naman Pahariya**.

A dedicated hardware sizing tool for local Large Language Model (LLM) inference. It calculates VRAM demands, system memory requirements, disk footprint, and GPU topology for model configurations ranging from 1B to 1000B parameters.

---

## Overview

Running neural networks locally requires balancing model weights, context windows, KV cache state, and runtime activation buffers against system memory and GPU hardware. 

This calculator models memory requirements for single-user inference (batch size 1) across Discrete GPU and Unified Memory architectures, helping engineers right-size their compute targets before downloading or deploying large model checkpoints.

---

## Features

- **Precision Scaling:** Calculate memory usage across standard precisions and quantization schemes:
  - Full precision (FP32) and half precision (FP16)
  - Integer quantization (Q8, Q6, Q5, Q4, Q3, Q2)
  - Pre-quantized formats (GPTQ, AWQ)
- **Context Window and KV Cache Estimation:** Model incremental streaming decoding or bulk forward-pass generation, with independent KV cache quantization options.
- **Hardware Architecture Mapping:**
  - **Discrete GPUs:** Automatic calculation of required GPU counts (8GB to 80GB VRAM profiles) including real-world memory fragmentation buffers.
  - **Unified Memory:** Validation against Unified Memory pools (Apple Silicon, AMD Ryzen AI Max) adhering to OS headroom constraints.
- **Disk Storage Projections:** Exact byte-level on-disk storage estimates for model weights and safetensors.

---

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Bundler:** Vite

---

## Getting Started

### Prerequisites

- Node.js (version 20 or higher recommended)
- npm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/NamanPahariya2009/NEXUS-LLM-Calculator.git
cd NEXUS-LLM-Calculator
npm install
```

### Development Server

Start the local development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173/` or across your local network via your host IP address.

### Production Build

Compile TypeScript and bundle optimized static assets:

```bash
npm run build
npm run preview
```

---

## Calculation Model

Memory calculation uses the following principles:

1. **Base Model Weights:** Parameter count multiplied by precision byte factor (e.g., FP16 = 2 bytes/param; Q4 = 0.5 bytes/param). Base weights remain constant regardless of context length.
2. **Context and KV Cache:**
   - Incremental mode: Memory scales linearly with context length when KV caching is active, adjusted by the chosen KV cache quantization factor.
   - Bulk mode: Context processing stores full intermediate activations across tokens.
3. **Runtime Allocation Overhead:** An overhead multiplier (~10%) is applied to cover CUDA context initialization, memory fragmentation, and transient scratch buffers.
4. **Hardware Fitting:** Discrete GPU recommendations include a 20% buffer to reflect real-world execution overhead and avoid out-of-memory (OOM) faults.

---

## Project Structure

```text
├── index.html              # Entry HTML document
├── package.json            # Scripts and dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript project references
├── tsconfig.app.json       # Application TypeScript configuration
├── public/
│   └── llm_calc_icon.png   # Application icon
└── src/
    ├── main.tsx            # React bootstrap
    ├── App.tsx             # Main calculator interface and state
    ├── App.css             # Interface styles and theme variables
    ├── calculations.ts     # Core mathematical and memory formulas
    ├── types.ts            # Quantization and system type definitions
    └── components/
        ├── Tooltip.tsx     # Information tooltip component
        └── Tooltip.css     # Tooltip styles
```

---

## Developer

**Naman Pahariya**  
- GitHub: [@NamanPahariya2009](https://github.com/NamanPahariya2009)

---

## License

This program is free software: you can redistribute it and/or modify it under the terms of the **GNU General Public License v3.0 (GPLv3)** as published by the Free Software Foundation.

See the [LICENSE](LICENSE) file for the full license text.
