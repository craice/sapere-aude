import type { StoryChoice, StoryLine } from '../../engine/StoryEngine';
import type { AppId } from '../../tags/protocol';

export interface AppView {
  readonly id: AppId;
  readonly el: HTMLElement;
  showLine(line: StoryLine): Promise<void>;
  showChoices(choices: StoryChoice[], onPick: (index: number) => void): void;
  /** Pausa de leitura antes de uma troca de cena. */
  showContinue(): Promise<void>;
}
