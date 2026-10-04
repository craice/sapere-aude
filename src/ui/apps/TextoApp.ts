import kantMarkdown from '../../../content/pt-BR/kant/esclarecimento.md?raw';
import type { StoryChoice, StoryLine } from '../../engine/StoryEngine';
import { t } from '../../i18n';
import { createChoiceButtons, focusPreferred, waitForContinue } from '../choices';
import { h } from '../dom';
import { parseMarkdownLite, type Block } from '../markdown';
import type { AppView } from './AppView';

function renderBlock(block: Block): HTMLElement {
  if (block.kind === 'hr') return h('hr');
  const tag = block.kind === 'h1' ? 'h1' : block.kind === 'quote' ? 'blockquote' : 'p';
  return h(tag, {}, block.spans.map((s) => (s.em ? h('em', { text: s.text }) : s.strong ? h('strong', { text: s.text }) : s.text)));
}

/** Leitor do texto completo de Kant. As linhas do roteiro aparecem antes do texto, como introdução. */
export class TextoApp implements AppView {
  readonly id = 'texto' as const;
  readonly el: HTMLElement;
  private readonly intro: HTMLElement;
  private readonly artigo: HTMLElement;
  private readonly choices: HTMLElement;

  constructor() {
    this.intro = h('div', { className: 'texto__intro' });
    this.artigo = h('article', { className: 'texto__artigo', attrs: { 'aria-label': t('texto.rotulo') } });
    this.choices = h('div', { className: 'choices', attrs: { role: 'group', 'aria-label': t('escolhas.rotulo') } });
    this.el = h('section', { className: 'app app--texto' }, [this.intro, this.artigo, this.choices]);
  }

  async showLine(line: StoryLine): Promise<void> {
    this.intro.append(h('p', { text: line.text }));
    if (this.artigo.childElementCount === 0) {
      this.artigo.append(...parseMarkdownLite(kantMarkdown).map(renderBlock));
      const titulo = this.artigo.querySelector('h1');
      titulo?.setAttribute('tabindex', '-1');
      titulo?.focus();
      this.el.scrollTop = 0;
    }
  }

  showContinue(): Promise<void> {
    return waitForContinue(this.choices);
  }

  showChoices(choices: StoryChoice[], onPick: (index: number) => void): void {
    const buttons = createChoiceButtons(choices, onPick);
    this.choices.replaceChildren(...buttons);
  }
}
