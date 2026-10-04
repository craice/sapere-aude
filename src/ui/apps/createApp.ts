import type { DescribedMoment } from '../../engine/StoryEngine';
import type { AppId } from '../../tags/protocol';
import type { AppView } from './AppView';
import { ChatApp } from './ChatApp';
import { FimApp } from './FimApp';
import { NarrativaApp } from './NarrativaApp';
import { ReaderApp } from './ReaderApp';
import { RetratoApp } from './RetratoApp';
import { SetupApp } from './SetupApp';
import { TextoApp } from './TextoApp';

export interface AppContext {
  moments(): DescribedMoment[];
}

export function createApp(id: AppId, context: AppContext): AppView {
  switch (id) {
    case 'setup':
      return new SetupApp();
    case 'chat':
      return new ChatApp();
    case 'leitor':
      return new ReaderApp();
    case 'narrativa':
      return new NarrativaApp();
    case 'retrato':
      return new RetratoApp(() => context.moments());
    case 'texto':
      return new TextoApp();
    case 'fim':
      return new FimApp();
  }
}
