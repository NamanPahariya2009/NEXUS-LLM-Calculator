import { describe, it, expect } from 'vitest';
import { 
  getModelQuantFactor, 
  calculateRequiredVram, 
  calculateOnDiskSize 
} from './calculations';

describe('Nexus Industries LLM Calculator Engine', () => {
  
  describe('getModelQuantFactor', () => {
    it('returns 2.0 for FP16', () => {
      expect(getModelQuantFactor('F16')).toBe(2.0);
    });

    it('returns 0.5 for Q4', () => {
      expect(getModelQuantFactor('Q4')).toBe(0.5);
    });

    it('returns 4.0 for F32', () => {
      expect(getModelQuantFactor('F32')).toBe(4.0);
    });
  });

  describe('calculateOnDiskSize', () => {
    it('calculates correctly for 8B params in F16', () => {
      // 8B * 2.0 = 16GB
      expect(calculateOnDiskSize(8, 'F16')).toBe(16);
    });

    it('calculates correctly for 70B params in Q4', () => {
      // 70B * 0.5 = 35GB
      expect(calculateOnDiskSize(70, 'Q4')).toBe(35);
    });
  });

  describe('calculateRequiredVram', () => {
    it('calculates base memory correctly for incremental mode (no KV cache)', () => {
      // 8B params, Q4 (0.5 factor), context doesn't add memory if kV is off in incremental
      // 8 * 0.5 = 4GB base
      // Total = 4 * 1.1 (overhead) = 4.4GB
      const vram = calculateRequiredVram(8, 'Q4', 2048, false, 'Q4', 'incremental');
      expect(vram).toBeCloseTo(4.4, 1);
    });

    it('adds KV cache memory correctly in incremental mode', () => {
      // 8B params, Q4 (0.5)
      // Base: 4GB
      // KV: alphaAt2048(0.2) * kvFactor(0.5 for Q4) * scale(1.0 for 2048) * base(4) = 0.4GB
      // Total: (4 + 0.4) * 1.1 = 4.84GB
      const vram = calculateRequiredVram(8, 'Q4', 2048, true, 'Q4', 'incremental');
      expect(vram).toBeCloseTo(4.84, 2);
    });

    it('calculates higher memory for bulk mode', () => {
        // 8B, Q4
        // Base: 4GB
        // Bulk context: alphaAt2048(0.5) * scale(1.0) * base(4) = 2GB
        // Total: (4 + 2) * 1.1 = 6.6GB
        const vram = calculateRequiredVram(8, 'Q4', 2048, false, 'Q4', 'bulk');
        expect(vram).toBeCloseTo(6.6, 1);
    });
  });

});
