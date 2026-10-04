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
    armButton(button);
    button.addEventListener('click', () => {
      if (picked || !isArmed(button)) return;
      picked = true;
      for (const b of buttons) b.disabled = true;
      onPick(choice.index);
    });
    return button;
  });
  return buttons;
}

/** Tempo em que um botão recém-exibido ignora ativações. */
export const ARM_DELAY_MS = 300;

/**
 * Um botão novo costuma surgir no lugar do anterior. Sem esta trava, o segundo toque de um
 * toque duplo, um Enter duplo ou uma tecla segurada escolheriam sem querer. O botão só aceita
 * ativação depois de `data-pronto` (não é animação: vale também com movimento reduzido)
 * e nunca por repetição automática de tecla.
 */
export function armButton(button: HTMLButtonElement): void {
  setTimeout(() => button.setAttribute('data-pronto', ''), ARM_DELAY_MS);
  // Tecla segurada: a repetição automática não pode ativar o botão.
  button.addEventListener('keydown', (event) => {
    if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault();
  });
}

export function isArmed(button: HTMLButtonElement): boolean {
  return button.hasAttribute('data-pronto');
}

/** Pausa de leitura: mostra "Continuar" no lugar das escolhas e resolve quando o jogador toca. */
export function waitForContinue(container: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const button = h('button', { className: 'choice choice--continuar', text: t('capitulo.continuar'), attrs: { type: 'button' } });
    armButton(button);
    button.addEventListener('click', () => {
      if (!isArmed(button) || button.disabled) return;
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
