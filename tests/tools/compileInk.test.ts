import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { Story } from 'inkjs';
import { compileInk } from '../../tools/ink/compileInk';

const fixture = (name: string) => fileURLToPath(new URL(`../fixtures/ink/${name}`, import.meta.url));

describe('compileInk', () => {
  it('compila main.ink com INCLUDE e gera JSON executável', () => {
    const result = compileInk(fixture('ok'));
    expect(result.errors).toEqual([]);
    const story = new Story(result.json);
    expect(story.Continue()).toBe('Olá do arquivo incluído.\n');
    expect(story.currentTags).toEqual(['from: bia']);
  });

  it('lista todos os .ink da pasta para o watcher', () => {
    const result = compileInk(fixture('ok'));
    expect(result.files.map((f) => f.split(/[\\/]/).pop()).sort()).toEqual(['main.ink', 'parte.ink']);
  });

  it('reporta erros de compilação sem lançar exceção', () => {
    const result = compileInk(fixture('erro'));
    expect(result.json).toBe('');
    expect(result.errors.join('\n')).toContain('lugar_que_nao_existe');
  });
});
