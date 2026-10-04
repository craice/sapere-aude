import { Compiler } from 'inkjs/full';

/** Compila um roteiro Ink inline (só para testes). */
export function compileSource(source: string): string {
  const json = new Compiler(source).Compile().ToJson();
  if (!json) throw new Error('Compilação não gerou JSON');
  return json;
}
