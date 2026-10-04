import { describe, it, expect } from 'vitest';
import { lintInk } from '../../tools/ink/lintInk';

describe('lintInk', () => {
  it('aceita tags no fim da linha e dentro dos colchetes', () => {
    const src = 'Oi # from: bia\n* [Aceitar #sugestao]\n  Ok. # from: eu\n';
    expect(lintInk(src, 'a.ink')).toEqual([]);
  });

  it('rejeita tag sozinha na linha (o Ink a gruda na linha seguinte)', () => {
    const errors = lintInk('Oi\n  # app: chat\nTchau\n', 'a.ink');
    expect(errors).toEqual(['a.ink:2: tag sozinha na linha — mova-a para o fim da linha a que se refere']);
  });

  it('rejeita tag de escolha fora dos colchetes', () => {
    const errors = lintInk('* [Aceitar] #sugestao\n+ [Outra]   # ficha\n', 'b.ink');
    expect(errors).toEqual([
      'b.ink:1: tag de escolha fora dos colchetes — use * [Texto #tag]',
      'b.ink:2: tag de escolha fora dos colchetes — use * [Texto #tag]',
    ]);
  });

  it('não confunde https:// com comentário', () => {
    expect(lintInk('* [Ler em https://x.org] #sugestao\n', 'd.ink')).toEqual([
      'd.ink:1: tag de escolha fora dos colchetes — use * [Texto #tag]',
    ]);
    expect(lintInk('Veja https://x.org // comentário # não é tag\n', 'e.ink')).toEqual([]);
  });

  it('ignora comentários', () => {
    expect(lintInk('// # isto é um comentário\nOi\n', 'c.ink')).toEqual([]);
  });
});
