/**
 * Markdown mínimo para o texto de Kant: # título, > citação, ---, parágrafos, *itálico*, **negrito**, \* literal.
 * Devolve uma estrutura pura (testável); a interface monta o DOM com textContent, nunca innerHTML.
 */
export interface Span {
  text: string;
  em?: true;
  strong?: true;
}

export interface Block {
  kind: 'h1' | 'p' | 'quote' | 'hr';
  spans: Span[];
}

const ESCAPED_STAR = '\u0000';

export function parseInline(raw: string): Span[] {
  const text = raw.replace(/\\\*/g, ESCAPED_STAR);
  const spans: Span[] = [];
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) spans.push({ text: text.slice(last, match.index) });
    if (match[1] !== undefined) spans.push({ text: match[1], strong: true });
    else spans.push({ text: match[2]!, em: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) spans.push({ text: text.slice(last) });
  return spans.map((s) => ({ ...s, text: s.text.replaceAll(ESCAPED_STAR, '*') }));
}

export function parseMarkdownLite(markdown: string): Block[] {
  const blocks: Block[] = [];
  let buffer: string[] = [];
  let kind: 'p' | 'quote' = 'p';

  const flush = () => {
    if (buffer.length > 0) blocks.push({ kind, spans: parseInline(buffer.join(' ')) });
    buffer = [];
  };

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith('# ')) {
      flush();
      blocks.push({ kind: 'h1', spans: parseInline(line.slice(2)) });
    } else if (line === '---') {
      flush();
      blocks.push({ kind: 'hr', spans: [] });
    } else if (line.startsWith('>')) {
      const content = line.replace(/^>\s?/, '');
      if (kind !== 'quote') flush();
      kind = 'quote';
      if (content === '') flush();
      else buffer.push(content);
    } else if (line === '') {
      flush();
      kind = 'p';
    } else {
      if (kind !== 'p') {
        flush();
        kind = 'p';
      }
      buffer.push(line);
    }
  }
  flush();
  return blocks;
}
