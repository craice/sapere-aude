import type { Checkpoint } from '../engine/StoryEngine';
import { APPS } from '../tags/protocol';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface SaveStore {
  load(): Checkpoint | null;
  save(checkpoint: Checkpoint): void;
  clear(): void;
}

export const SAVE_KEY = 'sapere-aude:save:v1';

function isCheckpoint(value: unknown): value is Checkpoint {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.chapter === 'string' &&
    typeof v.state === 'string' &&
    typeof v.time === 'string' &&
    typeof v.app === 'string' &&
    (APPS as readonly string[]).includes(v.app)
  );
}

/** Salvamento que nunca lança exceção: sem armazenamento, o jogo só não retoma. */
export function createSaveStore(storage: StorageLike | null): SaveStore {
  return {
    load() {
      try {
        const raw = storage?.getItem(SAVE_KEY);
        if (!raw) return null;
        const data: unknown = JSON.parse(raw);
        if (typeof data !== 'object' || data === null) return null;
        const { v, checkpoint } = data as { v?: unknown; checkpoint?: unknown };
        return v === 1 && isCheckpoint(checkpoint) ? checkpoint : null;
      } catch {
        return null;
      }
    },
    save(checkpoint) {
      try {
        storage?.setItem(SAVE_KEY, JSON.stringify({ v: 1, checkpoint }));
      } catch {
        // Sem espaço ou bloqueado: segue sem salvar.
      }
    },
    clear() {
      try {
        storage?.removeItem(SAVE_KEY);
      } catch {
        // Idem.
      }
    },
  };
}

export function browserStorage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
