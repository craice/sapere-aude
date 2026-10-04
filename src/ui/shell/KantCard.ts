import trechos from '../../../content/pt-BR/kant/trechos.json';
import { t } from '../../i18n';
import { armButton, isArmed } from '../choices';
import { h } from '../dom';

const TRECHOS: Record<string, string[]> = trechos;

/** Cartão de citação ao fim do capítulo: título vindo do roteiro + trecho da tradução. */
export function showKantCard(screen: HTMLElement, title: string, key: string): Promise<void> {
  const fragmentos = TRECHOS[key];
  if (!fragmentos) return Promise.reject(new Error(`Trecho de Kant inexistente: "${key}"`));
  return new Promise((resolve) => {
    const button = h('button', { className: 'card__continuar', text: t('capitulo.continuar'), attrs: { type: 'button' } });
    const card = h('div', { className: 'card card--kant', attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'kant-titulo' } }, [
      h('h1', { className: 'kant__titulo', text: title, attrs: { id: 'kant-titulo' } }),
      h('blockquote', { className: 'kant__citacao' }, [
        h('p', { text: `“${fragmentos.join(' […] ')}”` }),
        h('footer', {}, [h('span', { text: t('kant.assinatura') }), h('small', { text: t('kant.traducao') })]),
      ]),
      button,
    ]);
    armButton(button);
    button.addEventListener('click', () => {
      if (!isArmed(button) || !card.isConnected) return;
      card.remove();
      resolve();
    });
    screen.append(card);
    button.focus();
  });
}
