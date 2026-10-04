import { describe, it, expect } from 'vitest';
import { createSaveStore, SAVE_KEY, storyVersion, type StorageLike } from '../../src/save/saveStore';
import type { Checkpoint } from '../../src/engine/StoryEngine';

const CP: Checkpoint = { chapter: 'cap1', state: '{"x":1}', app: 'chat', time: '07:42' };

function memoryStorage(initial: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k]! : null),
    setItem: (k, v) => void (data[k] = v),
    removeItem: (k) => void delete data[k],
  };
}

const throwing: StorageLike = {
  getItem: () => { throw new Error('SecurityError'); },
  setItem: () => { throw new Error('QuotaExceededError'); },
  removeItem: () => { throw new Error('SecurityError'); },
};

describe('saveStore', () => {
  it('salva e carrega um checkpoint', () => {
    const store = createSaveStore(memoryStorage(), 'v-a');
    store.save(CP);
    expect(store.load()).toEqual(CP);
  });

  it('sem save → null', () => {
    expect(createSaveStore(memoryStorage(), 'v-a').load()).toBeNull();
  });

  it.each([
    ['JSON quebrado', '{lixo'],
    ['versão desconhecida', JSON.stringify({ v: 99, story: 'v-a', checkpoint: CP })],
    ['formato antigo, sem versão do roteiro', JSON.stringify({ v: 1, checkpoint: CP })],
    ['checkpoint incompleto', JSON.stringify({ v: 2, story: 'v-a', checkpoint: { chapter: 'cap1' } })],
    ['app inválido', JSON.stringify({ v: 2, story: 'v-a', checkpoint: { ...CP, app: 'twitter' } })],
    ['null', 'null'],
  ])('save corrompido (%s) → null', (_, raw) => {
    expect(createSaveStore(memoryStorage({ [SAVE_KEY]: raw }), 'v-a').load()).toBeNull();
  });

  it('storage que lança exceções nunca derruba o jogo', () => {
    const store = createSaveStore(throwing, 'v-a');
    expect(() => store.save(CP)).not.toThrow();
    expect(store.load()).toBeNull();
    expect(() => store.clear()).not.toThrow();
  });

  it('storage ausente (null) funciona como "sem save"', () => {
    const store = createSaveStore(null, 'v-a');
    store.save(CP);
    expect(store.load()).toBeNull();
  });

  it('save de outra versão do roteiro → null (começa do zero)', () => {
    const storage = memoryStorage();
    createSaveStore(storage, 'v-a').save(CP);
    expect(createSaveStore(storage, 'v-b').load()).toBeNull();
    expect(createSaveStore(storage, 'v-a').load()).toEqual(CP);
  });

  it('storyVersion: mesmo roteiro → mesma versão; roteiro diferente → versão diferente', () => {
    expect(storyVersion('{"a":1}')).toBe(storyVersion('{"a":1}'));
    expect(storyVersion('{"a":1}')).not.toBe(storyVersion('{"a":2}'));
    expect(storyVersion('{"a":1}')).toMatch(/^[0-9a-f]{8}$/);
  });

  it('clear apaga o save', () => {
    const storage = memoryStorage();
    const store = createSaveStore(storage, 'v-a');
    store.save(CP);
    store.clear();
    expect(storage.data[SAVE_KEY]).toBeUndefined();
  });
});
