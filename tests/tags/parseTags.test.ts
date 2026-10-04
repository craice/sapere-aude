import { describe, it, expect } from 'vitest';
import { parseLineTags, parseChoiceTags } from '../../src/tags/parseTags';
import { TagError } from '../../src/tags/protocol';

describe('parseLineTags', () => {
  it('linha sem tags → meta vazia', () => {
    expect(parseLineTags([])).toEqual({});
  });

  it('lê app, time, from, chapter e title', () => {
    expect(parseLineTags(['chapter: cap1', 'app: chat', 'time: 07:42'])).toEqual({ chapter: 'cap1', app: 'chat', time: '07:42' });
    expect(parseLineTags(['from: bia'])).toEqual({ from: 'bia' });
    expect(parseLineTags(['title'])).toEqual({ title: true });
    expect(parseLineTags(['notify: amparo'])).toEqual({ notify: 'amparo' });
  });

  it('lê kant e evento', () => {
    expect(parseLineTags(['kant: cap2'])).toEqual({ kant: 'cap2' });
    expect(parseLineTags(['evento: leu_kant'])).toEqual({ evento: 'leu_kant' });
  });

  it('aceita os apps e personagens do jogo completo', () => {
    for (const app of ['narrativa', 'retrato', 'texto']) expect(parseLineTags([`app: ${app}`])).toEqual({ app });
    for (const p of ['vidafit', 'resumao', 'guru', 'celia', 'arnaldo', 'duda', 'liberta']) expect(parseLineTags([`from: ${p}`])).toEqual({ from: p });
  });

  it('tolera espaços extras', () => {
    expect(parseLineTags(['  from :   bia  '])).toEqual({ from: 'bia' });
  });

  it.each([
    [['cor: azul'], 'tag desconhecida'],
    [['app: twitter'], 'app inválido'],
    [['from: carlos'], 'personagem inválido'],
    [['notify: carlos'], 'personagem inválido'],
    [['time: 7h'], 'hora inválida'],
    [['chapter: Capítulo 1'], 'capítulo inválido'],
    [['from: bia', 'from: eu'], 'tag repetida'],
    [['from: bia', 'notify: amparo'], 'from e notify'],
    [['title: sim'], 'title não leva valor'],
    [['from'], 'from precisa de valor'],
    [['kant: capitulo1'], 'kant inválido'],
    [['kant'], 'kant precisa de valor'],
    [['evento: Leu Kant'], 'evento inválido'],
  ])('rejeita %j (%s)', (tags) => {
    expect(() => parseLineTags(tags)).toThrow(TagError);
  });
});

describe('parseChoiceTags', () => {
  it('sem tag → resposta comum', () => {
    expect(parseChoiceTags([])).toEqual({ kind: 'resposta' });
  });

  it.each(['sugestao', 'pensar', 'ficha', 'compor'])('aceita %s', (kind) => {
    expect(parseChoiceTags([kind])).toEqual({ kind });
  });

  it('rejeita tipo desconhecido ou mais de uma tag', () => {
    expect(() => parseChoiceTags(['talvez'])).toThrow(TagError);
    expect(() => parseChoiceTags(['sugestao', 'pensar'])).toThrow(TagError);
    expect(() => parseChoiceTags(['from: bia'])).toThrow(TagError);
  });
});
