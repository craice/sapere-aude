import kantMarkdown from '../../content/pt-BR/kant/esclarecimento.md?raw';
import { h } from './dom';
import { parseMarkdownLite, type Block } from './markdown';

function renderBlock(block: Block): HTMLElement {
  if (block.kind === 'hr') return h('hr');
  const tag = block.kind === 'h1' ? 'h1' : block.kind === 'quote' ? 'blockquote' : 'p';
  return h(tag, {}, block.spans.map((s) => (s.em ? h('em', { text: s.text }) : s.strong ? h('strong', { text: s.text }) : s.text)));
}

/** O texto completo de Kant, montado com textContent (nunca innerHTML). */
export function renderKantText(): HTMLElement[] {
  return parseMarkdownLite(kantMarkdown).map(renderBlock);
}
