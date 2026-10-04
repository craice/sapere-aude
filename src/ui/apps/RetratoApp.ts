import type { DescribedMoment, StoryChoice, StoryLine } from '../../engine/StoryEngine';
import { t } from '../../i18n';
import { createChoiceButtons, focusPreferred, waitForContinue } from '../choices';
import { h, wait } from '../dom';
import type { AppView } from './AppView';

/** Retrato final: a primeira linha é o título; em seguida, a linha do tempo das decisões; depois, a leitura. */
export class RetratoApp implements AppView {
  readonly id = 'retrato' as const;
  readonly el: HTMLElement;
  private readonly corpo: HTMLElement;
  private readonly choices: HTMLElement;

  constructor(private readonly moments: () => DescribedMoment[]) {
    this.corpo = h('div', { className: 'retrato__corpo' });
    this.choices = h('div', { className: 'choices', attrs: { role: 'group', 'aria-label': t('escolhas.rotulo') } });
    this.el = h('section', { className: 'app app--retrato' }, [this.corpo, this.choices]);
  }

  async showLine(line: StoryLine): Promise<void> {
    this.choices.replaceChildren();
    if (this.corpo.childElementCount === 0) {
      const titulo = h('h1', { className: 'retrato__titulo', text: line.text, attrs: { tabindex: '-1' } });
      const linha = h('ol', { className: 'retrato__linha', attrs: { 'aria-label': t('retrato.rotulo') } },
        this.moments().map((m) =>
          h('li', { className: `retrato__momento retrato__momento--${m.type}` }, [
            h('span', { className: 'retrato__rotulo', text: m.label }),
            h('span', { className: 'retrato__tipo', text: t(`momento.${m.type}`) }),
          ]),
        ),
      );
      this.corpo.append(titulo, linha);
      titulo.focus();
      return;
    }
    await wait(500);
    this.corpo.append(h('p', { className: 'retrato__leitura', text: line.text }));
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
