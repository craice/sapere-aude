import { describe, it, expect, beforeAll } from 'vitest';
import { fileURLToPath } from 'node:url';
import { compileInk } from '../../tools/ink/compileInk';
import { MOMENT_TYPES, StoryEngine, type StoryChoice, type StoryStep } from '../../src/engine/StoryEngine';
import trechos from '../../content/pt-BR/kant/trechos.json';

const STORY_DIR = fileURLToPath(new URL('../../story/pt-BR', import.meta.url));
const PARTIDAS = 300;
const MAX_PASSOS = 200;
const MOMENTOS = ['cap1_bia', 'cap2_premium', 'cap2_remedio', 'cap2_caminho', 'cap3_ordem', 'cap4_debate', 'cap4_liberta'];
const CAPITULOS = ['cap0', 'cap1', 'cap2', 'cap3', 'cap4', 'cap5'];

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
  const linhas = passos.flatMap((p) => p.lines);
  const eventos = linhas.flatMap((l) => (l.meta.evento ? [l.meta.evento] : []));
  return { engine, passos, checkpoints, linhas, eventos };
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
        const { engine, linhas, checkpoints, eventos } = jogar(json, (choices) => choices[Math.floor(r() * choices.length)]!.index);
        expect(linhas.at(-1)?.app).toBe('fim');
        expect(linhas.every((l) => l.text.length > 0)).toBe(true);
        expect([...checkpoints.keys()]).toEqual(CAPITULOS);

        const momentos = engine.describeMoments();
        expect(momentos.map((m) => m.id).sort()).toEqual([...MOMENTOS].sort());
        momentos.forEach((m) => tiposVistos.add(m.type));

        for (const l of linhas) if (l.meta.kant) expect(Object.keys(trechos)).toContain(l.meta.kant);
        expect(eventos.filter((e) => e.startsWith('padrao_'))).toHaveLength(1);

        const conforto = engine.getNumber('conforto');
        expect(conforto).toBeGreaterThanOrEqual(0);
        expect(conforto).toBeLessThanOrEqual(100);
      } catch (error) {
        throw new Error(`Falhou com semente ${seed}: ${String(error)}`);
      }
    }
    expect([...tiposVistos].sort()).toEqual([...MOMENT_TYPES].sort());
  });

  it('todo checkpoint de capítulo pode ser retomado', () => {
    const r = rng(42);
    const { checkpoints } = jogar(json, (choices) => choices[Math.floor(r() * choices.length)]!.index);
    expect([...checkpoints.keys()]).toEqual(CAPITULOS);
    for (const [chapter, cp] of checkpoints) {
      const step = new StoryEngine(json).resume(cp);
      expect(step.lines[0]?.meta.chapter).toBe(chapter);
    }
  });

  it('caminho "aceitar tudo": comodidade predomina e o resumo substitui a leitura', () => {
    const { engine, eventos } = jogar(json, preferir('sugestao'));
    const tipos = Object.fromEntries(engine.getMoments().map((m) => [m.id, m.type]));
    expect(tipos).toEqual({
      cap1_bia: 'delegou_comodidade',
      cap2_premium: 'delegou_comodidade',
      cap2_remedio: 'delegou_com_razao',
      cap2_caminho: 'recuou_medo',
      cap3_ordem: 'recuou_medo',
      cap4_debate: 'delegou_comodidade',
      cap4_liberta: 'rompeu_sem_pensar',
    });
    expect(eventos).toEqual(['padrao_comodidade']);
  });

  it('caminho "pensar": pensa sempre, confia na médica, recusa o resumo e lê Kant', () => {
    const { engine, linhas, eventos } = jogar(json, preferir('pensar', 'ficha', 'compor'));
    const tipos = Object.fromEntries(engine.getMoments().map((m) => [m.id, m.type]));
    expect(tipos).toEqual({
      cap1_bia: 'pensou',
      cap2_premium: 'pensou',
      cap2_remedio: 'delegou_com_razao',
      cap2_caminho: 'pensou',
      cap3_ordem: 'pensou',
      cap4_debate: 'pensou',
      cap4_liberta: 'pensou',
    });
    expect(eventos).toEqual(['padrao_pensou', 'amparo_sugerir', 'leu_kant']);
    expect(linhas.some((l) => l.app === 'texto')).toBe(true);
    const resposta = linhas.find((l) => l.meta.from === 'eu');
    expect(resposta?.text.startsWith('Li a matéria.')).toBe(true);
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
    expect(engine.getMoments().find((m) => m.id === 'cap1_bia')?.type).toBe('pensou');
  });
});
