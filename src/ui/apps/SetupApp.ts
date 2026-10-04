import type { StoryChoice, StoryLine } from '../../engine/StoryEngine';
import { characterName, t } from '../../i18n';
import { createChoiceButtons, focusPreferred, waitForContinue } from '../choices';
import { h, wait } from '../dom';
import type { AppView } from './AppView';

/** Tela de configuração do Amparo: falas grandes e centralizadas. */
export class SetupApp implements AppView {
  readonly id = 'setup' as const;
  readonly el: HTMLElement;
  private readonly falas: HTMLElement;
  private readonly choices: HTMLElement;

  constructor() {
    this.falas = h('div', { className: 'setup__falas', attrs: { 'aria-live': 'polite' } });
    this.choices = h('div', { className: 'choices', attrs: { role: 'group', 'aria-label': t('escolhas.rotulo') } });
    this.el = h('section', { className: 'app app--setup' }, [
      h('div', { className: 'setup__logo', attrs: { 'aria-hidden': 'true' } }),
      h('p', { className: 'setup__nome', text: characterName('amparo') }),
      this.falas,
      this.choices,
    ]);
  }

  async showLine(line: StoryLine): Promise<void> {
    this.choices.replaceChildren();
    await wait(450);
    const className = line.meta.from === 'amparo' ? 'setup__fala' : 'setup__nota';
    this.falas.append(h('p', { className, text: line.text }));
  }

  showContinue(): Promise<void> {
    return waitForContinue(this.choices);
  }

  showChoices(choices: StoryChoice[], onPick: (index: number) => void): void {
    const buttons = createChoiceButtons(choices, onPick);
    this.choices.replaceChildren(...buttons);
    focusPreferred(buttons, choices);
  }
}
