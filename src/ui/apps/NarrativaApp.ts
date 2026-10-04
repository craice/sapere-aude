import type { StoryChoice, StoryLine } from '../../engine/StoryEngine';
import { characterName, t } from '../../i18n';
import { createChoiceButtons, focusPreferred, waitForContinue } from '../choices';
import { h, wait } from '../dom';
import type { AppView } from './AppView';

/** Cena narrada (rua, escritório, audiência, minijogo): texto corrido, falas com nome do personagem. */
export class NarrativaApp implements AppView {
  readonly id = 'narrativa' as const;
  readonly el: HTMLElement;
  private readonly texto: HTMLElement;
  private readonly choices: HTMLElement;

  constructor() {
    this.texto = h('div', { className: 'narrativa__texto', attrs: { 'aria-live': 'polite' } });
    this.choices = h('div', { className: 'choices', attrs: { role: 'group', 'aria-label': t('escolhas.rotulo') } });
    this.el = h('section', { className: 'app app--narrativa' }, [this.texto, this.choices]);
  }

  async showLine(line: StoryLine): Promise<void> {
    this.choices.replaceChildren();
    await wait(350);
    let item: HTMLElement;
    if (line.meta.title) {
      item = h('h2', { className: 'narrativa__titulo', text: line.text });
    } else if (line.meta.from) {
      item = h('p', { className: `narrativa__fala narrativa__fala--${line.meta.from}` }, [
        h('strong', { text: `${characterName(line.meta.from)}: ` }),
        line.text,
      ]);
    } else {
      item = h('p', { text: line.text });
    }
    this.texto.append(item);
    item.scrollIntoView({ block: 'end' });
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
