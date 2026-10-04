import type { StoryChoice, StoryLine } from '../../engine/StoryEngine';
import { t } from '../../i18n';
import { createChoiceButtons, focusPreferred, waitForContinue } from '../choices';
import { h } from '../dom';
import type { AppView } from './AppView';

/**
 * Leitor de matéria. Linhas com `from` viram o cabeçalho do veículo; `title` vira manchete;
 * o resto vira parágrafo. Escolhas `#ficha` aparecem como trechos tocáveis; ao tocar, a ficha é guardada.
 */
export class ReaderApp implements AppView {
  readonly id = 'leitor' as const;
  readonly el: HTMLElement;
  private readonly fonte: HTMLElement;
  private readonly artigo: HTMLElement;
  private readonly trechos: HTMLElement;
  private readonly listaTrechos: HTMLElement;
  private readonly contador: HTMLElement;
  private readonly choices: HTMLElement;
  private guardadas = 0;

  constructor() {
    this.fonte = h('p', { className: 'leitor__fonte' });
    this.artigo = h('article', { className: 'leitor__artigo' });
    this.listaTrechos = h('div', { className: 'leitor__lista' });
    this.trechos = h('section', { className: 'leitor__trechos', attrs: { hidden: '' } }, [
      h('p', { className: 'leitor__dica', text: t('leitor.dica') }),
      this.listaTrechos,
    ]);
    this.contador = h('p', { className: 'leitor__contador', attrs: { 'aria-live': 'polite', hidden: '' } });
    this.choices = h('div', { className: 'choices', attrs: { role: 'group', 'aria-label': t('escolhas.rotulo') } });
    this.el = h('section', { className: 'app app--leitor' }, [this.fonte, this.artigo, this.trechos, this.contador, this.choices]);
  }

  async showLine(line: StoryLine): Promise<void> {
    this.choices.replaceChildren();
    if (line.meta.from) {
      this.fonte.textContent = line.text;
    } else if (line.meta.title) {
      this.artigo.append(h('h1', { className: 'leitor__manchete', text: line.text }));
    } else {
      this.artigo.append(h('p', { text: line.text }));
    }
  }

  showContinue(): Promise<void> {
    return waitForContinue(this.choices);
  }

  showChoices(choices: StoryChoice[], onPick: (index: number) => void): void {
    const buttons = createChoiceButtons(choices, (index) => {
      if (choices.find((c) => c.index === index)?.kind === 'ficha') this.guardar();
      onPick(index);
    });
    const fichas = buttons.filter((_, i) => choices[i]!.kind === 'ficha');
    fichas.forEach((b) => b.classList.add('ficha'));
    const acoes = buttons.filter((_, i) => choices[i]!.kind !== 'ficha');
    this.listaTrechos.replaceChildren(...fichas);
    this.trechos.hidden = fichas.length === 0;
    this.choices.replaceChildren(...acoes);
    focusPreferred(buttons, choices);
  }

  private guardar(): void {
    this.guardadas++;
    this.contador.hidden = false;
    this.contador.textContent = t('leitor.fichas', { n: this.guardadas });
  }
}
