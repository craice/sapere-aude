import storyJson from 'virtual:story/pt-BR';
import { browserAnalytics } from './analytics';
import { StoryEngine } from './engine/StoryEngine';
import { t } from './i18n';
import { browserStorage, createSaveStore, storyVersion } from './save/saveStore';
import { startGame } from './save/startGame';
import { h } from './ui/dom';
import { Renderer } from './ui/Renderer';
import { openAbout } from './ui/shell/About';
import { Phone } from './ui/shell/Phone';
import './ui/styles.css';

const host = document.getElementById('app');
const store = createSaveStore(browserStorage(), storyVersion(storyJson));
const analytics = browserAnalytics();

function showFatal(error: unknown): void {
  console.error(error);
  if (!host) return;
  const button = h('button', { className: 'choice choice--sugestao', text: t('fim.recomecar'), attrs: { type: 'button' } });
  button.addEventListener('click', () => {
    store.clear();
    boot();
  }, { once: true });
  host.replaceChildren(h('div', { className: 'fatal', attrs: { role: 'alert' } }, [h('p', { text: t('erro.roteiro') }), button]));
}

function boot(): void {
  if (!host) return;
  try {
    const { engine, step, resumed } = startGame(() => new StoryEngine(storyJson), store);
    const restart = () => {
      store.clear();
      boot();
    };
    const phone: Phone = new Phone(host, (button) =>
      openAbout({ root: phone.root, story: phone.screen, onRestart: restart, returnFocus: button }),
    );
    const renderer = new Renderer(phone, engine, {
      onCheckpoint: (checkpoint) => store.save(checkpoint),
      onRestart: restart,
      onError: showFatal,
      analytics,
      resumed,
    });
    void renderer.present(step);
  } catch (error) {
    showFatal(error);
  }
}

boot();
