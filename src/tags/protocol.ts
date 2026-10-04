/** Vocabulário do protocolo de tags. Documentação: docs/tag-protocol.md */

export const APPS = ['setup', 'chat', 'leitor', 'narrativa', 'retrato', 'texto', 'fim'] as const;
export type AppId = (typeof APPS)[number];

export const CHARACTERS = ['amparo', 'bia', 'eu', 'folha', 'vidafit', 'resumao', 'guru', 'celia', 'arnaldo', 'duda', 'liberta'] as const;
export type CharacterId = (typeof CHARACTERS)[number];

export const CHOICE_KINDS = ['sugestao', 'pensar', 'ficha', 'compor'] as const;
export type ChoiceKind = (typeof CHOICE_KINDS)[number] | 'resposta';

export interface LineMeta {
  /** Troca o app em tela; vale desta linha em diante. */
  app?: AppId;
  /** Hora no relógio (HH:MM); vale desta linha em diante. */
  time?: string;
  /** Autor de uma mensagem (chat, configuração) ou fonte (leitor). */
  from?: CharacterId;
  /** Linha exibida como notificação deste remetente. */
  notify?: CharacterId;
  /** Início de capítulo: nome do knot Ink. Mostra o cartão e cria checkpoint. */
  chapter?: string;
  /** Título (manchete) no leitor. */
  title?: true;
  /** Cartão de citação de Kant (chave em content/<locale>/kant/trechos.json). O texto da linha é o título do cartão. */
  kant?: string;
  /** Evento de analítica (ex.: leu_kant). */
  evento?: string;
}

export interface ChoiceMeta {
  kind: ChoiceKind;
}

export class TagError extends Error {
  override name = 'TagError';
}
