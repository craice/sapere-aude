import { describe, it, expect } from 'vitest';
import { createSaveStore, SAVE_KEY, type StorageLike } from '../../src/save/saveStore';
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
    const store = createSaveStore(memoryStorage());
    store.save(CP);
    expect(store.load()).toEqual(CP);
  });

  it('sem save → null', () => {
    expect(createSaveStore(memoryStorage()).load()).toBeNull();
  });

  it.each([
    ['JSON quebrado', '{lixo'],
    ['versão desconhecida', JSON.stringify({ v: 99, checkpoint: CP })],
    ['checkpoint incompleto', JSON.stringify({ v: 1, checkpoint: { chapter: 'cap1' } })],
    ['app inválido', JSON.stringify({ v: 1, checkpoint: { ...CP, app: 'twitter' } })],
    ['null', 'null'],
  ])('save corrompido (%s) → null', (_, raw) => {
    expect(createSaveStore(memoryStorage({ [SAVE_KEY]: raw })).load()).toBeNull();
  });

  it('storage que lança exceções nunca derruba o jogo', () => {
    const store = createSaveStore(throwing);
    expect(() => store.save(CP)).not.toThrow();
    expect(store.load()).toBeNull();
    expect(() => store.clear()).not.toThrow();
  });

  it('storage ausente (null) funciona como "sem save"', () => {
    const store = createSaveStore(null);
    store.save(CP);
    expect(store.load()).toBeNull();
  });

  it('clear apaga o save', () => {
    const storage = memoryStorage();
    const store = createSaveStore(storage);
    store.save(CP);
    store.clear();
    expect(storage.data[SAVE_KEY]).toBeUndefined();
  });
});
