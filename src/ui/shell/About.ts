import { t } from '../../i18n';
import { armButton, isArmed } from '../choices';
import { h } from '../dom';
import { renderKantText } from '../kantText';

const REPOSITORIO = 'https://github.com/craice/sapere-aude';

interface AboutOptions {
  /** Onde a tela é montada: fora da área da história, para que a história não a apague. */
  root: HTMLElement;
  /** A área da história, que fica inerte (sem foco nem toque) enquanto o Sobre está aberto. */
  story: HTMLElement;
  onRestart(): void;
  returnFocus?: HTMLElement;
}

function botao(texto: string, extra = ''): HTMLButtonElement {
  const b = h('button', { className: `choice ${extra}`.trim(), text: texto, attrs: { type: 'button' } });
  armButton(b);
  return b;
}

/** Tela "Sobre": créditos, licenças, privacidade, texto de Kant e recomeço (com confirmação). */
export function openAbout(options: AboutOptions): void {
  if (options.root.querySelector('.sobre')) return;

  const fechar = botao(t('sobre.fechar'));
  const lerKant = botao(t('sobre.lerKant'));
  const recomecar = botao(t('sobre.recomecar'));
  const painel = h('div', { className: 'card sobre', attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'sobre-titulo' } }, [
    h('h1', { className: 'sobre__titulo', text: t('sobre.titulo'), attrs: { id: 'sobre-titulo' } }),
    h('p', { text: t('sobre.descricao') }),
    h('p', { text: t('sobre.creditos') }),
    h('p', { text: t('sobre.original') }),
    h('p', { text: t('sobre.traducao') }),
    h('p', { text: t('sobre.licencas') }),
    h('p', {}, [h('a', { text: t('sobre.repositorio'), attrs: { href: REPOSITORIO, target: '_blank', rel: 'noopener' } })]),
    h('p', { className: 'sobre__privacidade', text: t('sobre.privacidade') }),
    h('div', { className: 'choices' }, [lerKant, recomecar, fechar]),
  ]);

  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    const texto = options.root.querySelector<HTMLElement>('.sobre-texto');
    if (texto) texto.querySelector<HTMLButtonElement>('button')?.click();
    else close();
  };

  const close = () => {
    painel.remove();
    options.story.inert = false;
    document.removeEventListener('keydown', onKey);
    options.returnFocus?.focus();
  };

  fechar.addEventListener('click', () => {
    if (isArmed(fechar)) close();
  });

  lerKant.addEventListener('click', () => {
    if (!isArmed(lerKant)) return;
    const voltar = botao(t('sobre.voltar'));
    const titulo = h('div', { className: 'texto__artigo' }, renderKantText());
    const leitura = h('div', { className: 'card sobre-texto', attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-label': t('texto.rotulo') } }, [
      titulo,
      h('div', { className: 'choices' }, [voltar]),
    ]);
    painel.inert = true;
    voltar.addEventListener('click', () => {
      if (!isArmed(voltar)) return;
      leitura.remove();
      painel.inert = false;
      lerKant.focus();
    });
    options.root.append(leitura);
    const h1 = titulo.querySelector('h1');
    h1?.setAttribute('tabindex', '-1');
    h1?.focus();
  });

  let confirmando = false;
  recomecar.addEventListener('click', () => {
    if (!isArmed(recomecar)) return;
    if (!confirmando) {
      confirmando = true;
      recomecar.textContent = t('sobre.confirmar');
      recomecar.classList.add('choice--perigo');
      recomecar.removeAttribute('data-pronto');
      armButton(recomecar);
      return;
    }
    close();
    options.onRestart();
  });

  options.story.inert = true;
  document.addEventListener('keydown', onKey);
  options.root.append(painel);
  fechar.focus();
}
