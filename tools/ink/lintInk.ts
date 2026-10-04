/**
 * Regras que o compilador do Ink não verifica, mas que quebram o protocolo de tags em silêncio.
 * Ver docs/tag-protocol.md.
 */
export function lintInk(source: string, fileName: string): string[] {
  const errors: string[] = [];
  source.split(/\r?\n/).forEach((rawLine, i) => {
    const line = rawLine.replace(/\/\/.*$/, '');
    const n = i + 1;
    if (/^\s*#/.test(line)) {
      errors.push(`${fileName}:${n}: tag sozinha na linha — mova-a para o fim da linha a que se refere`);
    }
    if (/^\s*[*+].*\]\s*#/.test(line)) {
      errors.push(`${fileName}:${n}: tag de escolha fora dos colchetes — use * [Texto #tag]`);
    }
  });
  return errors;
}
