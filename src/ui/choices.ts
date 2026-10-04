import type { StoryChoice } from '../engine/StoryEngine';
import { t } from '../i18n';
import { h } from './dom';

export type PickHandler = (index: number) => void;

/**
 * Cria um botão por escolha. Só a primeira escolha da rodada vale:
 * depois dela todos os botões são desativados (protege contra toque duplo).
 */
export function createChoiceButtons(choices: StoryChoice[], onPick: PickHandler): HTMLButtonElement[] {
  let picked = false;
  const buttons = choices.map((choice) => {
    const button = h('button', { className: `choice choice--${choice.kind}`, text: choice.text, attrs: { type: 'button' } });
    button.addEventListener('click', (event) => {
      if (picked || isRepeatClick(event)) return;
      picked = true;
      for (const b of buttons) b.disabled = true;
      onPick(choice.index);
    });
    return button;
  });
  return buttons;
}

/**
 * O segundo clique de um duplo toque (detail ≥ 2) cairia no botão que acabou de aparecer
 * no mesmo lugar e escolheria sem querer. Teclado (detail 0) e cliques simples (1) passam.
 */
function isRepeatClick(event: MouseEvent): boolean {
  return event.detail >= 2;
}

/** Pausa de leitura: mostra "Continuar" no lugar das escolhas e resolve quando o jogador toca. */
export function waitForContinue(container: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const button = h('button', { className: 'choice choice--continuar', text: t('capitulo.continuar'), attrs: { type: 'button' } });
    button.addEventListener('click', (event) => {
      if (isRepeatClick(event) || button.disabled) return;
      button.disabled = true;
      container.replaceChildren();
      resolve();
    });
    container.replaceChildren(button);
    button.focus();
  });
}

/** A sugestão do Amparo vem pré-selecionada (Enter aceita). Sem sugestão, foca a primeira opção. */
export function focusPreferred(buttons: HTMLButtonElement[], choices: StoryChoice[]): void {
  const i = choices.findIndex((c) => c.kind === 'sugestao');
  (buttons[i >= 0 ? i : 0])?.focus();
}
