import type { Checkpoint } from '../engine/StoryEngine';
import { APPS } from '../tags/protocol';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface SaveStore {
  load(): Checkpoint | null;
  save(checkpoint: Checkpoint): void;
  clear(): void;
}

export const SAVE_KEY = 'sapere-aude:save:v1';
const FORMAT = 2;

/** Impressão digital do roteiro compilado (FNV-1a, 32 bits): um save só vale para o mesmo roteiro. */
export function storyVersion(storyJson: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < storyJson.length; i++) {
    hash ^= storyJson.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

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

/**
 * Salvamento que nunca lança exceção: sem armazenamento, o jogo só não retoma.
 * Um save feito com outra versão do roteiro é ignorado (o jogo começa do zero).
 */
export function createSaveStore(storage: StorageLike | null, version: string): SaveStore {
  return {
    load() {
      try {
        const raw = storage?.getItem(SAVE_KEY);
        if (!raw) return null;
        const data: unknown = JSON.parse(raw);
        if (typeof data !== 'object' || data === null) return null;
        const { v, story, checkpoint } = data as { v?: unknown; story?: unknown; checkpoint?: unknown };
        return v === FORMAT && story === version && isCheckpoint(checkpoint) ? checkpoint : null;
      } catch {
        return null;
      }
    },
    save(checkpoint) {
      try {
        storage?.setItem(SAVE_KEY, JSON.stringify({ v: FORMAT, story: version, checkpoint }));
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
