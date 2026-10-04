import { describe, it, expect, beforeAll } from 'vitest';
import { fileURLToPath } from 'node:url';
import { compileInk } from '../../tools/ink/compileInk';
import { StoryEngine, type StoryChoice, type StoryStep } from '../../src/engine/StoryEngine';

const STORY_DIR = fileURLToPath(new URL('../../story/pt-BR', import.meta.url));
const PARTIDAS = 300;
const MAX_PASSOS = 200;

/** Gerador pseudoaleatório determinístico (mulberry32) — a semente aparece na falha. */
function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Estrategia = (choices: StoryChoice[]) => number;

function jogar(json: string, escolher: Estrategia) {
  const engine = new StoryEngine(json);
  const passos: StoryStep[] = [];
  const checkpoints = new Map<string, NonNullable<StoryEngine['checkpoint']>>();
  let step = engine.start();
  passos.push(step);
  for (let i = 0; !step.ended; i++) {
    if (i > MAX_PASSOS) throw new Error('Partida não terminou: possível laço infinito');
    if (engine.checkpoint) checkpoints.set(engine.checkpoint.chapter, engine.checkpoint);
    step = engine.choose(escolher(step.choices));
    passos.push(step);
  }
  if (engine.checkpoint) checkpoints.set(engine.checkpoint.chapter, engine.checkpoint);
  return { engine, passos, checkpoints, linhas: passos.flatMap((p) => p.lines) };
}

const preferir = (...kinds: StoryChoice['kind'][]): Estrategia => (choices) => {
  for (const kind of kinds) {
    const found = choices.find((c) => c.kind === kind);
    if (found) return found.index;
  }
  return choices[0]!.index;
};

describe('roteiro pt-BR', () => {
  let json = '';

  beforeAll(() => {
    const result = compileInk(STORY_DIR);
    expect(result.errors).toEqual([]);
    json = result.json;
  });

  it(`${PARTIDAS} partidas aleatórias terminam na tela final, sem erros de tag`, () => {
    const tiposVistos = new Set<string>();
    for (let seed = 1; seed <= PARTIDAS; seed++) {
      const r = rng(seed);
      try {
        const { engine, linhas } = jogar(json, (choices) => choices[Math.floor(r() * choices.length)]!.index);
        expect(linhas.at(-1)?.app).toBe('fim');
        expect(linhas.every((l) => l.text.length > 0)).toBe(true);

        const momentos = engine.getMoments();
        const ids = momentos.map((m) => m.id);
        expect(new Set(ids).size).toBe(ids.length);
        expect(ids).toContain('cap1_bia');
        momentos.forEach((m) => tiposVistos.add(m.type));

        const conforto = engine.getNumber('conforto');
        expect(conforto).toBeGreaterThanOrEqual(0);
        expect(conforto).toBeLessThanOrEqual(100);
      } catch (error) {
        throw new Error(`Falhou com semente ${seed}: ${String(error)}`);
      }
    }
    expect([...tiposVistos].sort()).toEqual(['delegou_comodidade', 'pensou']);
  });

  it('todo checkpoint de capítulo pode ser retomado', () => {
    const r = rng(42);
    const { checkpoints } = jogar(json, (choices) => choices[Math.floor(r() * choices.length)]!.index);
    expect([...checkpoints.keys()]).toEqual(['cap0', 'cap1']);
    for (const [chapter, cp] of checkpoints) {
      const step = new StoryEngine(json).resume(cp);
      expect(step.lines[0]?.meta.chapter).toBe(chapter);
    }
  });

  it('caminho "aceitar tudo": delega por comodidade e sobe o conforto', () => {
    const { engine, linhas } = jogar(json, preferir('sugestao'));
    expect(engine.getMoments()).toEqual([{ id: 'cap1_bia', type: 'delegou_comodidade' }]);
    expect(engine.getNumber('conforto')).toBe(80);
    expect(linhas.some((l) => l.meta.from === 'eu' && l.text.includes('A prefeitura sabe o que faz'))).toBe(true);
  });

  it('caminho "pensar": lê, coleta fichas, compõe a resposta com elas', () => {
    const { engine, linhas } = jogar(json, preferir('pensar', 'ficha', 'compor'));
    expect(engine.getMoments()).toEqual([{ id: 'cap1_bia', type: 'pensou' }]);
    expect(engine.getNumber('conforto')).toBe(60);
    const resposta = linhas.find((l) => l.meta.from === 'eu');
    expect(resposta?.text.startsWith('Li a matéria.')).toBe(true);
    expect(resposta?.text).toContain('R$ 18 mil');
  });

  it('pedir resumo no meio da leitura e voltar não registra momento duplicado', () => {
    let pediuResumo = false;
    const { engine } = jogar(json, (choices) => {
      const resumo = choices.find((c) => c.text.startsWith('Pedir ao Amparo'));
      if (resumo && !pediuResumo) { pediuResumo = true; return resumo.index; }
      const voltar = choices.find((c) => c.text.startsWith('Voltar à matéria'));
      if (voltar) return voltar.index;
      return preferir('pensar', 'ficha', 'compor')(choices);
    });
    expect(pediuResumo).toBe(true);
    expect(engine.getMoments()).toEqual([{ id: 'cap1_bia', type: 'pensou' }]);
  });
});
