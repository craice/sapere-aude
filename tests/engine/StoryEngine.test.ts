import { describe, it, expect } from 'vitest';
import { StoryEngine } from '../../src/engine/StoryEngine';
import { TagError } from '../../src/tags/protocol';
import { compileSource } from '../helpers/compileSource';

const HEADER = `VAR conforto = 70
VAR momentos = ""
`;
const FUNCOES = `
=== function registrar(id, tipo) ===
~ momentos = "{momentos}{id}:{tipo};"
`;

const UM_CAPITULO = compileSource(`${HEADER}-> cap1
=== cap1 ===
Manhã # chapter: cap1 # app: chat # time: 07:42
Oi! # from: bia
* [Aceitar #sugestao]
  ~ conforto = conforto + 10
  ~ registrar("cap1_bia", "delegou_comodidade")
  Ok. # from: eu
* [Ler #pensar]
  ~ registrar("cap1_bia", "pensou")
  Matéria # app: leitor # title # time: 07:50
- Fim. # app: fim
-> END
${FUNCOES}`);

const DOIS_CAPITULOS = compileSource(`${HEADER}-> cap0
=== cap0 ===
Configuração # chapter: cap0 # app: setup # time: 07:30
* [Sim #sugestao]
  ~ conforto = 90
- -> cap1
=== cap1 ===
Manhã # chapter: cap1 # app: chat # time: 07:42
* [Ok]
- Fim. # app: fim
-> END
${FUNCOES}`);

describe('StoryEngine', () => {
  it('start: devolve linhas com app e hora "grudentos" e escolhas tipadas', () => {
    const step = new StoryEngine(UM_CAPITULO).start();
    expect(step.lines).toEqual([
      { text: 'Manhã', meta: { chapter: 'cap1', app: 'chat', time: '07:42' }, app: 'chat', time: '07:42' },
      { text: 'Oi!', meta: { from: 'bia' }, app: 'chat', time: '07:42' },
    ]);
    expect(step.choices).toEqual([
      { index: 0, text: 'Aceitar', kind: 'sugestao' },
      { index: 1, text: 'Ler', kind: 'pensar' },
    ]);
    expect(step.ended).toBe(false);
  });

  it('choose: avança, aplica variáveis e registra momento', () => {
    const engine = new StoryEngine(UM_CAPITULO);
    engine.start();
    const step = engine.choose(0);
    expect(step.lines.map((l) => [l.text, l.app])).toEqual([['Ok.', 'chat'], ['Fim.', 'fim']]);
    expect(step.ended).toBe(true);
    expect(engine.getNumber('conforto')).toBe(80);
    expect(engine.getMoments()).toEqual([{ id: 'cap1_bia', type: 'delegou_comodidade' }]);
    expect(engine.currentApp).toBe('fim');
  });

  it('choose: troca de app e hora no meio do caminho', () => {
    const engine = new StoryEngine(UM_CAPITULO);
    engine.start();
    const step = engine.choose(1);
    expect(step.lines[0]).toEqual({ text: 'Matéria', meta: { app: 'leitor', title: true, time: '07:50' }, app: 'leitor', time: '07:50' });
    expect(engine.getMoments()).toEqual([{ id: 'cap1_bia', type: 'pensou' }]);
  });

  it('choose: índice inválido lança RangeError e não avança', () => {
    const engine = new StoryEngine(UM_CAPITULO);
    engine.start();
    expect(() => engine.choose(2)).toThrow(RangeError);
    expect(() => engine.choose(-1)).toThrow(RangeError);
    expect(() => engine.choose(0.5)).toThrow(RangeError);
    expect(engine.choose(0).lines[0]?.text).toBe('Ok.');
  });

  it('checkpoint + resume: volta ao início do capítulo com variáveis preservadas', () => {
    const engine = new StoryEngine(DOIS_CAPITULOS);
    engine.start();
    expect(engine.checkpoint).toMatchObject({ chapter: 'cap0', app: 'setup', time: '07:30' });
    engine.choose(0);
    const cp = engine.checkpoint!;
    expect(cp).toMatchObject({ chapter: 'cap1', app: 'chat', time: '07:42' });

    const restored = new StoryEngine(DOIS_CAPITULOS);
    const step = restored.resume(JSON.parse(JSON.stringify(cp)));
    expect(step.lines[0]).toMatchObject({ text: 'Manhã', meta: { chapter: 'cap1' } });
    expect(step.choices.map((c) => c.text)).toEqual(['Ok']);
    expect(restored.getNumber('conforto')).toBe(90);
    expect(restored.currentApp).toBe('chat');
  });

  it('linha vazia com tag (condicional falsa) é erro de roteiro', () => {
    const json = compileSource(`VAR f = false\n{f: oi} # from: bia\n-> END\n`);
    expect(() => new StoryEngine(json).start()).toThrow(TagError);
  });

  it('getMoments rejeita tipo desconhecido', () => {
    const json = compileSource(`${HEADER}~ registrar("x", "inventado")\nOi\n-> END\n${FUNCOES}`);
    const engine = new StoryEngine(json);
    engine.start();
    expect(() => engine.getMoments()).toThrow(/inventado/);
  });

  it('getNumber falha para variável inexistente', () => {
    const engine = new StoryEngine(UM_CAPITULO);
    expect(() => engine.getNumber('nao_existe')).toThrow(/nao_existe/);
  });
});
