import { h, wait } from '../dom';
import { characterName, t } from '../../i18n';
import { comfortKey } from '../comfort';
import type { CharacterId } from '../../tags/protocol';

export class Phone {
  /** Moldura inteira: telas sobrepostas que não pertencem à história (ex.: Sobre) ficam aqui, fora de `screen`. */
  readonly root: HTMLElement;
  readonly screen: HTMLElement;
  private readonly clock: HTMLElement;
  private readonly comfort: HTMLElement;
  private readonly banner: HTMLElement;

  constructor(host: HTMLElement, onAbout: (button: HTMLElement) => void) {
    this.clock = h('span', { className: 'status__relogio' });
    this.comfort = h('span', { className: 'status__conforto' });
    this.banner = h('div', { className: 'banner', attrs: { role: 'status', 'aria-live': 'polite' } });
    this.screen = h('div', { className: 'phone__tela' });
    const about = h('button', { className: 'status__sobre', text: t('sobre.botao'), attrs: { type: 'button' } });
    about.addEventListener('click', () => onAbout(about));
    const status = h('header', { className: 'status' }, [this.clock, this.comfort, about]);
    this.root = h('div', { className: 'phone' }, [status, this.banner, this.screen]);
    host.replaceChildren(this.root);
  }

  setTime(time: string): void {
    this.clock.textContent = time;
  }

  setComfort(value: number): void {
    this.comfort.textContent = t(comfortKey(value));
  }

  /** Some com a notificação atual (ex.: ao começar um capítulo). */
  clearNotification(): void {
    this.banner.replaceChildren();
    this.banner.classList.remove('banner--visivel', 'banner--entrando');
  }

  /** Mostra a notificação no topo; ela fica até a próxima ou até o próximo capítulo. */
  async notify(from: CharacterId, text: string): Promise<void> {
    this.banner.replaceChildren(h('strong', { className: 'banner__de', text: characterName(from) }), h('span', { text }));
    this.banner.classList.remove('banner--entrando');
    void this.banner.offsetWidth;
    this.banner.classList.add('banner--visivel', 'banner--entrando');
    await wait(1200);
  }
}
