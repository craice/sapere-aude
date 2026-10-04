import { APPS, CHARACTERS, CHOICE_KINDS, TagError, type AppId, type CharacterId, type ChoiceMeta, type LineMeta } from './protocol';

function split(tag: string): [string, string | undefined] {
  const i = tag.indexOf(':');
  if (i === -1) return [tag.trim(), undefined];
  return [tag.slice(0, i).trim(), tag.slice(i + 1).trim()];
}

function oneOf<T extends string>(list: readonly T[], value: string | undefined, what: string, tag: string): T {
  if (value === undefined || !(list as readonly string[]).includes(value)) {
    throw new TagError(`${what} inválido em "# ${tag}". Valores aceitos: ${list.join(', ')}`);
  }
  return value as T;
}

export function parseLineTags(tags: readonly string[]): LineMeta {
  const meta: LineMeta = {};
  const seen = new Set<string>();

  for (const tag of tags) {
    const [key, value] = split(tag);
    if (seen.has(key)) throw new TagError(`Tag repetida na mesma linha: "# ${tag}"`);
    seen.add(key);

    switch (key) {
      case 'app':
        meta.app = oneOf<AppId>(APPS, value, 'App', tag);
        break;
      case 'from':
        meta.from = oneOf<CharacterId>(CHARACTERS, value, 'Personagem', tag);
        break;
      case 'notify':
        meta.notify = oneOf<CharacterId>(CHARACTERS, value, 'Personagem', tag);
        break;
      case 'time':
        if (!value || !/^\d{2}:\d{2}$/.test(value)) throw new TagError(`Hora inválida em "# ${tag}" (use HH:MM)`);
        meta.time = value;
        break;
      case 'chapter':
        if (!value || !/^[a-z0-9_]+$/.test(value)) throw new TagError(`Capítulo inválido em "# ${tag}" (use o nome do knot, ex.: cap1)`);
        meta.chapter = value;
        break;
      case 'title':
        if (value !== undefined) throw new TagError(`"# title" não leva valor`);
        meta.title = true;
        break;
      default:
        throw new TagError(`Tag desconhecida: "# ${tag}"`);
    }
  }

  if (meta.from && meta.notify) throw new TagError('Uma linha não pode ter "from" e "notify" ao mesmo tempo');
  return meta;
}

export function parseChoiceTags(tags: readonly string[]): ChoiceMeta {
  if (tags.length === 0) return { kind: 'resposta' };
  if (tags.length > 1) throw new TagError(`Escolha com mais de uma tag: ${tags.map((t) => `#${t}`).join(' ')}`);
  const tag = tags[0]!.trim();
  return { kind: oneOf(CHOICE_KINDS, tag, 'Tipo de escolha', tag) };
}
