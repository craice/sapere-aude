import { describe, it, expect } from 'vitest';
import { StoryEngine } from '../../src/engine/StoryEngine';
import { startGame } from '../../src/save/startGame';
import type { SaveStore } from '../../src/save/saveStore';
import type { Checkpoint } from '../../src/engine/StoryEngine';
import { compileSource } from '../helpers/compileSource';

const JSON_STORY = compileSource(`VAR conforto = 70
VAR momentos = ""
-> cap0
=== cap0 ===
Configuração # chapter: cap0 # app: setup
* [Sim]
- -> cap1
=== cap1 ===
Manhã # chapter: cap1 # app: chat
* [Ok]
- -> END
`);

function fakeStore(initial: Checkpoint | null): SaveStore & { cleared: boolean } {
  return {
    cleared: false,
    load: () => initial,
    save: () => {},
    clear() { this.cleared = true; },
  };
}

describe('startGame', () => {
  it('sem save → começa do início', () => {
    const { step, resumed } = startGame(() => new StoryEngine(JSON_STORY), fakeStore(null));
    expect(resumed).toBe(false);
    expect(step.lines[0]?.text).toBe('Configuração');
  });

  it('com save válido → retoma no capítulo salvo', () => {
    const first = new StoryEngine(JSON_STORY);
    first.start();
    first.choose(0);
    const { step, resumed } = startGame(() => new StoryEngine(JSON_STORY), fakeStore(first.checkpoint));
    expect(resumed).toBe(true);
    expect(step.lines[0]?.text).toBe('Manhã');
  });

  it('save incompatível com o roteiro atual → apaga e começa do zero', () => {
    const store = fakeStore({ chapter: 'capitulo_removido', state: '{"quebrado":true}', app: 'chat', time: '07:00' });
    const { step, resumed } = startGame(() => new StoryEngine(JSON_STORY), store);
    expect(resumed).toBe(false);
    expect(store.cleared).toBe(true);
    expect(step.lines[0]?.text).toBe('Configuração');
  });
});
