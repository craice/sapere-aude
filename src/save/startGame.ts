import type { StoryEngine, StoryStep } from '../engine/StoryEngine';
import type { SaveStore } from './saveStore';

/**
 * Retoma do último checkpoint se possível. Se o save não for compatível com o roteiro
 * atual (ex.: após uma atualização), apaga-o e começa do zero com uma engine nova.
 */
export function startGame(createEngine: () => StoryEngine, store: SaveStore): { engine: StoryEngine; step: StoryStep; resumed: boolean } {
  const checkpoint = store.load();
  if (checkpoint) {
    const engine = createEngine();
    try {
      return { engine, step: engine.resume(checkpoint), resumed: true };
    } catch {
      store.clear();
    }
  }
  const engine = createEngine();
  return { engine, step: engine.start(), resumed: false };
}
