import type { AppId } from '../../tags/protocol';
import type { AppView } from './AppView';
import { ChatApp } from './ChatApp';
import { FimApp } from './FimApp';
import { ReaderApp } from './ReaderApp';
import { SetupApp } from './SetupApp';

export function createApp(id: AppId): AppView {
  switch (id) {
    case 'setup':
      return new SetupApp();
    case 'chat':
      return new ChatApp();
    case 'leitor':
      return new ReaderApp();
    case 'fim':
      return new FimApp();
  }
}
