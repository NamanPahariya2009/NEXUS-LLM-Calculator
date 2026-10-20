import { useState } from 'react';
import './App.css';
import { MemoryMode, ModelQuantization, KvCacheQuantization } from './types';
import {
  calculateHardwareRecommendation,
  calculateOnDiskSize,
} from './calculations';
import { Tooltip } from './components/Tooltip';

function App() {
  const [params, setParams] = useState<number>(65);
  const [modelQuant, setModelQuant] = useState<ModelQuantization>('Q4');
  const [useKvCache, setUseKvCache] = useState<boolean>(false);
  const [kvCacheQuant, setKvCacheQuant] = useState<KvCacheQuantization>('Q4');
  const [inferenceMode, setInferenceMode] = useState<'incremental' | 'bulk'>(
    'incremental'
  );
  const [contextLength, setContextLength] = useState<number>(4096);
  const [memoryMode, setMemoryMode] = useState<MemoryMode>('DISCRETE_GPU');
  const [systemMemory, setSystemMemory] = useState<number>(128);
  const [gpuVram, setGpuVram] = useState<number>(24);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const newValue = Number(event.target.value);
    if (!isNaN(newValue)) {
      setter(newValue);
    }
  };

  const recommendation = calculateHardwareRecommendation(
    params,
    modelQuant,
    contextLength,
    useKvCache,
    kvCacheQuant,
    memoryMode,
    systemMemory,
    gpuVram,
    inferenceMode
  );

  const onDiskSize = calculateOnDiskSize(params, modelQuant);

  return (
    <div className="App">
      <h1>NEXUS INDUSTRIES</h1>
      <p className="intro-text">
        LLM INFERENCE HARDWARE CALCULATOR<br />
        <span style={{ color: 'var(--primary-color)', fontSize: '0.85rem', letterSpacing: '2px', fontWeight: 600 }}>
          DESIGNED BY NAMAN PAHARIYA
        </span>
        <br /><br />
        Estimate VRAM and System RAM for single-user inference (Batch = 1).<br />
        Model weights and KV cache quantization are calibrated independently.
      </p>

      <div className="layout">
        <div className="input-panel">
          <h2 className="section-title">Model Configuration</h2>

          <label className="label-range">
            Number of Parameters (Billions):
            <input
              className="text-input-group"
              type="number"
              min={1}
              max={1000}
              value={params}
              onChange={(e) => handleInputChange(e, setParams)}
            />
            <Tooltip text="Total parameter count in billions (e.g., 70 for Llama 3 70B).">
              i
            </Tooltip>
          </label>
          <div className="slider-input-group">
            <input
              type="range"
              min={1}
              max={1000}
              value={params}
              onChange={(e) => setParams(Number(e.target.value))}
            />
          </div>

          <label className="label-range">
            Model Quantization:
            <Tooltip text="Precision format for loaded model weights. Lower bits decrease VRAM requirements.">
              i
            </Tooltip>
          </label>
          <select
            value={modelQuant}
            onChange={(e) => setModelQuant(e.target.value as ModelQuantization)}
          >
            <option value="F32">F32</option>
            <option value="F16">F16</option>
            <option value="Q8">Q8</option>
            <option value="Q6">Q6</option>
            <option value="Q5">Q5</option>
            <option value="Q4">Q4</option>
            <option value="Q3">Q3</option>
            <option value="Q2">Q2</option>
            <option value="GPTQ">GPTQ</option>
            <option value="AWQ">AWQ</option>
          </select>

          <label className="label-range">
            Context Length (Tokens):
            <input
              className="text-input-group"
              type="number"
              min={128}
              max={32768}
              step={128}
              value={contextLength}
              onChange={(e) => handleInputChange(e, setContextLength)}
            />
            <Tooltip text="Maximum active context window. Higher context lengths scale KV memory footprint.">
              i
            </Tooltip>
          </label>
          <div className="slider-input-group">
            <input
              type="range"
              min={128}
              max={32768}
              step={128}
              value={contextLength}
              onChange={(e) => setContextLength(Number(e.target.value))}
            />
          </div>

          <label className="label-range">
            Inference Mode:
            <Tooltip text="Incremental generates tokens sequentially. Bulk computes prompts and activations in a single forward pass.">
              i
            </Tooltip>
          </label>
          <select
            value={inferenceMode}
            onChange={(e) =>
              setInferenceMode(e.target.value as 'incremental' | 'bulk')
            }
          >
            <option value="incremental">Incremental (Streaming)</option>
            <option value="bulk">Bulk (All at once)</option>
          </select>

          <div className="checkbox-row">
            <input
              type="checkbox"
              checked={useKvCache}
              onChange={() => setUseKvCache(!useKvCache)}
              id="kvCache"
            />
            <label htmlFor="kvCache">
              Enable KV Cache
              <Tooltip text="Preserves calculated key/value attention states to accelerate generation.">
                i
              </Tooltip>
            </label>
          </div>

          <div className={`kvCacheAnimate ${useKvCache ? 'open' : 'closed'}`}>
            <label className="label-range">
              KV Cache Quantization:
              <Tooltip text="Quantization scale applied to stored KV attention matrices.">
                i
              </Tooltip>
            </label>
            <select
              value={kvCacheQuant}
              onChange={(e) =>
                setKvCacheQuant(e.target.value as KvCacheQuantization)
              }
            >
              <option value="F32">F32</option>
              <option value="F16">F16</option>
              <option value="Q8">Q8</option>
              <option value="Q5">Q5</option>
              <option value="Q4">Q4</option>
            </select>
          </div>

          <hr style={{ margin: '1rem 0' }} />

          <h2 className="section-title">System Configuration</h2>

          <label className="label-range">System Type:</label>
          <select
            value={memoryMode}
            onChange={(e) => setMemoryMode(e.target.value as MemoryMode)}
          >
            <option value="DISCRETE_GPU">Discrete GPU</option>
            <option value="UNIFIED_MEMORY">
              Unified memory (Apple Silicon, AMD Ryzen AI Max)
            </option>
          </select>

          {memoryMode === 'DISCRETE_GPU' && (
            <>
              <label className="label-range">GPU VRAM (GB):</label>
              <select
                value={gpuVram}
                onChange={(e) => setGpuVram(Number(e.target.value))}
              >
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
                <option value={20}>20</option>
                <option value={24}>24</option>
                <option value={32}>32</option>
                <option value={40}>40</option>
                <option value={48}>48</option>
                <option value={80}>80</option>
              </select>
            </>
          )}

          <label className="label-range">
            System Memory (GB):
            <input
              className="text-input-group"
              type="number"
              min={8}
              max={512}
              step={8}
              value={systemMemory}
              onChange={(e) => handleInputChange(e, setSystemMemory)}
            />
          </label>
          <div className="slider-input-group">
            <input
              type="range"
              min={8}
              max={512}
              step={8}
              value={systemMemory}
              onChange={(e) => setSystemMemory(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="results-panel">
          <h2 className="section-title">Hardware Requirements</h2>

          <p>
            <strong>VRAM Needed:</strong>{' '}
            <span className="result-highlight">
              {recommendation.vramNeeded} GB
            </span>
          </p>
          <p>
            <strong>On-Disk Size:</strong>{' '}
            <span className="result-highlight">{onDiskSize.toFixed(2)} GB</span>
          </p>
          <p>
            <strong>GPU Config:</strong> {recommendation.gpuType}
          </p>

          {recommendation.gpusRequired > 1 && (
            <p>
              <strong>Number of GPUs Required:</strong>{' '}
              {recommendation.gpusRequired}
            </p>
          )}
          {recommendation.gpusRequired === 1 && (
            <p>
              <strong>Number of GPUs Required:</strong> 1 (Fits on a single GPU)
            </p>
          )}

          {memoryMode === 'DISCRETE_GPU' && (
            <p>
              <strong>System RAM:</strong>{' '}
              {recommendation.systemRamNeeded.toFixed(1)} GB
            </p>
          )}

          {memoryMode === 'UNIFIED_MEMORY' && recommendation.fitsUnified && (
            <p style={{ color: '#22c55e', fontWeight: 600 }}>
              Fits in unified memory.
            </p>
          )}
          {memoryMode === 'UNIFIED_MEMORY' && !recommendation.fitsUnified && (
            <p style={{ color: '#ef4444', fontWeight: 600 }}>
              Exceeds unified memory. Increase system RAM or reduce model size.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
