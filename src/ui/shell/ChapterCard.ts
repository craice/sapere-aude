import { armButton, isArmed } from '../choices';
import { h } from '../dom';
import { t } from '../../i18n';

/** Cartão de título de capítulo. Resolve quando o jogador toca em "Continuar". */
export function showChapterCard(screen: HTMLElement, title: string): Promise<void> {
  return new Promise((resolve) => {
    const button = h('button', { className: 'card__continuar', text: t('capitulo.continuar'), attrs: { type: 'button' } });
    const card = h('div', { className: 'card', attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'card-titulo' } }, [
      h('h1', { className: 'card__titulo', text: title, attrs: { id: 'card-titulo' } }),
      button,
    ]);
    armButton(button);
    button.addEventListener('click', () => {
      if (!isArmed(button) || !card.isConnected) return;
      card.remove();
      resolve();
    });
    screen.append(card);
    // Abre no topo: o foco no botão não pode rolar o título para fora da tela.
    button.focus({ preventScroll: true });
    card.scrollTop = 0;
  });
}
