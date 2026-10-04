import path from 'node:path';
import type { Plugin } from 'vite';
import { compileInk } from './compileInk';

const PREFIX = 'virtual:story/';
const RESOLVED = '\0' + PREFIX;

/** `import story from 'virtual:story/pt-BR'` → JSON compilado de story/pt-BR/main.ink */
export function inkPlugin(storyRoot: string): Plugin {
  return {
    name: 'sapere-aude-ink',
    resolveId(id) {
      return id.startsWith(PREFIX) ? '\0' + id : undefined;
    },
    load(id) {
      if (!id.startsWith(RESOLVED)) return undefined;
      const locale = id.slice(RESOLVED.length);
      const result = compileInk(path.join(storyRoot, locale));
      for (const file of result.files) this.addWatchFile(file);
      for (const warning of result.warnings) this.warn(warning);
      if (result.errors.length > 0) {
        this.error(`Erros no roteiro (${locale}):\n${result.errors.join('\n')}`);
      }
      return `export default ${JSON.stringify(result.json)};`;
    },
  };
}
