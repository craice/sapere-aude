import storyJson from 'virtual:story/pt-BR';
import { StoryEngine } from './engine/StoryEngine';
import { t } from './i18n';
import { browserStorage, createSaveStore } from './save/saveStore';
import { startGame } from './save/startGame';
import { h } from './ui/dom';
import { Renderer } from './ui/Renderer';
import { Phone } from './ui/shell/Phone';
import './ui/styles.css';

const host = document.getElementById('app');
const store = createSaveStore(browserStorage());

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
    const { engine, step } = startGame(() => new StoryEngine(storyJson), store);
    const phone = new Phone(host);
    const renderer = new Renderer(phone, engine, {
      onCheckpoint: (checkpoint) => store.save(checkpoint),
      onRestart: () => {
        store.clear();
        boot();
      },
      onError: showFatal,
    });
    void renderer.present(step);
  } catch (error) {
    showFatal(error);
  }
}

boot();
