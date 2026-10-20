export type MemoryMode = 'DISCRETE_GPU' | 'UNIFIED_MEMORY';

export type ModelQuantization =
  | 'F32'
  | 'F16'
  | 'Q8'
  | 'Q6'
  | 'Q5'
  | 'Q4'
  | 'Q3'
  | 'Q2'
  | 'GPTQ'
  | 'AWQ';

export type KvCacheQuantization = 'F32' | 'F16' | 'Q8' | 'Q5' | 'Q4';

export interface Recommendation {
  gpuType: string;
  vramNeeded: string;
  fitsUnified: boolean;
  systemRamNeeded: number;
  gpusRequired: number;
}
