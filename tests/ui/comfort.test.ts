import { describe, it, expect } from 'vitest';
import { comfortKey } from '../../src/ui/comfort';

describe('comfortKey', () => {
  it.each([
    [100, 'conforto.tranquilo'],
    [70, 'conforto.tranquilo'],
    [69, 'conforto.ok'],
    [40, 'conforto.ok'],
    [39, 'conforto.agitado'],
    [0, 'conforto.agitado'],
  ])('%i → %s', (value, key) => {
    expect(comfortKey(value)).toBe(key);
  });
});
