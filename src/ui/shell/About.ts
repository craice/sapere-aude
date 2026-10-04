import { t } from '../../i18n';
import { armButton, isArmed } from '../choices';
import { h } from '../dom';

const REPOSITORIO = 'https://github.com/craice/sapere-aude';

/** Tela "Sobre": créditos, licenças, privacidade e recomeço (com confirmação). */
export function openAbout(screen: HTMLElement, options: { onRestart(): void; returnFocus?: HTMLElement }): void {
  if (screen.querySelector('.sobre')) return;

  const fechar = h('button', { className: 'choice', text: t('sobre.fechar'), attrs: { type: 'button' } });
  const recomecar = h('button', { className: 'choice', text: t('sobre.recomecar'), attrs: { type: 'button' } });
  const painel = h('div', { className: 'card sobre', attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'sobre-titulo' } }, [
    h('h1', { className: 'sobre__titulo', text: t('sobre.titulo'), attrs: { id: 'sobre-titulo' } }),
    h('p', { text: t('sobre.descricao') }),
    h('p', { text: t('sobre.original') }),
    h('p', { text: t('sobre.traducao') }),
    h('p', { text: t('sobre.licencas') }),
    h('p', {}, [h('a', { text: t('sobre.repositorio'), attrs: { href: REPOSITORIO, target: '_blank', rel: 'noopener' } })]),
    h('p', { className: 'sobre__privacidade', text: t('sobre.privacidade') }),
    h('div', { className: 'choices' }, [recomecar, fechar]),
  ]);

  const close = () => {
    painel.remove();
    options.returnFocus?.focus();
  };
  painel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
  fechar.addEventListener('click', close);

  let confirmando = false;
  recomecar.addEventListener('click', () => {
    if (!confirmando) {
      confirmando = true;
      recomecar.textContent = t('sobre.confirmar');
      recomecar.classList.add('choice--perigo');
      recomecar.removeAttribute('data-pronto');
      armButton(recomecar);
      return;
    }
    if (!isArmed(recomecar)) return;
    painel.remove();
    options.onRestart();
  });

  screen.append(painel);
  fechar.focus();
}
