import { Story } from 'inkjs';
import { parseChoiceTags, parseLineTags } from '../tags/parseTags';
import { TagError, type AppId, type ChoiceKind, type LineMeta } from '../tags/protocol';

export interface StoryLine {
  text: string;
  meta: LineMeta;
  /** App em tela nesta linha (resolvido a partir do último `# app`). */
  app: AppId;
  /** Hora no relógio nesta linha (resolvida a partir do último `# time`). */
  time: string;
}

export interface StoryChoice {
  index: number;
  text: string;
  kind: ChoiceKind;
}

export interface StoryStep {
  lines: StoryLine[];
  choices: StoryChoice[];
  ended: boolean;
}

export interface Checkpoint {
  chapter: string;
  state: string;
  app: AppId;
  time: string;
}

export const MOMENT_TYPES = ['pensou', 'delegou_comodidade', 'recuou_medo', 'rompeu_sem_pensar', 'delegou_com_razao'] as const;
export type MomentType = (typeof MOMENT_TYPES)[number];

export interface Moment {
  id: string;
  type: MomentType;
}

export interface DescribedMoment extends Moment {
  /** Rótulo para o retrato, vindo da função Ink `rotulo_momento(id)`. */
  label: string;
}

const INITIAL_APP: AppId = 'setup';
const INITIAL_TIME = '07:00';

export class StoryEngine {
  private readonly story: Story;
  private app: AppId = INITIAL_APP;
  private time = INITIAL_TIME;
  private lastCheckpoint: Checkpoint | null = null;

  constructor(storyJson: string) {
    this.story = new Story(storyJson);
  }

  start(): StoryStep {
    return this.advance();
  }

  choose(index: number): StoryStep {
    const count = this.story.currentChoices.length;
    if (!Number.isInteger(index) || index < 0 || index >= count) {
      throw new RangeError(`Escolha inválida: ${index} (há ${count} opções)`);
    }
    this.story.ChooseChoiceIndex(index);
    return this.advance();
  }

  resume(checkpoint: Checkpoint): StoryStep {
    this.story.state.LoadJson(checkpoint.state);
    this.story.ChoosePathString(checkpoint.chapter);
    this.app = checkpoint.app;
    this.time = checkpoint.time;
    return this.advance();
  }

  get checkpoint(): Checkpoint | null {
    return this.lastCheckpoint;
  }

  get currentApp(): AppId {
    return this.app;
  }

  getNumber(name: string): number {
    const value: unknown = this.story.variablesState.$(name);
    if (typeof value !== 'number') throw new Error(`Variável Ink "${name}" não existe ou não é número`);
    return value;
  }

  getMoments(): Moment[] {
    const raw: unknown = this.story.variablesState.$('momentos');
    if (typeof raw !== 'string') throw new Error('Variável Ink "momentos" não existe');
    return raw
      .split(';')
      .filter(Boolean)
      .map((entry) => {
        const [id, type] = entry.split(':');
        if (!id || !type || !(MOMENT_TYPES as readonly string[]).includes(type)) {
          throw new Error(`Momento inválido: "${entry}". Tipos aceitos: ${MOMENT_TYPES.join(', ')}`);
        }
        return { id, type: type as MomentType };
      });
  }

  describeMoments(): DescribedMoment[] {
    return this.getMoments().map((moment) => {
      const label: unknown = this.story.EvaluateFunction('rotulo_momento', [moment.id]);
      if (typeof label !== 'string' || label.trim() === '') {
        throw new Error(`Momento "${moment.id}" sem rótulo em rotulo_momento()`);
      }
      return { ...moment, label: label.trim() };
    });
  }

  private advance(): StoryStep {
    const lines: StoryLine[] = [];

    while (this.story.canContinue) {
      const raw = this.story.Continue() ?? '';
      const tags = this.story.currentTags ?? [];
      const meta = parseLineTags(tags);
      const text = raw.trim();

      if (text === '') {
        if (tags.length > 0) {
          throw new TagError(`Linha vazia com tags (${tags.map((t) => `#${t}`).join(' ')}). Use um bloco condicional multilinha.`);
        }
        continue;
      }

      if (meta.app) this.app = meta.app;
      if (meta.time) this.time = meta.time;
      if (meta.chapter) {
        this.lastCheckpoint = { chapter: meta.chapter, state: this.story.state.toJson(), app: this.app, time: this.time };
      }

      lines.push({ text, meta, app: this.app, time: this.time });
    }

    const choices = this.story.currentChoices.map((choice) => ({
      index: choice.index,
      text: choice.text.trim(),
      kind: parseChoiceTags(choice.tags ?? []).kind,
    }));

    return { lines, choices, ended: choices.length === 0 };
  }
}
