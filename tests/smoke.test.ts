import { describe, it, expect } from 'vitest';
import pkg from '../package.json';

describe('projeto', () => {
  it('declara inkjs como única dependência de runtime', () => {
    expect(Object.keys(pkg.dependencies)).toEqual(['inkjs']);
  });
});
