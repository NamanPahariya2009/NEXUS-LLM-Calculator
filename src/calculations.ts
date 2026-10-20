import {
  MemoryMode,
  ModelQuantization,
  KvCacheQuantization,
  Recommendation,
} from './types';

type InferenceMode = 'incremental' | 'bulk';

export const getModelQuantFactor = (q: ModelQuantization): number => {
  switch (q) {
    case 'F32':
      return 4.0;
    case 'F16':
      return 2.0;
    case 'Q8':
      return 1.0;
    case 'Q6':
      return 0.75;
    case 'Q5':
      return 0.625;
    case 'Q4':
      return 0.5;
    case 'Q3':
      return 0.375;
    case 'Q2':
      return 0.25;
    case 'GPTQ':
      return 0.4;
    case 'AWQ':
      return 0.35;
    default:
      return 1.0;
  }
};

export const getKvCacheQuantFactor = (k: KvCacheQuantization): number => {
  switch (k) {
    case 'F32':
      return 4.0;
    case 'F16':
      return 2.0;
    case 'Q8':
      return 1.0;
    case 'Q5':
      return 0.625;
    case 'Q4':
      return 0.5;
    default:
      return 1.0;
  }
};

export const calculateRequiredVram = (
  params: number,
  modelQuant: ModelQuantization,
  contextLength: number,
  useKvCache: boolean,
  kvCacheQuant: KvCacheQuantization,
  inferenceMode: InferenceMode
): number => {
  const modelFactor = getModelQuantFactor(modelQuant);
  const baseModelMem = params * modelFactor;

  let contextMem = 0;

  if (inferenceMode === 'incremental') {
    if (useKvCache) {
      const alphaAt2048 = 0.2;
      const kvFactor = getKvCacheQuantFactor(kvCacheQuant);
      const kvScale = contextLength / 2048;
      contextMem = baseModelMem * alphaAt2048 * kvScale * kvFactor;
    }
  } else {
    const bulkAlphaAt2048 = 0.5;
    const bulkScale = contextLength / 2048;
    contextMem = baseModelMem * bulkAlphaAt2048 * bulkScale;

    if (useKvCache) {
      const kvFactor = getKvCacheQuantFactor(kvCacheQuant);
      contextMem += baseModelMem * 0.1 * kvFactor * bulkScale;
    }
  }

  const overheadFactor = 1.1;
  return (baseModelMem + contextMem) * overheadFactor;
};

export const calculateHardwareRecommendation = (
  params: number,
  modelQuant: ModelQuantization,
  contextLength: number,
  useKvCache: boolean,
  kvCacheQuant: KvCacheQuantization,
  memoryMode: MemoryMode,
  systemMemory: number,
  gpuVram: number,
  inferenceMode: InferenceMode
): Recommendation => {
  const requiredVram = calculateRequiredVram(
    params,
    modelQuant,
    contextLength,
    useKvCache,
    kvCacheQuant,
    inferenceMode
  );

  const baseSystemRamNeeded =
    params * getModelQuantFactor(modelQuant) * 0.5 +
    (inferenceMode === 'bulk' ? contextLength / 1024 : 0);
  const systemRamNeeded = Math.max(8, baseSystemRamNeeded);

  const fitsUnified =
    memoryMode === 'UNIFIED_MEMORY' && systemMemory >= requiredVram;

  let gpusRequired = 0;
  let gpuType = '';

  if (memoryMode === 'DISCRETE_GPU') {
    gpusRequired = Math.ceil((requiredVram * 1.2) / gpuVram);
    if (gpusRequired === 1) {
      gpuType = `Single ${gpuVram}GB GPU`;
    } else if (gpusRequired <= 8) {
      gpuType = `${gpusRequired}x ${gpuVram}GB GPUs`;
    } else {
      gpuType = `Exceeds 8x ${gpuVram}GB GPUs`;
      gpusRequired = 0;
    }
  } else {
    gpuType = `Unified memory (${systemMemory}GB)`;
    gpusRequired = 0;
  }

  return {
    gpuType,
    vramNeeded: requiredVram.toFixed(2),
    fitsUnified,
    systemRamNeeded,
    gpusRequired,
  };
};

export const calculateOnDiskSize = (
  params: number,
  modelQuant: ModelQuantization
): number => {
  const modelFactor = getModelQuantFactor(modelQuant);
  const bitsPerParam = modelFactor * 8;
  const totalBits = params * 1e9 * bitsPerParam;
  return totalBits / 8 / 1e9;
};
