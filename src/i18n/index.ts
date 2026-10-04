import messages from './pt-BR.json';
import type { CharacterId } from '../tags/protocol';

export type MessageKey = keyof typeof messages;

export function t(key: MessageKey, vars: Record<string, string | number> = {}): string {
  return messages[key].replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

export function characterName(id: CharacterId): string {
  return t(`personagem.${id}`);
}
