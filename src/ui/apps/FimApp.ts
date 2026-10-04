import type { StoryChoice, StoryLine } from '../../engine/StoryEngine';
import { t } from '../../i18n';
import { createChoiceButtons, focusPreferred, waitForContinue } from '../choices';
import { h } from '../dom';
import type { AppView } from './AppView';

export class FimApp implements AppView {
  readonly id = 'fim' as const;
  readonly el: HTMLElement;
  private readonly texto: HTMLElement;
  private readonly choices: HTMLElement;

  constructor() {
    this.texto = h('div', { className: 'fim__texto' });
    this.choices = h('div', { className: 'choices', attrs: { role: 'group', 'aria-label': t('escolhas.rotulo') } });
    this.el = h('section', { className: 'app app--fim' }, [this.texto, this.choices]);
  }

  async showLine(line: StoryLine): Promise<void> {
    const primeira = this.texto.childElementCount === 0;
    this.texto.append(primeira ? h('h1', { className: 'fim__titulo', text: line.text }) : h('p', { text: line.text }));
  }

  showContinue(): Promise<void> {
    return waitForContinue(this.choices);
  }

  showChoices(choices: StoryChoice[], onPick: (index: number) => void): void {
    const buttons = createChoiceButtons(choices, onPick);
    this.choices.replaceChildren(...buttons);
    focusPreferred(buttons, choices);
  }

  showEnd(onRestart: () => void): void {
    const button = h('button', { className: 'choice choice--sugestao', text: t('fim.recomecar'), attrs: { type: 'button' } });
    button.addEventListener('click', onRestart, { once: true });
    this.choices.replaceChildren(button);
    button.focus();
  }
}
