import { describe, it, expect } from 'vitest';
import { parseMarkdownLite } from '../../src/ui/markdown';

describe('parseMarkdownLite', () => {
  it('reconhece título, citação, separador e parágrafos', () => {
    const blocks = parseMarkdownLite('# Título\n\n> nota\n> continua\n\nParágrafo um\nainda um.\n\n---\n\nDois.');
    expect(blocks).toEqual([
      { kind: 'h1', spans: [{ text: 'Título' }] },
      { kind: 'quote', spans: [{ text: 'nota continua' }] },
      { kind: 'p', spans: [{ text: 'Parágrafo um ainda um.' }] },
      { kind: 'hr', spans: [] },
      { kind: 'p', spans: [{ text: 'Dois.' }] },
    ]);
  });

  it('reconhece *itálico*, **negrito** e asterisco escapado', () => {
    expect(parseMarkdownLite('A *Sapere aude!* e **nota**. Fim.\\*')[0]).toEqual({
      kind: 'p',
      spans: [{ text: 'A ' }, { text: 'Sapere aude!', em: true }, { text: ' e ' }, { text: 'nota', strong: true }, { text: '. Fim.*' }],
    });
  });

  it('separa parágrafos de citação em vários blocos de citação', () => {
    expect(parseMarkdownLite('> a\n>\n> b').map((b) => b.kind)).toEqual(['quote', 'quote']);
  });
});
