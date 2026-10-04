import type { StoryChoice, StoryLine } from '../../engine/StoryEngine';
import { characterName, t } from '../../i18n';
import type { CharacterId } from '../../tags/protocol';
import { createChoiceButtons, focusPreferred, waitForContinue } from '../choices';
import { h, wait } from '../dom';
import type { AppView } from './AppView';

export class ChatApp implements AppView {
  readonly id = 'chat' as const;
  readonly el: HTMLElement;
  private readonly title: HTMLElement;
  private readonly log: HTMLElement;
  private readonly choices: HTMLElement;

  constructor() {
    this.title = h('h2', { className: 'app__titulo', text: t('chat.titulo') });
    this.log = h('ol', { className: 'chat__log', attrs: { role: 'log', 'aria-live': 'polite' } });
    this.choices = h('div', { className: 'choices', attrs: { role: 'group', 'aria-label': t('escolhas.rotulo') } });
    this.el = h('section', { className: 'app app--chat' }, [this.title, this.log, this.choices]);
  }

  async showLine(line: StoryLine): Promise<void> {
    this.choices.replaceChildren();
    const from = line.meta.from;
    if (from && from !== 'eu') {
      if (from !== 'amparo') this.title.textContent = characterName(from);
      await this.typing(from, line.text);
    }
    const item = from
      ? h('li', { className: `msg msg--${from}` }, [
          h('span', { className: 'msg__autor', text: characterName(from) }),
          h('p', { className: 'msg__texto', text: line.text }),
        ])
      : h('li', { className: 'msg msg--narracao' }, [h('p', { className: 'msg__texto', text: line.text })]);
    this.log.append(item);
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

  private async typing(from: CharacterId, text: string): Promise<void> {
    const indicator = h('li', {
      className: 'msg msg--digitando',
      text: t('digitando', { nome: characterName(from) }),
      attrs: { 'aria-hidden': 'true' },
    });
    this.log.append(indicator);
    await wait(Math.min(1400, 400 + text.length * 15));
    indicator.remove();
  }
}
