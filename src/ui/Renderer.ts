import type { Analytics } from '../analytics';
import type { Checkpoint, StoryEngine, StoryStep } from '../engine/StoryEngine';
import type { AppId } from '../tags/protocol';
import type { AppView } from './apps/AppView';
import { createApp } from './apps/createApp';
import { FimApp } from './apps/FimApp';
import { showChapterCard } from './shell/ChapterCard';
import { showKantCard } from './shell/KantCard';
import type { Phone } from './shell/Phone';

export interface RendererOptions {
  onCheckpoint(checkpoint: Checkpoint): void;
  onRestart(): void;
  onError(error: unknown): void;
  analytics: Analytics;
}

/** Leva cada passo da história para a tela: cartões, notificações, linhas nos apps e escolhas. */
export class Renderer {
  private readonly apps = new Map<AppId, AppView>();
  private current: AppView | null = null;
  private savedCheckpoint: Checkpoint | null = null;
  /** Há falas na tela que o jogador ainda não teve chance de ler antes de uma troca de cena? */
  private unread = false;

  constructor(
    private readonly phone: Phone,
    private readonly engine: StoryEngine,
    private readonly options: RendererOptions,
  ) {
    this.phone.setComfort(this.engine.getNumber('conforto'));
  }

  async present(step: StoryStep): Promise<void> {
    try {
      this.phone.setComfort(this.engine.getNumber('conforto'));
      for (const line of step.lines) {
        if (line.meta.evento) this.options.analytics.track(line.meta.evento);
        if (line.meta.chapter) {
          this.saveCheckpoint();
          await this.pauseIfUnread();
          this.phone.setTime(line.time);
          await showChapterCard(this.phone.screen, line.text);
          this.startChapter(line.meta.chapter);
        } else if (line.meta.kant) {
          await this.pauseIfUnread();
          await showKantCard(this.phone.screen, line.text, line.meta.kant);
        } else if (line.meta.notify) {
          this.phone.setTime(line.time);
          await this.phone.notify(line.meta.notify, line.text);
        } else {
          const app = await this.switchTo(line.app);
          this.phone.setTime(line.time);
          await app.showLine(line);
          this.unread = true;
        }
      }
      this.saveCheckpoint();

      if (step.ended) {
        const fim = await this.switchTo('fim');
        if (fim instanceof FimApp) fim.showEnd(this.options.onRestart);
        return;
      }
      (await this.switchTo(this.engine.currentApp)).showChoices(step.choices, (index) => {
        this.unread = false;
        void this.advance(() => this.engine.choose(index));
      });
    } catch (error) {
      this.options.onError(error);
    }
  }

  /** Cada capítulo começa com telas novas (nenhuma matéria, conversa ou contagem herdada). */
  private startChapter(chapter: string): void {
    this.apps.clear();
    this.current = null;
    this.unread = false;
    this.phone.screen.replaceChildren();
    this.phone.clearNotification();
    this.options.analytics.track(chapter);
  }

  private async advance(next: () => StoryStep): Promise<void> {
    let step: StoryStep;
    try {
      step = next();
    } catch (error) {
      this.options.onError(error);
      return;
    }
    await this.present(step);
  }

  /** Troca de app; se houver falas não lidas no app atual, pede "Continuar" antes. */
  private async switchTo(id: AppId): Promise<AppView> {
    if (this.current && this.current.id !== id) await this.pauseIfUnread();
    return this.show(id);
  }

  private async pauseIfUnread(): Promise<void> {
    if (!this.unread || !this.current) return;
    this.unread = false;
    await this.current.showContinue();
  }

  private show(id: AppId): AppView {
    let app = this.apps.get(id);
    if (!app) {
      app = createApp(id, { moments: () => this.engine.describeMoments() });
      this.apps.set(id, app);
    }
    if (this.current !== app) {
      this.phone.screen.replaceChildren(app.el);
      this.current = app;
    }
    return app;
  }

  private saveCheckpoint(): void {
    const checkpoint = this.engine.checkpoint;
    if (checkpoint && checkpoint !== this.savedCheckpoint) {
      this.savedCheckpoint = checkpoint;
      this.options.onCheckpoint(checkpoint);
    }
  }
}
