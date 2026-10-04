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
