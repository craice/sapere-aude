# Sapere Aude — Plano 1: Fundação + Configuração + Capítulo 1

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar uma versão jogável no celular — Configuração (cap. 0) + Manhã (cap. 1) — com a base técnica completa (Ink → engine → interface diegética), testes e deploy automático no GitHub Pages.

**Architecture:** O roteiro é escrito em Ink (`story/pt-BR/*.ink`) e compilado no build por um plugin do Vite. Um `StoryEngine` (TypeScript) envolve o inkjs, converte as tags do Ink em metadados tipados (protocolo estrito) e devolve "passos" (linhas + escolhas). A interface (TS puro, sem framework) só renderiza esses passos dentro de uma moldura de celular; todo estado de jogo vive no Ink.

**Tech Stack:** Node 24, Ink/inkjs 2.4, Vite 8, TypeScript 7, Vitest 5, Playwright 1.63, GitHub Actions + GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-03-aufklaerung-design.md`

**Planos seguintes (fora deste):**
- Plano 2 — tradução própria de Kant, cartões de citação (`# kant:`), tela "Sobre", botão "Recomeçar" durante o jogo.
- Plano 3 — capítulos 2–4, minijogo classificador, retrato final, epílogo, analítica (GoatCounter).

## Global Constraints

- Versões: `inkjs@^2.4.0`, `vite@^8.3.2`, `typescript@^7.0.2`, `vitest@^5.0.3`, `@playwright/test@^1.63.0`, `@types/node` (atual). Node 24.
- Única dependência de runtime: `inkjs`. **Nenhum framework de UI.**
- **O Ink é a única fonte de verdade.** A interface não guarda estado de jogo; só estado de apresentação.
- Todo texto visível em **português brasileiro com acentuação correta**. Texto narrativo só em `story/pt-BR/`; textos de interface só em `src/i18n/pt-BR.json`. Nenhuma string visível hard-coded em `.ts`.
- **Tags do Ink sempre no fim da linha a que se referem.** Nunca uma tag sozinha numa linha. Tags de escolha sempre **dentro** dos colchetes: `* [Texto #sugestao]`.
- O caractere `|` não pode aparecer dentro de tags (o Ink rejeita).
- Vite com `base: './'` (funciona em qualquer nome de repositório no Pages).
- Nada falha por tempo. Atrasos de animação viram zero com `prefers-reduced-motion: reduce`.
- Licenças: MIT (código) + CC BY-SA 4.0 (conteúdo em `story/`, `content/`, arte).
- Mensagens de commit em português, com prefixo convencional (`feat:`, `test:`, `docs:`, `chore:`, `ci:`) e terminando com:
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01YKbePV1qGbsHQoTo21Hi9w
  ```

## Notas de desvio da spec (decididas durante o planejamento)

1. **Momentos não usam tag `# moment:`.** São registrados por uma função Ink, `~ registrar("id", "tipo")`, que acumula a variável `momentos`. Motivo: a tag duplicaria a fonte de verdade e não sobreviveria ao salvamento; a variável Ink sobrevive.
2. **Notificações:** o texto da linha é o conteúdo e a tag diz só o remetente: `Bom dia! # notify: amparo`. (A forma `# notify: Amparo | texto` é inválida no Ink.)
3. **Salvamento por checkpoint de capítulo:** ao retomar, o jogo volta ao início do capítulo com as variáveis preservadas (o histórico de chat do capítulo é refeito).

## Review Focus

1. **Armazenamento indisponível ou corrompido** (aba anônima, `localStorage` bloqueado, JSON quebrado, save de versão antiga do roteiro) → o jogo começa do zero, sem travar. Testes: Task 5 (unitário) e Task 8 (e2e com save corrompido).
2. **Toque duplo / clique rápido numa escolha** → só uma escolha é registrada; nenhuma mensagem duplicada. Testes: Task 4 (índice inválido não avança) e Task 8 (e2e com `dblclick`).
3. **Recarregar a página no meio do jogo** → retoma no início do último capítulo alcançado, com `conforto` preservado. Testes: Task 4 (unitário) e Task 8 (e2e com `reload`).
4. **Jogar só com teclado** → a sugestão do Amparo já vem focada (Enter aceita); "Continuar" dos cartões de capítulo vem focado. Teste: Task 8 (e2e).
5. **Tela estreita (320 px)** → sem rolagem horizontal. Teste: Task 8 (e2e).

---

## Mapa de arquivos

```
package.json, tsconfig.json, vite.config.ts, playwright.config.ts, index.html
.gitignore, LICENSE, LICENSE-CONTENT, README.md
tools/ink/compileInk.ts        compila story/<locale>/main.ink → JSON (+ erros, avisos, arquivos)
tools/ink/lintInk.ts           pega erros que o compilador do Ink não pega (tag sozinha, tag fora dos colchetes)
tools/ink/vitePluginInk.ts     módulo virtual `virtual:story/<locale>`
src/env.d.ts                   tipos do módulo virtual
src/tags/protocol.ts           vocabulário do protocolo (apps, personagens, tipos de escolha) + TagError
src/tags/parseTags.ts          tags → LineMeta / ChoiceMeta (estrito)
src/engine/StoryEngine.ts      wrapper do inkjs: start/choose/resume, checkpoint, momentos, variáveis
src/save/saveStore.ts          salvar/carregar checkpoint no localStorage, à prova de falhas
src/save/startGame.ts          decide entre retomar e começar do zero
src/i18n/pt-BR.json            textos de interface
src/i18n/index.ts              t(), characterName()
src/ui/dom.ts                  h(), wait(), prefersReducedMotion()
src/ui/comfort.ts              conforto (número) → chave de texto
src/ui/choices.ts              botões de escolha com trava de toque duplo + foco na sugestão
src/ui/shell/Phone.ts          moldura, barra de status (hora + widget de conforto), banner de notificação
src/ui/shell/ChapterCard.ts    cartão de título de capítulo
src/ui/apps/AppView.ts         interface comum dos apps
src/ui/apps/SetupApp.ts        tela de configuração do Amparo
src/ui/apps/ChatApp.ts         conversa
src/ui/apps/ReaderApp.ts       leitor de matéria com fichas
src/ui/apps/FimApp.ts          tela final da demo
src/ui/apps/createApp.ts       fábrica exaustiva por AppId
src/ui/Renderer.ts             orquestra passos → apps
src/ui/styles.css              visual
src/main.ts                    bootstrap
story/pt-BR/main.ink           variáveis, funções, INCLUDEs
story/pt-BR/cap0_configuracao.ink
story/pt-BR/cap1_manha.ink
story/pt-BR/fim_demo.ink
docs/tag-protocol.md           contrato roteiro ↔ interface
tests/helpers/compileSource.ts
tests/fixtures/ink/ok/main.ink, tests/fixtures/ink/ok/parte.ink, tests/fixtures/ink/erro/main.ink
tests/**/*.test.ts             unitários e robô de jogatina
e2e/jogar.spec.ts              ponta a ponta
.github/workflows/deploy.yml   CI + deploy
```

---

### Task 1: Fundação do projeto

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.ts`, `.gitignore`, `LICENSE`, `LICENSE-CONTENT`, `README.md`, `tests/smoke.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: scripts `npm run dev | build | preview | test | typecheck | test:e2e`; `vite.config.ts` com `base: './'` e bloco `test` do Vitest (Tasks seguintes adicionam o plugin Ink aqui).

- [ ] **Step 1: Criar `package.json` e instalar dependências**

```json
{
  "name": "sapere-aude",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "license": "MIT",
  "description": "Sapere Aude — um jogo sobre o que Kant chamou de Esclarecimento.",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "typecheck": "tsc --noEmit"
  }
}
```

Run:
```bash
npm i inkjs@^2.4.0
npm i -D vite@^8.3.2 typescript@^7.0.2 vitest@^5.0.3 @playwright/test@^1.63.0 @types/node
```
Expected: `found 0 vulnerabilities` (ou avisos não críticos); `package.json` ganha `dependencies` e `devDependencies`.

- [ ] **Step 2: Criar `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "noUncheckedIndexedAccess": true,
    "types": ["node", "vite/client"]
  },
  "include": ["src", "tools", "tests", "e2e", "vite.config.ts", "playwright.config.ts"]
}
```

- [ ] **Step 3: Criar `vite.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Criar `index.html` e `src/main.ts` mínimos**

`index.html`:
```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="description" content="Sapere Aude — um jogo sobre o que Kant chamou de Esclarecimento." />
    <meta name="theme-color" content="#14161c" />
    <title>Sapere Aude</title>
  </head>
  <body>
    <main id="app" aria-label="Sapere Aude"></main>
    <noscript>Este jogo precisa de JavaScript.</noscript>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

`src/main.ts` (provisório; substituído na Task 8):
```ts
const host = document.getElementById('app');
if (host) host.dataset.pronto = 'sim';
```

- [ ] **Step 5: Escrever o teste de fumaça**

`tests/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import pkg from '../package.json';

describe('projeto', () => {
  it('declara inkjs como única dependência de runtime', () => {
    expect(Object.keys(pkg.dependencies)).toEqual(['inkjs']);
  });
});
```

- [ ] **Step 6: Rodar teste, typecheck e build**

Run: `npm test && npm run build`
Expected: `1 passed`; `tsc` sem erros; `vite build` gera `dist/index.html`.

- [ ] **Step 7: Licenças, README e `.gitignore`**

`.gitignore`:
```
node_modules/
dist/
test-results/
playwright-report/
```

`LICENSE` (MIT):
```
MIT License

Copyright (c) 2026 Rafael e colaboradores do Sapere Aude

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

`LICENSE-CONTENT`: baixar o texto legal oficial e prefixar um cabeçalho:
```bash
{
  printf 'O conteúdo deste repositório — roteiro (story/), textos (content/) e arte —\n'
  printf 'é licenciado sob Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0).\n'
  printf 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br\n\n'
  curl -fsSL https://creativecommons.org/licenses/by-sa/4.0/legalcode.txt
} > LICENSE-CONTENT
head -5 LICENSE-CONTENT && wc -l LICENSE-CONTENT
```
Expected: cabeçalho visível e mais de 300 linhas.

`README.md`:
```markdown
# Sapere Aude

*Um jogo sobre o que Kant chamou de Esclarecimento.*

Jogo sério, gratuito e de código aberto, baseado em *Resposta à pergunta: O que é Esclarecimento?* (Immanuel Kant, 1784). O jogo inteiro acontece na tela de um celular, onde vive o **Amparo** — um assistente simpático que decide quase tudo por você.

## Rodar localmente

```bash
npm install
npm run dev
```

## Escrever o roteiro

O roteiro fica em `story/pt-BR/` e é escrito em [Ink](https://www.inklestudios.com/ink/). Você pode abrir os arquivos `.ink` no editor gratuito [Inky](https://github.com/inkle/inky) para testar a lógica, ou usar `npm run dev` para ver o resultado no celular simulado. O contrato entre roteiro e interface está em [`docs/tag-protocol.md`](docs/tag-protocol.md).

## Testes

```bash
npm test          # unitários + robô de jogatina
npm run test:e2e  # ponta a ponta (Playwright)
```

## Licenças

- **Código:** MIT — ver [`LICENSE`](LICENSE).
- **Conteúdo** (roteiro em `story/`, textos em `content/`, arte): CC BY-SA 4.0 — ver [`LICENSE-CONTENT`](LICENSE-CONTENT).
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: fundação do projeto (Vite, TypeScript, Vitest, licenças)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YKbePV1qGbsHQoTo21Hi9w"
```

---

### Task 2: Compilação do Ink no build

**Files:**
- Create: `tools/ink/compileInk.ts`, `tools/ink/lintInk.ts`, `tools/ink/vitePluginInk.ts`, `src/env.d.ts`
- Create: `tests/fixtures/ink/ok/main.ink`, `tests/fixtures/ink/ok/parte.ink`, `tests/fixtures/ink/erro/main.ink`
- Create: `tests/tools/compileInk.test.ts`, `tests/tools/lintInk.test.ts`
- Modify: `vite.config.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `compileInk(storyDir: string): CompileResult` com `interface CompileResult { json: string; errors: string[]; warnings: string[]; files: string[] }` — `json` é `''` se houver erros.
  - `lintInk(source: string, fileName: string): string[]` — mensagens de erro (vazio = ok).
  - `inkPlugin(storyRoot: string): Plugin` — expõe `virtual:story/<locale>` cujo `default` é a string JSON compilada.

- [ ] **Step 1: Criar fixtures**

`tests/fixtures/ink/ok/main.ink`:
```ink
INCLUDE parte.ink
-> parte
```

`tests/fixtures/ink/ok/parte.ink`:
```ink
=== parte ===
Olá do arquivo incluído. # from: bia
-> END
```

`tests/fixtures/ink/erro/main.ink`:
```ink
-> lugar_que_nao_existe
```

- [ ] **Step 2: Escrever testes que falham**

`tests/tools/compileInk.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { Story } from 'inkjs';
import { compileInk } from '../../tools/ink/compileInk';

const fixture = (name: string) => fileURLToPath(new URL(`../fixtures/ink/${name}`, import.meta.url));

describe('compileInk', () => {
  it('compila main.ink com INCLUDE e gera JSON executável', () => {
    const result = compileInk(fixture('ok'));
    expect(result.errors).toEqual([]);
    const story = new Story(result.json);
    expect(story.Continue()).toBe('Olá do arquivo incluído.\n');
    expect(story.currentTags).toEqual(['from: bia']);
  });

  it('lista todos os .ink da pasta para o watcher', () => {
    const result = compileInk(fixture('ok'));
    expect(result.files.map((f) => f.split(/[\\/]/).pop()).sort()).toEqual(['main.ink', 'parte.ink']);
  });

  it('reporta erros de compilação sem lançar exceção', () => {
    const result = compileInk(fixture('erro'));
    expect(result.json).toBe('');
    expect(result.errors.join('\n')).toContain('lugar_que_nao_existe');
  });
});
```

`tests/tools/lintInk.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { lintInk } from '../../tools/ink/lintInk';

describe('lintInk', () => {
  it('aceita tags no fim da linha e dentro dos colchetes', () => {
    const src = 'Oi # from: bia\n* [Aceitar #sugestao]\n  Ok. # from: eu\n';
    expect(lintInk(src, 'a.ink')).toEqual([]);
  });

  it('rejeita tag sozinha na linha (o Ink a gruda na linha seguinte)', () => {
    const errors = lintInk('Oi\n  # app: chat\nTchau\n', 'a.ink');
    expect(errors).toEqual(['a.ink:2: tag sozinha na linha — mova-a para o fim da linha a que se refere']);
  });

  it('rejeita tag de escolha fora dos colchetes', () => {
    const errors = lintInk('* [Aceitar] #sugestao\n+ [Outra]   # ficha\n', 'b.ink');
    expect(errors).toEqual([
      'b.ink:1: tag de escolha fora dos colchetes — use * [Texto #tag]',
      'b.ink:2: tag de escolha fora dos colchetes — use * [Texto #tag]',
    ]);
  });

  it('ignora comentários', () => {
    expect(lintInk('// # isto é um comentário\nOi\n', 'c.ink')).toEqual([]);
  });
});
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `npx vitest run tests/tools`
Expected: FAIL — `Cannot find module '../../tools/ink/compileInk'` e `.../lintInk`.

- [ ] **Step 4: Implementar `lintInk.ts`**

```ts
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
```

- [ ] **Step 5: Implementar `compileInk.ts`**

```ts
import fs from 'node:fs';
import path from 'node:path';
import { Compiler, CompilerOptions } from 'inkjs/full';
import { PosixFileHandler } from 'inkjs/compiler/FileHandler/PosixFileHandler';
import { lintInk } from './lintInk';

export interface CompileResult {
  json: string;
  errors: string[];
  warnings: string[];
  files: string[];
}

const ERROR_TYPE_ERROR = 2;

export function compileInk(storyDir: string): CompileResult {
  const files = fs
    .readdirSync(storyDir)
    .filter((f) => f.endsWith('.ink'))
    .map((f) => path.join(storyDir, f));

  const errors: string[] = [];
  const warnings: string[] = [];

  for (const file of files) {
    errors.push(...lintInk(fs.readFileSync(file, 'utf8'), path.basename(file)));
  }

  const source = fs.readFileSync(path.join(storyDir, 'main.ink'), 'utf8').replace(/^﻿/, '');
  const options = new CompilerOptions(
    null,
    [],
    false,
    (message: string, type: number) => (type === ERROR_TYPE_ERROR ? errors : warnings).push(message),
    new PosixFileHandler(storyDir + path.sep),
  );

  let json = '';
  try {
    const compiled = new Compiler(source, options).Compile();
    json = compiled.ToJson() ?? '';
  } catch (error) {
    if (errors.length === 0) errors.push(String(error));
  }

  return { json: errors.length > 0 ? '' : json, errors, warnings, files };
}
```

- [ ] **Step 6: Rodar e ver passar**

Run: `npx vitest run tests/tools`
Expected: PASS (7 testes).

- [ ] **Step 7: Plugin do Vite e tipos do módulo virtual**

`tools/ink/vitePluginInk.ts`:
```ts
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
```

`src/env.d.ts`:
```ts
declare module 'virtual:story/*' {
  const storyJson: string;
  export default storyJson;
}
```

`vite.config.ts` (substituir inteiro):
```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { inkPlugin } from './tools/ink/vitePluginInk';

export default defineConfig({
  base: './',
  plugins: [inkPlugin(fileURLToPath(new URL('./story', import.meta.url)))],
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
```

- [ ] **Step 8: Typecheck e testes**

Run: `npm run typecheck && npm test`
Expected: sem erros de tipo; todos os testes passam.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: compilação do roteiro Ink no build com lint de tags

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YKbePV1qGbsHQoTo21Hi9w"
```

---

### Task 3: Protocolo de tags

**Files:**
- Create: `src/tags/protocol.ts`, `src/tags/parseTags.ts`, `docs/tag-protocol.md`
- Test: `tests/tags/parseTags.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces (`src/tags/protocol.ts`):
  ```ts
  export const APPS = ['setup', 'chat', 'leitor', 'fim'] as const;
  export type AppId = (typeof APPS)[number];
  export const CHARACTERS = ['amparo', 'bia', 'eu', 'folha'] as const;
  export type CharacterId = (typeof CHARACTERS)[number];
  export const CHOICE_KINDS = ['sugestao', 'pensar', 'ficha', 'compor'] as const;
  export type ChoiceKind = (typeof CHOICE_KINDS)[number] | 'resposta';
  export interface LineMeta { app?: AppId; time?: string; from?: CharacterId; notify?: CharacterId; chapter?: string; title?: true }
  export interface ChoiceMeta { kind: ChoiceKind }
  export class TagError extends Error {}
  ```
- Produces (`src/tags/parseTags.ts`): `parseLineTags(tags: readonly string[]): LineMeta`, `parseChoiceTags(tags: readonly string[]): ChoiceMeta` — lançam `TagError` para qualquer coisa fora do protocolo.

- [ ] **Step 1: Escrever testes que falham**

`tests/tags/parseTags.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { parseLineTags, parseChoiceTags } from '../../src/tags/parseTags';
import { TagError } from '../../src/tags/protocol';

describe('parseLineTags', () => {
  it('linha sem tags → meta vazia', () => {
    expect(parseLineTags([])).toEqual({});
  });

  it('lê app, time, from, chapter e title', () => {
    expect(parseLineTags(['chapter: cap1', 'app: chat', 'time: 07:42'])).toEqual({ chapter: 'cap1', app: 'chat', time: '07:42' });
    expect(parseLineTags(['from: bia'])).toEqual({ from: 'bia' });
    expect(parseLineTags(['title'])).toEqual({ title: true });
    expect(parseLineTags(['notify: amparo'])).toEqual({ notify: 'amparo' });
  });

  it('tolera espaços extras', () => {
    expect(parseLineTags(['  from :   bia  '])).toEqual({ from: 'bia' });
  });

  it.each([
    [['cor: azul'], 'tag desconhecida'],
    [['app: twitter'], 'app inválido'],
    [['from: carlos'], 'personagem inválido'],
    [['notify: carlos'], 'personagem inválido'],
    [['time: 7h'], 'hora inválida'],
    [['chapter: Capítulo 1'], 'capítulo inválido'],
    [['from: bia', 'from: eu'], 'tag repetida'],
    [['from: bia', 'notify: amparo'], 'from e notify'],
    [['title: sim'], 'title não leva valor'],
    [['from'], 'from precisa de valor'],
  ])('rejeita %j (%s)', (tags) => {
    expect(() => parseLineTags(tags)).toThrow(TagError);
  });
});

describe('parseChoiceTags', () => {
  it('sem tag → resposta comum', () => {
    expect(parseChoiceTags([])).toEqual({ kind: 'resposta' });
  });

  it.each(['sugestao', 'pensar', 'ficha', 'compor'])('aceita %s', (kind) => {
    expect(parseChoiceTags([kind])).toEqual({ kind });
  });

  it('rejeita tipo desconhecido ou mais de uma tag', () => {
    expect(() => parseChoiceTags(['talvez'])).toThrow(TagError);
    expect(() => parseChoiceTags(['sugestao', 'pensar'])).toThrow(TagError);
    expect(() => parseChoiceTags(['from: bia'])).toThrow(TagError);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/tags`
Expected: FAIL — módulos inexistentes.

- [ ] **Step 3: Implementar `protocol.ts`**

```ts
/** Vocabulário do protocolo de tags. Documentação: docs/tag-protocol.md */

export const APPS = ['setup', 'chat', 'leitor', 'fim'] as const;
export type AppId = (typeof APPS)[number];

export const CHARACTERS = ['amparo', 'bia', 'eu', 'folha'] as const;
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
}

export interface ChoiceMeta {
  kind: ChoiceKind;
}

export class TagError extends Error {
  override name = 'TagError';
}
```

- [ ] **Step 4: Implementar `parseTags.ts`**

```ts
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
```

- [ ] **Step 5: Rodar e ver passar**

Run: `npx vitest run tests/tags`
Expected: PASS.

- [ ] **Step 6: Escrever `docs/tag-protocol.md`**

````markdown
# Protocolo de tags — roteiro ↔ interface

O roteiro (Ink) controla a interface do celular por meio de **tags**. Este é o contrato entre os dois. Qualquer tag fora desta lista **quebra o build e os testes** — de propósito.

## Duas regras de ouro

1. **A tag vai no fim da linha a que se refere.** Uma tag sozinha numa linha é grudada pelo Ink na linha seguinte, em silêncio. O lint bloqueia isso.
   ```ink
   Oi! # from: bia          ✅
   # from: bia              ❌ (tag sozinha)
   ```
2. **Em escolhas, a tag vai dentro dos colchetes.** Fora deles, ela vai para o texto *depois* da escolha.
   ```ink
   * [Enviar #sugestao]     ✅
   * [Enviar] #sugestao     ❌
   ```

O caractere `|` não pode aparecer dentro de tags.

## Tags de linha

| Tag | Valor | Efeito |
|---|---|---|
| `# app: X` | `setup`, `chat`, `leitor`, `fim` | Troca o app em tela. **Vale desta linha em diante.** |
| `# time: HH:MM` | ex.: `07:42` | Muda o relógio. **Vale desta linha em diante.** |
| `# from: X` | `amparo`, `bia`, `eu`, `folha` | No chat/configuração: autor da mensagem. No leitor: nome do veículo (cabeçalho). |
| `# notify: X` | idem | A linha aparece como notificação de X. |
| `# chapter: X` | nome do knot (ex.: `cap1`) | Mostra o cartão de capítulo com o texto da linha e cria um ponto de salvamento. **Deve ser a primeira linha do knot.** |
| `# title` | — | No leitor: a linha é a manchete. |

Uma linha pode ter várias tags: `Manhã # chapter: cap1 # app: chat # time: 07:42`.
Uma linha não pode ter `from` e `notify` juntos, nem a mesma tag duas vezes.
Uma linha que sai vazia (ex.: condicional falsa) **não pode** ter tags — use um bloco condicional multilinha.

## Tags de escolha

| Tag | Aparência |
|---|---|
| *(nenhuma)* | Resposta comum. |
| `#sugestao` | Sugestão do Amparo: botão grande, destacado e **já focado** (Enter aceita). |
| `#pensar` | Caminho de pensar por conta própria: botão secundário. |
| `#ficha` | No leitor: trecho tocável da matéria; ao tocar, vira ficha coletada. |
| `#compor` | Montar a própria resposta com as fichas coletadas. |

## Estado do jogo (variáveis Ink)

| Variável | Uso |
|---|---|
| `conforto` (0–100) | Widget do Amparo na barra de status. Altere com `~ ajustar_conforto(delta)`. |
| `momentos` | Registro das decisões. **Nunca altere diretamente**: use `~ registrar("id_unico", "tipo")`. |

Tipos de momento: `pensou`, `delegou_comodidade`, `recuou_medo`, `rompeu_sem_pensar`, `delegou_com_razao`. Cada `id` deve ser registrado **uma única vez** por partida.
````

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: protocolo de tags estrito entre roteiro e interface

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YKbePV1qGbsHQoTo21Hi9w"
```

---

### Task 4: StoryEngine

**Files:**
- Create: `src/engine/StoryEngine.ts`, `tests/helpers/compileSource.ts`
- Test: `tests/engine/StoryEngine.test.ts`

**Interfaces:**
- Consumes: `parseLineTags`, `parseChoiceTags`, `LineMeta`, `ChoiceKind`, `AppId`, `TagError` (Task 3).
- Produces (`src/engine/StoryEngine.ts`):
  ```ts
  export interface StoryLine { text: string; meta: LineMeta; app: AppId; time: string }
  export interface StoryChoice { index: number; text: string; kind: ChoiceKind }
  export interface StoryStep { lines: StoryLine[]; choices: StoryChoice[]; ended: boolean }
  export interface Checkpoint { chapter: string; state: string; app: AppId; time: string }
  export const MOMENT_TYPES: readonly ['pensou','delegou_comodidade','recuou_medo','rompeu_sem_pensar','delegou_com_razao'];
  export type MomentType = (typeof MOMENT_TYPES)[number];
  export interface Moment { id: string; type: MomentType }
  export class StoryEngine {
    constructor(storyJson: string);
    start(): StoryStep;
    choose(index: number): StoryStep;          // RangeError se índice inválido; não avança
    resume(checkpoint: Checkpoint): StoryStep; // volta ao início do capítulo, variáveis preservadas
    get checkpoint(): Checkpoint | null;       // último capítulo alcançado
    get currentApp(): AppId;
    getNumber(name: string): number;           // Error se não existir ou não for número
    getMoments(): Moment[];                    // Error se tipo inválido
  }
  ```
- Produces (`tests/helpers/compileSource.ts`): `compileSource(source: string): string`.

- [ ] **Step 1: Helper de teste**

`tests/helpers/compileSource.ts`:
```ts
import { Compiler } from 'inkjs/full';

/** Compila um roteiro Ink inline (só para testes). */
export function compileSource(source: string): string {
  const json = new Compiler(source).Compile().ToJson();
  if (!json) throw new Error('Compilação não gerou JSON');
  return json;
}
```

- [ ] **Step 2: Escrever testes que falham**

`tests/engine/StoryEngine.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { StoryEngine } from '../../src/engine/StoryEngine';
import { TagError } from '../../src/tags/protocol';
import { compileSource } from '../helpers/compileSource';

const HEADER = `VAR conforto = 70
VAR momentos = ""
`;
const FUNCOES = `
=== function registrar(id, tipo) ===
~ momentos = "{momentos}{id}:{tipo};"
`;

const UM_CAPITULO = compileSource(`${HEADER}-> cap1
=== cap1 ===
Manhã # chapter: cap1 # app: chat # time: 07:42
Oi! # from: bia
* [Aceitar #sugestao]
  ~ conforto = conforto + 10
  ~ registrar("cap1_bia", "delegou_comodidade")
  Ok. # from: eu
* [Ler #pensar]
  ~ registrar("cap1_bia", "pensou")
  Matéria # app: leitor # title # time: 07:50
- Fim. # app: fim
-> END
${FUNCOES}`);

const DOIS_CAPITULOS = compileSource(`${HEADER}-> cap0
=== cap0 ===
Configuração # chapter: cap0 # app: setup # time: 07:30
* [Sim #sugestao]
  ~ conforto = 90
- -> cap1
=== cap1 ===
Manhã # chapter: cap1 # app: chat # time: 07:42
* [Ok]
- Fim. # app: fim
-> END
${FUNCOES}`);

describe('StoryEngine', () => {
  it('start: devolve linhas com app e hora "grudentos" e escolhas tipadas', () => {
    const step = new StoryEngine(UM_CAPITULO).start();
    expect(step.lines).toEqual([
      { text: 'Manhã', meta: { chapter: 'cap1', app: 'chat', time: '07:42' }, app: 'chat', time: '07:42' },
      { text: 'Oi!', meta: { from: 'bia' }, app: 'chat', time: '07:42' },
    ]);
    expect(step.choices).toEqual([
      { index: 0, text: 'Aceitar', kind: 'sugestao' },
      { index: 1, text: 'Ler', kind: 'pensar' },
    ]);
    expect(step.ended).toBe(false);
  });

  it('choose: avança, aplica variáveis e registra momento', () => {
    const engine = new StoryEngine(UM_CAPITULO);
    engine.start();
    const step = engine.choose(0);
    expect(step.lines.map((l) => [l.text, l.app])).toEqual([['Ok.', 'chat'], ['Fim.', 'fim']]);
    expect(step.ended).toBe(true);
    expect(engine.getNumber('conforto')).toBe(80);
    expect(engine.getMoments()).toEqual([{ id: 'cap1_bia', type: 'delegou_comodidade' }]);
    expect(engine.currentApp).toBe('fim');
  });

  it('choose: troca de app e hora no meio do caminho', () => {
    const engine = new StoryEngine(UM_CAPITULO);
    engine.start();
    const step = engine.choose(1);
    expect(step.lines[0]).toEqual({ text: 'Matéria', meta: { app: 'leitor', title: true, time: '07:50' }, app: 'leitor', time: '07:50' });
    expect(engine.getMoments()).toEqual([{ id: 'cap1_bia', type: 'pensou' }]);
  });

  it('choose: índice inválido lança RangeError e não avança', () => {
    const engine = new StoryEngine(UM_CAPITULO);
    engine.start();
    expect(() => engine.choose(2)).toThrow(RangeError);
    expect(() => engine.choose(-1)).toThrow(RangeError);
    expect(() => engine.choose(0.5)).toThrow(RangeError);
    expect(engine.choose(0).lines[0]?.text).toBe('Ok.');
  });

  it('checkpoint + resume: volta ao início do capítulo com variáveis preservadas', () => {
    const engine = new StoryEngine(DOIS_CAPITULOS);
    engine.start();
    expect(engine.checkpoint).toMatchObject({ chapter: 'cap0', app: 'setup', time: '07:30' });
    engine.choose(0);
    const cp = engine.checkpoint!;
    expect(cp).toMatchObject({ chapter: 'cap1', app: 'chat', time: '07:42' });

    const restored = new StoryEngine(DOIS_CAPITULOS);
    const step = restored.resume(JSON.parse(JSON.stringify(cp)));
    expect(step.lines[0]).toMatchObject({ text: 'Manhã', meta: { chapter: 'cap1' } });
    expect(step.choices.map((c) => c.text)).toEqual(['Ok']);
    expect(restored.getNumber('conforto')).toBe(90);
    expect(restored.currentApp).toBe('chat');
  });

  it('linha vazia com tag (condicional falsa) é erro de roteiro', () => {
    const json = compileSource(`VAR f = false\n{f: oi} # from: bia\n-> END\n`);
    expect(() => new StoryEngine(json).start()).toThrow(TagError);
  });

  it('getMoments rejeita tipo desconhecido', () => {
    const json = compileSource(`${HEADER}~ registrar("x", "inventado")\nOi\n-> END\n${FUNCOES}`);
    const engine = new StoryEngine(json);
    engine.start();
    expect(() => engine.getMoments()).toThrow(/inventado/);
  });

  it('getNumber falha para variável inexistente', () => {
    const engine = new StoryEngine(UM_CAPITULO);
    expect(() => engine.getNumber('nao_existe')).toThrow(/nao_existe/);
  });
});
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `npx vitest run tests/engine`
Expected: FAIL — `Cannot find module '../../src/engine/StoryEngine'`.

- [ ] **Step 4: Implementar `StoryEngine.ts`**

```ts
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
```

- [ ] **Step 5: Rodar e ver passar**

Run: `npx vitest run tests/engine && npm run typecheck`
Expected: PASS (8 testes); typecheck limpo.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: StoryEngine com checkpoints, momentos e escolhas tipadas

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YKbePV1qGbsHQoTo21Hi9w"
```

---

### Task 5: Salvamento à prova de falhas

**Files:**
- Create: `src/save/saveStore.ts`, `src/save/startGame.ts`
- Test: `tests/save/saveStore.test.ts`, `tests/save/startGame.test.ts`

**Interfaces:**
- Consumes: `StoryEngine`, `Checkpoint`, `StoryStep` (Task 4); `compileSource` (Task 4).
- Produces:
  ```ts
  // saveStore.ts
  export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  export interface SaveStore { load(): Checkpoint | null; save(cp: Checkpoint): void; clear(): void }
  export const SAVE_KEY = 'sapere-aude:save:v1';
  export function createSaveStore(storage: StorageLike | null): SaveStore;
  export function browserStorage(): StorageLike | null;
  // startGame.ts
  export function startGame(createEngine: () => StoryEngine, store: SaveStore): { engine: StoryEngine; step: StoryStep; resumed: boolean };
  ```

- [ ] **Step 1: Escrever testes que falham**

`tests/save/saveStore.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { createSaveStore, SAVE_KEY, type StorageLike } from '../../src/save/saveStore';
import type { Checkpoint } from '../../src/engine/StoryEngine';

const CP: Checkpoint = { chapter: 'cap1', state: '{"x":1}', app: 'chat', time: '07:42' };

function memoryStorage(initial: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k]! : null),
    setItem: (k, v) => void (data[k] = v),
    removeItem: (k) => void delete data[k],
  };
}

const throwing: StorageLike = {
  getItem: () => { throw new Error('SecurityError'); },
  setItem: () => { throw new Error('QuotaExceededError'); },
  removeItem: () => { throw new Error('SecurityError'); },
};

describe('saveStore', () => {
  it('salva e carrega um checkpoint', () => {
    const store = createSaveStore(memoryStorage());
    store.save(CP);
    expect(store.load()).toEqual(CP);
  });

  it('sem save → null', () => {
    expect(createSaveStore(memoryStorage()).load()).toBeNull();
  });

  it.each([
    ['JSON quebrado', '{lixo'],
    ['versão desconhecida', JSON.stringify({ v: 99, checkpoint: CP })],
    ['checkpoint incompleto', JSON.stringify({ v: 1, checkpoint: { chapter: 'cap1' } })],
    ['app inválido', JSON.stringify({ v: 1, checkpoint: { ...CP, app: 'twitter' } })],
    ['null', 'null'],
  ])('save corrompido (%s) → null', (_, raw) => {
    expect(createSaveStore(memoryStorage({ [SAVE_KEY]: raw })).load()).toBeNull();
  });

  it('storage que lança exceções nunca derruba o jogo', () => {
    const store = createSaveStore(throwing);
    expect(() => store.save(CP)).not.toThrow();
    expect(store.load()).toBeNull();
    expect(() => store.clear()).not.toThrow();
  });

  it('storage ausente (null) funciona como "sem save"', () => {
    const store = createSaveStore(null);
    store.save(CP);
    expect(store.load()).toBeNull();
  });

  it('clear apaga o save', () => {
    const storage = memoryStorage();
    const store = createSaveStore(storage);
    store.save(CP);
    store.clear();
    expect(storage.data[SAVE_KEY]).toBeUndefined();
  });
});
```

`tests/save/startGame.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { StoryEngine } from '../../src/engine/StoryEngine';
import { startGame } from '../../src/save/startGame';
import type { SaveStore } from '../../src/save/saveStore';
import type { Checkpoint } from '../../src/engine/StoryEngine';
import { compileSource } from '../helpers/compileSource';

const JSON_STORY = compileSource(`VAR conforto = 70
VAR momentos = ""
-> cap0
=== cap0 ===
Configuração # chapter: cap0 # app: setup
* [Sim]
- -> cap1
=== cap1 ===
Manhã # chapter: cap1 # app: chat
* [Ok]
- -> END
`);

function fakeStore(initial: Checkpoint | null): SaveStore & { cleared: boolean } {
  return {
    cleared: false,
    load: () => initial,
    save: () => {},
    clear() { this.cleared = true; },
  };
}

describe('startGame', () => {
  it('sem save → começa do início', () => {
    const { step, resumed } = startGame(() => new StoryEngine(JSON_STORY), fakeStore(null));
    expect(resumed).toBe(false);
    expect(step.lines[0]?.text).toBe('Configuração');
  });

  it('com save válido → retoma no capítulo salvo', () => {
    const first = new StoryEngine(JSON_STORY);
    first.start();
    first.choose(0);
    const { step, resumed } = startGame(() => new StoryEngine(JSON_STORY), fakeStore(first.checkpoint));
    expect(resumed).toBe(true);
    expect(step.lines[0]?.text).toBe('Manhã');
  });

  it('save incompatível com o roteiro atual → apaga e começa do zero', () => {
    const store = fakeStore({ chapter: 'capitulo_removido', state: '{"quebrado":true}', app: 'chat', time: '07:00' });
    const { step, resumed } = startGame(() => new StoryEngine(JSON_STORY), store);
    expect(resumed).toBe(false);
    expect(store.cleared).toBe(true);
    expect(step.lines[0]?.text).toBe('Configuração');
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/save`
Expected: FAIL — módulos inexistentes.

- [ ] **Step 3: Implementar `saveStore.ts`**

```ts
import type { Checkpoint } from '../engine/StoryEngine';
import { APPS } from '../tags/protocol';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface SaveStore {
  load(): Checkpoint | null;
  save(checkpoint: Checkpoint): void;
  clear(): void;
}

export const SAVE_KEY = 'sapere-aude:save:v1';

function isCheckpoint(value: unknown): value is Checkpoint {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.chapter === 'string' &&
    typeof v.state === 'string' &&
    typeof v.time === 'string' &&
    typeof v.app === 'string' &&
    (APPS as readonly string[]).includes(v.app)
  );
}

/** Salvamento que nunca lança exceção: sem armazenamento, o jogo só não retoma. */
export function createSaveStore(storage: StorageLike | null): SaveStore {
  return {
    load() {
      try {
        const raw = storage?.getItem(SAVE_KEY);
        if (!raw) return null;
        const data: unknown = JSON.parse(raw);
        if (typeof data !== 'object' || data === null) return null;
        const { v, checkpoint } = data as { v?: unknown; checkpoint?: unknown };
        return v === 1 && isCheckpoint(checkpoint) ? checkpoint : null;
      } catch {
        return null;
      }
    },
    save(checkpoint) {
      try {
        storage?.setItem(SAVE_KEY, JSON.stringify({ v: 1, checkpoint }));
      } catch {
        // Sem espaço ou bloqueado: segue sem salvar.
      }
    },
    clear() {
      try {
        storage?.removeItem(SAVE_KEY);
      } catch {
        // Idem.
      }
    },
  };
}

export function browserStorage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Implementar `startGame.ts`**

```ts
import type { StoryEngine, StoryStep } from '../engine/StoryEngine';
import type { SaveStore } from './saveStore';

/**
 * Retoma do último checkpoint se possível. Se o save não for compatível com o roteiro
 * atual (ex.: após uma atualização), apaga-o e começa do zero com uma engine nova.
 */
export function startGame(createEngine: () => StoryEngine, store: SaveStore): { engine: StoryEngine; step: StoryStep; resumed: boolean } {
  const checkpoint = store.load();
  if (checkpoint) {
    const engine = createEngine();
    try {
      return { engine, step: engine.resume(checkpoint), resumed: true };
    } catch {
      store.clear();
    }
  }
  const engine = createEngine();
  return { engine, step: engine.start(), resumed: false };
}
```

- [ ] **Step 5: Rodar e ver passar**

Run: `npx vitest run tests/save && npm run typecheck`
Expected: PASS; typecheck limpo.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: salvamento por capítulo resistente a armazenamento ausente ou corrompido

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YKbePV1qGbsHQoTo21Hi9w"
```

---

### Task 6: Textos de interface (i18n) e widget de conforto

**Files:**
- Create: `src/i18n/pt-BR.json`, `src/i18n/index.ts`, `src/ui/comfort.ts`
- Test: `tests/i18n/i18n.test.ts`, `tests/ui/comfort.test.ts`

**Interfaces:**
- Consumes: `CHARACTERS`, `CharacterId` (Task 3).
- Produces:
  ```ts
  // i18n/index.ts
  export type MessageKey = keyof typeof messages;
  export function t(key: MessageKey, vars?: Record<string, string | number>): string;
  export function characterName(id: CharacterId): string;
  // ui/comfort.ts
  export type ComfortKey = 'conforto.tranquilo' | 'conforto.ok' | 'conforto.agitado';
  export function comfortKey(value: number): ComfortKey;  // ≥70 tranquilo; 40–69 ok; <40 agitado
  ```

- [ ] **Step 1: Criar `src/i18n/pt-BR.json`**

```json
{
  "personagem.amparo": "Amparo",
  "personagem.bia": "Bia",
  "personagem.eu": "Você",
  "personagem.folha": "Folha do Bairro",
  "conforto.tranquilo": "Seu dia está 😊 tranquilo",
  "conforto.ok": "Seu dia está 🙂 ok",
  "conforto.agitado": "Seu dia está 😬 agitado",
  "digitando": "{nome} está digitando…",
  "chat.titulo": "Mensagens",
  "escolhas.rotulo": "Suas opções",
  "capitulo.continuar": "Continuar",
  "leitor.dica": "Toque nos trechos que parecerem importantes para guardá-los como fichas.",
  "leitor.fichas": "Fichas guardadas: {n}",
  "fim.recomecar": "Recomeçar",
  "erro.roteiro": "Algo deu errado no roteiro. Desculpe!"
}
```

- [ ] **Step 2: Escrever testes que falham**

`tests/i18n/i18n.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { t, characterName } from '../../src/i18n';
import { CHARACTERS } from '../../src/tags/protocol';

describe('i18n', () => {
  it('traduz chaves simples', () => {
    expect(t('capitulo.continuar')).toBe('Continuar');
  });

  it('interpola variáveis', () => {
    expect(t('digitando', { nome: 'Bia' })).toBe('Bia está digitando…');
    expect(t('leitor.fichas', { n: 2 })).toBe('Fichas guardadas: 2');
  });

  it('mantém o marcador se a variável faltar', () => {
    expect(t('digitando')).toBe('{nome} está digitando…');
  });

  it('todo personagem do protocolo tem nome', () => {
    for (const id of CHARACTERS) expect(characterName(id)).not.toBe('');
  });
});
```

`tests/ui/comfort.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { comfortKey } from '../../src/ui/comfort';

describe('comfortKey', () => {
  it.each([
    [100, 'conforto.tranquilo'],
    [70, 'conforto.tranquilo'],
    [69, 'conforto.ok'],
    [40, 'conforto.ok'],
    [39, 'conforto.agitado'],
    [0, 'conforto.agitado'],
  ])('%i → %s', (value, key) => {
    expect(comfortKey(value)).toBe(key);
  });
});
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `npx vitest run tests/i18n tests/ui`
Expected: FAIL — módulos inexistentes.

- [ ] **Step 4: Implementar `src/i18n/index.ts`**

```ts
import messages from './pt-BR.json';
import type { CharacterId } from '../tags/protocol';

export type MessageKey = keyof typeof messages;

export function t(key: MessageKey, vars: Record<string, string | number> = {}): string {
  return messages[key].replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

export function characterName(id: CharacterId): string {
  return t(`personagem.${id}`);
}
```

- [ ] **Step 5: Implementar `src/ui/comfort.ts`**

```ts
export type ComfortKey = 'conforto.tranquilo' | 'conforto.ok' | 'conforto.agitado';

/** Traduz a variável Ink `conforto` (0–100) no estado mostrado pelo widget do Amparo. */
export function comfortKey(value: number): ComfortKey {
  if (value >= 70) return 'conforto.tranquilo';
  if (value >= 40) return 'conforto.ok';
  return 'conforto.agitado';
}
```

- [ ] **Step 6: Rodar e ver passar**

Run: `npx vitest run tests/i18n tests/ui && npm run typecheck`
Expected: PASS; typecheck limpo (o template literal `personagem.${id}` só compila porque todas as chaves existem no JSON).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: textos de interface em arquivo separado e estados do widget de conforto

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YKbePV1qGbsHQoTo21Hi9w"
```

---

### Task 7: Roteiro — Configuração e Manhã + robô de jogatina

**Files:**
- Create: `story/pt-BR/main.ink`, `story/pt-BR/cap0_configuracao.ink`, `story/pt-BR/cap1_manha.ink`, `story/pt-BR/fim_demo.ink`
- Test: `tests/story/robo.test.ts`

**Interfaces:**
- Consumes: `compileInk` (Task 2), `StoryEngine`, `MOMENT_TYPES` (Task 4).
- Produces: roteiro compilável em `virtual:story/pt-BR`; knots `cap0`, `cap1`, `fim_demo`; variáveis `conforto`, `momentos`; funções `registrar(id, tipo)`, `ajustar_conforto(delta)`. O Plano 2 vai inserir o cartão de Kant no stitch `cap1.fim_cap1`.

- [ ] **Step 1: Escrever o robô de jogatina (falha: roteiro ainda não existe)**

`tests/story/robo.test.ts`:
```ts
import { describe, it, expect, beforeAll } from 'vitest';
import { fileURLToPath } from 'node:url';
import { compileInk } from '../../tools/ink/compileInk';
import { StoryEngine, type StoryChoice, type StoryStep } from '../../src/engine/StoryEngine';

const STORY_DIR = fileURLToPath(new URL('../../story/pt-BR', import.meta.url));
const PARTIDAS = 300;
const MAX_PASSOS = 200;

/** Gerador pseudoaleatório determinístico (mulberry32) — a semente aparece na falha. */
function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Estrategia = (choices: StoryChoice[]) => number;

function jogar(json: string, escolher: Estrategia) {
  const engine = new StoryEngine(json);
  const passos: StoryStep[] = [];
  const checkpoints = new Map<string, NonNullable<StoryEngine['checkpoint']>>();
  let step = engine.start();
  passos.push(step);
  for (let i = 0; !step.ended; i++) {
    if (i > MAX_PASSOS) throw new Error('Partida não terminou: possível laço infinito');
    if (engine.checkpoint) checkpoints.set(engine.checkpoint.chapter, engine.checkpoint);
    step = engine.choose(escolher(step.choices));
    passos.push(step);
  }
  if (engine.checkpoint) checkpoints.set(engine.checkpoint.chapter, engine.checkpoint);
  return { engine, passos, checkpoints, linhas: passos.flatMap((p) => p.lines) };
}

const preferir = (...kinds: StoryChoice['kind'][]): Estrategia => (choices) => {
  for (const kind of kinds) {
    const found = choices.find((c) => c.kind === kind);
    if (found) return found.index;
  }
  return choices[0]!.index;
};

describe('roteiro pt-BR', () => {
  let json = '';

  beforeAll(() => {
    const result = compileInk(STORY_DIR);
    expect(result.errors).toEqual([]);
    json = result.json;
  });

  it(`${PARTIDAS} partidas aleatórias terminam na tela final, sem erros de tag`, () => {
    const tiposVistos = new Set<string>();
    for (let seed = 1; seed <= PARTIDAS; seed++) {
      const r = rng(seed);
      try {
        const { engine, linhas } = jogar(json, (choices) => choices[Math.floor(r() * choices.length)]!.index);
        expect(linhas.at(-1)?.app).toBe('fim');
        expect(linhas.every((l) => l.text.length > 0)).toBe(true);

        const momentos = engine.getMoments();
        const ids = momentos.map((m) => m.id);
        expect(new Set(ids).size).toBe(ids.length);
        expect(ids).toContain('cap1_bia');
        momentos.forEach((m) => tiposVistos.add(m.type));

        const conforto = engine.getNumber('conforto');
        expect(conforto).toBeGreaterThanOrEqual(0);
        expect(conforto).toBeLessThanOrEqual(100);
      } catch (error) {
        throw new Error(`Falhou com semente ${seed}: ${String(error)}`);
      }
    }
    expect([...tiposVistos].sort()).toEqual(['delegou_comodidade', 'pensou']);
  });

  it('todo checkpoint de capítulo pode ser retomado', () => {
    const r = rng(42);
    const { checkpoints } = jogar(json, (choices) => choices[Math.floor(r() * choices.length)]!.index);
    expect([...checkpoints.keys()]).toEqual(['cap0', 'cap1']);
    for (const [chapter, cp] of checkpoints) {
      const step = new StoryEngine(json).resume(cp);
      expect(step.lines[0]?.meta.chapter).toBe(chapter);
    }
  });

  it('caminho "aceitar tudo": delega por comodidade e sobe o conforto', () => {
    const { engine, linhas } = jogar(json, preferir('sugestao'));
    expect(engine.getMoments()).toEqual([{ id: 'cap1_bia', type: 'delegou_comodidade' }]);
    expect(engine.getNumber('conforto')).toBe(80);
    expect(linhas.some((l) => l.meta.from === 'eu' && l.text.includes('A prefeitura sabe o que faz'))).toBe(true);
  });

  it('caminho "pensar": lê, coleta fichas, compõe a resposta com elas', () => {
    const { engine, linhas } = jogar(json, preferir('pensar', 'ficha', 'compor'));
    expect(engine.getMoments()).toEqual([{ id: 'cap1_bia', type: 'pensou' }]);
    expect(engine.getNumber('conforto')).toBe(60);
    const resposta = linhas.find((l) => l.meta.from === 'eu');
    expect(resposta?.text.startsWith('Li a matéria.')).toBe(true);
    expect(resposta?.text).toContain('R$ 18 mil');
  });

  it('pedir resumo no meio da leitura e voltar não registra momento duplicado', () => {
    let pediuResumo = false;
    const { engine } = jogar(json, (choices) => {
      const resumo = choices.find((c) => c.text.startsWith('Pedir ao Amparo'));
      if (resumo && !pediuResumo) { pediuResumo = true; return resumo.index; }
      const voltar = choices.find((c) => c.text.startsWith('Voltar à matéria'));
      if (voltar) return voltar.index;
      return preferir('pensar', 'ficha', 'compor')(choices);
    });
    expect(pediuResumo).toBe(true);
    expect(engine.getMoments()).toEqual([{ id: 'cap1_bia', type: 'pensou' }]);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/story`
Expected: FAIL — `ENOENT ... story/pt-BR`.

- [ ] **Step 3: Criar `story/pt-BR/main.ink`**

```ink
// Sapere Aude — roteiro (pt-BR)
// Licença: CC BY-SA 4.0 — ver LICENSE-CONTENT
// Contrato com a interface: docs/tag-protocol.md
// Regra de ouro: tags SEMPRE no fim da linha; em escolhas, DENTRO dos colchetes.

VAR conforto = 70
VAR momentos = ""

// Configuração
VAR resistiu_configuracao = false

// Capítulo 1 — fichas da matéria e posição final
VAR fichas = 0
VAR ficha_custo = false
VAR ficha_uso = false
VAR ficha_consulta = false
VAR ficha_orcamento = false
VAR posicao_cap1 = ""

INCLUDE cap0_configuracao.ink
INCLUDE cap1_manha.ink
INCLUDE fim_demo.ink

-> cap0

// Registra uma decisão para o retrato final. Cada id deve ser único na partida.
// Tipos: pensou, delegou_comodidade, recuou_medo, rompeu_sem_pensar, delegou_com_razao
=== function registrar(id, tipo) ===
~ momentos = "{momentos}{id}:{tipo};"

// Altera o conforto mantendo-o entre 0 e 100.
=== function ajustar_conforto(delta) ===
~ conforto = MAX(0, MIN(100, conforto + delta))
```

- [ ] **Step 4: Criar `story/pt-BR/cap0_configuracao.ink`**

```ink
// Capítulo 0 — Configuração
// Todos os caminhos levam ao "sim": o Amparo é configurado de qualquer jeito.

=== cap0 ===
Configuração # chapter: cap0 # app: setup # time: 07:30
Olá! Eu sou o Amparo. # from: amparo
Estou aqui para deixar a sua vida mais leve. # from: amparo
Posso decidir pequenas coisas por você? A roupa, o café, o caminho para o trabalho… # from: amparo
* [Sim, claro! #sugestao]
  Perfeito! Deixa comigo. 😊 # from: amparo
* [Pode ser…]
  Ótimo! Você vai ver como é bom. # from: amparo
* [Prefiro decidir eu mesmo]
  ~ resistiu_configuracao = true
  Claro! Então eu só cuido das coisas chatas. 😊 # from: amparo
  (O Amparo marcou “sim” mesmo assim.)
- E as notícias? Posso resumir tudo e já sugerir o que pensar de cada uma. Economiza um tempão. # from: amparo
* [Ótimo! #sugestao]
  Combinado! # from: amparo
* [Hm, tudo bem]
  Combinado! # from: amparo
* [Não precisa]
  ~ resistiu_configuracao = true
  Sem problema! Só vou deixar as sugestões à mão. Você sempre pode ignorar. # from: amparo
- Pronto, tudo configurado. # from: amparo
Pode deixar que eu penso nos detalhes. # from: amparo
-> cap1
```

- [ ] **Step 5: Criar `story/pt-BR/cap1_manha.ink`**

```ink
// Capítulo 1 — Manhã
// Ideia de Kant: menoridade autoimposta. Não falta entendimento, falta decisão. Sapere aude!
// Mecânica: aceitar a sugestão custa 1 toque; pensar exige ler, coletar fichas e montar a resposta.
// Importante: pensar por conta própria pode chegar a QUALQUER conclusão — inclusive concordar com o corte.

=== cap1 ===
Manhã # chapter: cap1 # app: chat # time: 07:42
Bom dia! Escolhi a camisa azul (vai esfriar) e já pedi o seu café de sempre. ☕ # notify: amparo
Biblioteca do bairro deixará de abrir à noite a partir do mês que vem # notify: folha
viu isso da biblioteca?? # from: bia # time: 07:51
eu estudo lá depois do trabalho 😩 # from: bia
o que vc acha? tô pensando em escrever no grupo do bairro # from: bia
Quer que eu responda por você? Sugestão: “Triste, mas deve ter um motivo. A prefeitura sabe o que faz.” # from: amparo
* [Enviar a sugestão do Amparo #sugestao]
  -> resposta_amparo
* [Ler a matéria antes de responder #pensar]
  -> leitura

= resposta_amparo
~ registrar("cap1_bia", "delegou_comodidade")
~ ajustar_conforto(10)
Triste, mas deve ter um motivo. A prefeitura sabe o que faz. # from: eu
hm… pode ser 🤷 # from: bia
sei lá, achei que vc fosse ter uma opinião mais sua kkk # from: bia
Resposta enviada em 2 segundos. Seu dia segue tranquilo. 😊 # notify: amparo
-> fim_cap1

= leitura
Folha do Bairro # app: leitor # from: folha # time: 07:53
Biblioteca do bairro deixará de abrir à noite # title
A Biblioteca Comunitária da praça vai encerrar o atendimento às 18h a partir do mês que vem. Hoje ela fica aberta até as 22h.
A Secretaria de Cultura afirma que a medida busca “racionalizar custos” e que o horário noturno custa cerca de R$ 18 mil por mês.
Segundo dados da própria secretaria, 40% dos empréstimos de livros acontecem depois das 18h, a maioria feita por estudantes e trabalhadores.
A decisão foi publicada em portaria na semana passada. Não houve consulta pública nem conversa com o conselho de usuários da biblioteca.
O valor economizado equivale a cerca de 0,3% do orçamento anual da Cultura.
-> fichas

= fichas
{ fichas == 1:
  A Bia está esperando… quer que eu resuma pra você? 🙂 # notify: amparo
}
* [O horário noturno custa cerca de R$ 18 mil por mês. #ficha]
  ~ ficha_custo = true
  ~ fichas++
  -> fichas
* [40% dos empréstimos acontecem depois das 18h. #ficha]
  ~ ficha_uso = true
  ~ fichas++
  -> fichas
* [Não houve consulta pública nem conversa com quem usa a biblioteca. #ficha]
  ~ ficha_consulta = true
  ~ fichas++
  -> fichas
* [A economia equivale a 0,3% do orçamento da Cultura. #ficha]
  ~ ficha_orcamento = true
  ~ fichas++
  -> fichas
+ {fichas >= 2} [Responder à Bia com as minhas fichas #compor]
  -> posicao
+ [Pedir ao Amparo um resumo #sugestao]
  -> resumo_amparo

= resumo_amparo
Resumo: a prefeitura vai economizar fechando a biblioteca mais cedo. Faz sentido cortar gastos. Quer que eu responda à Bia com isso? # from: amparo # app: chat # time: 07:55
* [Sim, pode enviar #sugestao]
  ~ registrar("cap1_bia", "delegou_comodidade")
  ~ ajustar_conforto(5)
  Triste, mas faz sentido cortar gastos. A prefeitura sabe o que faz. # from: eu
  hm… pode ser 🤷 # from: bia
  mas eu achei que tinha mais coisa nessa matéria # from: bia
  -> fim_cap1
+ [Voltar à matéria]
  Tudo bem! Estou aqui se precisar. 😊 # from: amparo
  Folha do Bairro # app: leitor # from: folha
  -> fichas

= posicao
Com o que você leu, qual é a sua posição? # app: leitor
* [O corte é um erro.]
  ~ posicao_cap1 = "erro"
* [Entendo a economia, mas faltou ouvir quem usa.]
  ~ posicao_cap1 = "ouvir"
* [O corte faz sentido.]
  ~ posicao_cap1 = "sentido"
- -> envio

= envio
~ registrar("cap1_bia", "pensou")
~ ajustar_conforto(-10)
Li a matéria.{ficha_custo: O horário da noite custa uns R$ 18 mil por mês.}{ficha_uso: 40% dos empréstimos são depois das 18h.}{ficha_consulta: E ninguém perguntou nada pra quem usa.}{ficha_orcamento: Isso é 0,3% do orçamento da Cultura.}{posicao_cap1 == "erro": Acho que cortar é um erro.}{posicao_cap1 == "ouvir": Entendo a economia, mas deviam ter ouvido a gente.}{posicao_cap1 == "sentido": No fim, acho que o corte faz sentido.} # from: eu # app: chat # time: 07:58
nossa, vc leu mesmo 😮 # from: bia
{posicao_cap1 == "sentido": não concordo, mas pelo menos agora dá pra discutir com números.|faz sentido. posso usar isso no grupo do bairro?} # from: bia
Você passou 5 minutos nisso. Seu dia está um pouco menos tranquilo. # notify: amparo
-> fim_cap1

= fim_cap1
// Plano 2: inserir aqui o cartão de Kant do capítulo 1.
-> fim_demo
```

> **Nota para o revisor do roteiro:** `Folha do Bairro # app: leitor # from: folha` aparece duas vezes (início da leitura e ao voltar do resumo). Isso é intencional: reabre o leitor com o cabeçalho; o artigo já lido permanece na tela porque o app é reaproveitado.

- [ ] **Step 6: Criar `story/pt-BR/fim_demo.ink`**

```ink
// Tela final provisória da versão de teste (substituída pelo epílogo no Plano 3).

=== fim_demo ===
Fim do capítulo 1 # app: fim
Esta é uma versão de teste com a configuração e o primeiro capítulo.
Os próximos capítulos estão em produção.
-> END
```

- [ ] **Step 7: Rodar o robô e ver passar**

Run: `npx vitest run tests/story`
Expected: PASS (5 testes). Se falhar com "Falhou com semente N", reproduza com essa semente e corrija o roteiro — **não** relaxe o teste.

> Atenção no "Voltar à matéria": essa linha `Folha do Bairro # app: leitor # from: folha` tem `from: folha`; no leitor, `from` define o cabeçalho (ver Task 8, `ReaderApp`).

- [ ] **Step 8: Rodar toda a suíte**

Run: `npm test && npm run typecheck`
Expected: tudo passa. (O build só passa a compilar o roteiro na Task 8, quando o `main.ts` real importa `virtual:story/pt-BR`; até lá, o robô de jogatina é quem compila e valida o roteiro.)

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(roteiro): configuração do Amparo e capítulo 1 (Manhã) + robô de jogatina

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YKbePV1qGbsHQoTo21Hi9w"
```

---

### Task 8: Interface do celular + testes ponta a ponta

**Files:**
- Create: `playwright.config.ts`, `e2e/jogar.spec.ts`
- Create: `src/ui/dom.ts`, `src/ui/choices.ts`, `src/ui/shell/Phone.ts`, `src/ui/shell/ChapterCard.ts`
- Create: `src/ui/apps/AppView.ts`, `src/ui/apps/SetupApp.ts`, `src/ui/apps/ChatApp.ts`, `src/ui/apps/ReaderApp.ts`, `src/ui/apps/FimApp.ts`, `src/ui/apps/createApp.ts`
- Create: `src/ui/Renderer.ts`, `src/ui/styles.css`
- Modify: `src/main.ts` (substituir inteiro)

**Interfaces:**
- Consumes: `StoryEngine`, `StoryStep`, `StoryLine`, `StoryChoice`, `Checkpoint` (Task 4); `createSaveStore`, `browserStorage`, `startGame` (Task 5); `t`, `characterName`, `comfortKey` (Task 6); `AppId`, `CharacterId` (Task 3); `virtual:story/pt-BR` (Task 2/7).
- Produces: o jogo jogável em `npm run dev` e `dist/`. Seletores estáveis para e2e: botões por nome acessível; classes `.choice--<kind>`, `.msg--<personagem>`, `.ficha`, `.card`, `.banner`.

- [ ] **Step 1: Instalar o navegador do Playwright**

Run: `npx playwright install --with-deps chromium`
Expected: Chromium baixado. **No WSL**, se pedir senha/sudo para dependências do sistema, peça ao usuário que rode no prompt: `! sudo npx playwright install-deps chromium` e depois repita este passo.

- [ ] **Step 2: Configurar Playwright**

`playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'celular',
      use: { ...devices['Pixel 7'], reducedMotion: 'reduce' },
    },
  ],
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

> `reducedMotion: 'reduce'` zera os atrasos de animação (ver `wait()`), deixando os testes rápidos e determinísticos.

- [ ] **Step 3: Escrever os testes ponta a ponta (falham: interface não existe)**

`e2e/jogar.spec.ts`:
```ts
import { test, expect, type Page } from '@playwright/test';

const SAVE_KEY = 'sapere-aude:save:v1';

async function continuar(page: Page, titulo: string) {
  await expect(page.getByRole('heading', { name: titulo })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar' }).click();
}

async function configurarAceitandoTudo(page: Page) {
  await continuar(page, 'Configuração');
  await page.getByRole('button', { name: 'Sim, claro!' }).click();
  await page.getByRole('button', { name: 'Ótimo!' }).click();
}

test('aceitar tudo: do início à tela final', async ({ page }) => {
  await page.goto('./');
  await configurarAceitandoTudo(page);
  await continuar(page, 'Manhã');
  await expect(page.locator('.msg--bia').first()).toBeVisible();
  await page.getByRole('button', { name: 'Enviar a sugestão do Amparo' }).click();
  await expect(page.locator('.msg--eu')).toContainText('A prefeitura sabe o que faz');
  await expect(page.getByRole('heading', { name: 'Fim do capítulo 1' })).toBeVisible();
  await expect(page.getByText('Seu dia está 😊 tranquilo')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Recomeçar' })).toBeVisible();
});

test('pensar: ler a matéria, coletar fichas e compor a resposta', async ({ page }) => {
  await page.goto('./');
  await configurarAceitandoTudo(page);
  await continuar(page, 'Manhã');
  await page.getByRole('button', { name: 'Ler a matéria antes de responder' }).click();
  await expect(page.getByRole('heading', { name: 'Biblioteca do bairro deixará de abrir à noite' })).toBeVisible();
  await page.getByRole('button', { name: /R\$ 18 mil/ }).click();
  await page.getByRole('button', { name: /40% dos empréstimos/ }).click();
  await expect(page.getByText('Fichas guardadas: 2')).toBeVisible();
  await page.getByRole('button', { name: 'Responder à Bia com as minhas fichas' }).click();
  await page.getByRole('button', { name: 'O corte é um erro.' }).click();
  await expect(page.locator('.msg--eu')).toContainText('Li a matéria.');
  await expect(page.locator('.msg--eu')).toContainText('Acho que cortar é um erro.');
  await expect(page.getByText('Seu dia está 🙂 ok')).toBeVisible();
});

test('recarregar retoma no último capítulo alcançado', async ({ page }) => {
  await page.goto('./');
  await configurarAceitandoTudo(page);
  await expect(page.getByRole('heading', { name: 'Manhã' })).toBeVisible();
  await page.reload();
  await continuar(page, 'Manhã');
  await expect(page.getByRole('button', { name: 'Enviar a sugestão do Amparo' })).toBeVisible();
});

test('save corrompido: começa do zero sem travar', async ({ page }) => {
  await page.addInitScript((key) => window.localStorage.setItem(key, '{lixo'), SAVE_KEY);
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Configuração' })).toBeVisible();
});

test('teclado: Continuar e a sugestão do Amparo já vêm focados', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Sim, claro!' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Ótimo!' })).toBeFocused();
});

test('toque duplo numa escolha envia uma única mensagem', async ({ page }) => {
  await page.goto('./');
  await configurarAceitandoTudo(page);
  await continuar(page, 'Manhã');
  await page.getByRole('button', { name: 'Enviar a sugestão do Amparo' }).dblclick();
  await expect(page.getByRole('heading', { name: 'Fim do capítulo 1' })).toBeVisible();
  await expect(page.locator('.msg--eu')).toHaveCount(1);
});

test('tela de 320 px não tem rolagem horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('./');
  await configurarAceitandoTudo(page);
  await continuar(page, 'Manhã');
  const larguraExtra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(larguraExtra).toBeLessThanOrEqual(0);
});
```

- [ ] **Step 4: Rodar e ver falhar**

Run: `npm run test:e2e`
Expected: FAIL — nenhum heading "Configuração" (o `main.ts` atual é provisório).

- [ ] **Step 5: Utilitários de DOM e escolhas**

`src/ui/dom.ts`:
```ts
type Child = Node | string;

interface Props {
  className?: string;
  text?: string;
  attrs?: Record<string, string>;
}

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, props: Props = {}, children: Child[] = []): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (props.className) el.className = props.className;
  if (props.text !== undefined) el.textContent = props.text;
  for (const [name, value] of Object.entries(props.attrs ?? {})) el.setAttribute(name, value);
  el.append(...children);
  return el;
}

export function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Pausa de apresentação. Vira zero com movimento reduzido. Nunca usada para falhar por tempo. */
export function wait(ms: number): Promise<void> {
  if (prefersReducedMotion()) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

`src/ui/choices.ts`:
```ts
import type { StoryChoice } from '../engine/StoryEngine';
import { h } from './dom';

export type PickHandler = (index: number) => void;

/**
 * Cria um botão por escolha. Só a primeira escolha da rodada vale:
 * depois dela todos os botões são desativados (protege contra toque duplo).
 */
export function createChoiceButtons(choices: StoryChoice[], onPick: PickHandler): HTMLButtonElement[] {
  let picked = false;
  const buttons = choices.map((choice) => {
    const button = h('button', { className: `choice choice--${choice.kind}`, text: choice.text, attrs: { type: 'button' } });
    button.addEventListener('click', () => {
      if (picked) return;
      picked = true;
      for (const b of buttons) b.disabled = true;
      onPick(choice.index);
    });
    return button;
  });
  return buttons;
}

/** A sugestão do Amparo vem pré-selecionada (Enter aceita). Sem sugestão, foca a primeira opção. */
export function focusPreferred(buttons: HTMLButtonElement[], choices: StoryChoice[]): void {
  const i = choices.findIndex((c) => c.kind === 'sugestao');
  (buttons[i >= 0 ? i : 0])?.focus();
}
```

- [ ] **Step 6: Moldura do celular e cartão de capítulo**

`src/ui/shell/Phone.ts`:
```ts
import { h, wait } from '../dom';
import { characterName, t } from '../../i18n';
import { comfortKey } from '../comfort';
import type { CharacterId } from '../../tags/protocol';

export class Phone {
  readonly screen: HTMLElement;
  private readonly clock: HTMLElement;
  private readonly comfort: HTMLElement;
  private readonly banner: HTMLElement;

  constructor(host: HTMLElement) {
    this.clock = h('span', { className: 'status__relogio' });
    this.comfort = h('span', { className: 'status__conforto' });
    this.banner = h('div', { className: 'banner', attrs: { role: 'status', 'aria-live': 'polite' } });
    this.screen = h('div', { className: 'phone__tela' });
    const status = h('header', { className: 'status' }, [this.clock, this.comfort]);
    host.replaceChildren(h('div', { className: 'phone' }, [status, this.banner, this.screen]));
  }

  setTime(time: string): void {
    this.clock.textContent = time;
  }

  setComfort(value: number): void {
    this.comfort.textContent = t(comfortKey(value));
  }

  /** Mostra a notificação no topo; ela fica até a próxima. */
  async notify(from: CharacterId, text: string): Promise<void> {
    this.banner.replaceChildren(h('strong', { className: 'banner__de', text: characterName(from) }), h('span', { text }));
    this.banner.classList.remove('banner--entrando');
    void this.banner.offsetWidth;
    this.banner.classList.add('banner--visivel', 'banner--entrando');
    await wait(1200);
  }
}
```

`src/ui/shell/ChapterCard.ts`:
```ts
import { h } from '../dom';
import { t } from '../../i18n';

/** Cartão de título de capítulo. Resolve quando o jogador toca em "Continuar". */
export function showChapterCard(screen: HTMLElement, title: string): Promise<void> {
  return new Promise((resolve) => {
    const button = h('button', { className: 'card__continuar', text: t('capitulo.continuar'), attrs: { type: 'button' } });
    const card = h('div', { className: 'card', attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'card-titulo' } }, [
      h('h1', { className: 'card__titulo', text: title, attrs: { id: 'card-titulo' } }),
      button,
    ]);
    button.addEventListener('click', () => {
      card.remove();
      resolve();
    }, { once: true });
    screen.append(card);
    button.focus();
  });
}
```

- [ ] **Step 7: Apps**

`src/ui/apps/AppView.ts`:
```ts
import type { StoryChoice, StoryLine } from '../../engine/StoryEngine';
import type { AppId } from '../../tags/protocol';

export interface AppView {
  readonly id: AppId;
  readonly el: HTMLElement;
  showLine(line: StoryLine): Promise<void>;
  showChoices(choices: StoryChoice[], onPick: (index: number) => void): void;
}
```

`src/ui/apps/SetupApp.ts`:
```ts
import type { StoryChoice, StoryLine } from '../../engine/StoryEngine';
import { characterName, t } from '../../i18n';
import { createChoiceButtons, focusPreferred } from '../choices';
import { h, wait } from '../dom';
import type { AppView } from './AppView';

/** Tela de configuração do Amparo: falas grandes e centralizadas. */
export class SetupApp implements AppView {
  readonly id = 'setup' as const;
  readonly el: HTMLElement;
  private readonly falas: HTMLElement;
  private readonly choices: HTMLElement;

  constructor() {
    this.falas = h('div', { className: 'setup__falas', attrs: { 'aria-live': 'polite' } });
    this.choices = h('div', { className: 'choices', attrs: { role: 'group', 'aria-label': t('escolhas.rotulo') } });
    this.el = h('section', { className: 'app app--setup' }, [
      h('div', { className: 'setup__logo', attrs: { 'aria-hidden': 'true' } }),
      h('p', { className: 'setup__nome', text: characterName('amparo') }),
      this.falas,
      this.choices,
    ]);
  }

  async showLine(line: StoryLine): Promise<void> {
    this.choices.replaceChildren();
    await wait(450);
    const className = line.meta.from === 'amparo' ? 'setup__fala' : 'setup__nota';
    this.falas.append(h('p', { className, text: line.text }));
  }

  showChoices(choices: StoryChoice[], onPick: (index: number) => void): void {
    const buttons = createChoiceButtons(choices, onPick);
    this.choices.replaceChildren(...buttons);
    focusPreferred(buttons, choices);
  }
}
```

`src/ui/apps/ChatApp.ts`:
```ts
import type { StoryChoice, StoryLine } from '../../engine/StoryEngine';
import { characterName, t } from '../../i18n';
import type { CharacterId } from '../../tags/protocol';
import { createChoiceButtons, focusPreferred } from '../choices';
import { h, wait } from '../dom';
import type { AppView } from './AppView';

export class ChatApp implements AppView {
  readonly id = 'chat' as const;
  readonly el: HTMLElement;
  private readonly title: HTMLElement;
  private readonly log: HTMLElement;
  private readonly choices: HTMLElement;

  constructor() {
    this.title = h('h2', { className: 'app__titulo', text: t('chat.titulo') });
    this.log = h('ol', { className: 'chat__log', attrs: { role: 'log', 'aria-live': 'polite' } });
    this.choices = h('div', { className: 'choices', attrs: { role: 'group', 'aria-label': t('escolhas.rotulo') } });
    this.el = h('section', { className: 'app app--chat' }, [this.title, this.log, this.choices]);
  }

  async showLine(line: StoryLine): Promise<void> {
    this.choices.replaceChildren();
    const from = line.meta.from;
    if (from && from !== 'eu') {
      if (from !== 'amparo') this.title.textContent = characterName(from);
      await this.typing(from, line.text);
    }
    const item = from
      ? h('li', { className: `msg msg--${from}` }, [
          h('span', { className: 'msg__autor', text: characterName(from) }),
          h('p', { className: 'msg__texto', text: line.text }),
        ])
      : h('li', { className: 'msg msg--narracao' }, [h('p', { className: 'msg__texto', text: line.text })]);
    this.log.append(item);
    item.scrollIntoView({ block: 'end' });
  }

  showChoices(choices: StoryChoice[], onPick: (index: number) => void): void {
    const buttons = createChoiceButtons(choices, onPick);
    this.choices.replaceChildren(...buttons);
    focusPreferred(buttons, choices);
  }

  private async typing(from: CharacterId, text: string): Promise<void> {
    const indicator = h('li', {
      className: 'msg msg--digitando',
      text: t('digitando', { nome: characterName(from) }),
      attrs: { 'aria-hidden': 'true' },
    });
    this.log.append(indicator);
    await wait(Math.min(1400, 400 + text.length * 15));
    indicator.remove();
  }
}
```

`src/ui/apps/ReaderApp.ts`:
```ts
import type { StoryChoice, StoryLine } from '../../engine/StoryEngine';
import { t } from '../../i18n';
import { createChoiceButtons, focusPreferred } from '../choices';
import { h } from '../dom';
import type { AppView } from './AppView';

/**
 * Leitor de matéria. Linhas com `from` viram o cabeçalho do veículo; `title` vira manchete;
 * o resto vira parágrafo. Escolhas `#ficha` aparecem como trechos tocáveis; ao tocar, a ficha é guardada.
 */
export class ReaderApp implements AppView {
  readonly id = 'leitor' as const;
  readonly el: HTMLElement;
  private readonly fonte: HTMLElement;
  private readonly artigo: HTMLElement;
  private readonly trechos: HTMLElement;
  private readonly listaTrechos: HTMLElement;
  private readonly contador: HTMLElement;
  private readonly choices: HTMLElement;
  private guardadas = 0;

  constructor() {
    this.fonte = h('p', { className: 'leitor__fonte' });
    this.artigo = h('article', { className: 'leitor__artigo' });
    this.listaTrechos = h('div', { className: 'leitor__lista' });
    this.trechos = h('section', { className: 'leitor__trechos', attrs: { hidden: '' } }, [
      h('p', { className: 'leitor__dica', text: t('leitor.dica') }),
      this.listaTrechos,
    ]);
    this.contador = h('p', { className: 'leitor__contador', attrs: { 'aria-live': 'polite', hidden: '' } });
    this.choices = h('div', { className: 'choices', attrs: { role: 'group', 'aria-label': t('escolhas.rotulo') } });
    this.el = h('section', { className: 'app app--leitor' }, [this.fonte, this.artigo, this.trechos, this.contador, this.choices]);
  }

  async showLine(line: StoryLine): Promise<void> {
    this.choices.replaceChildren();
    if (line.meta.from) {
      this.fonte.textContent = line.text;
    } else if (line.meta.title) {
      this.artigo.append(h('h1', { className: 'leitor__manchete', text: line.text }));
    } else {
      this.artigo.append(h('p', { text: line.text }));
    }
  }

  showChoices(choices: StoryChoice[], onPick: (index: number) => void): void {
    const buttons = createChoiceButtons(choices, (index) => {
      if (choices.find((c) => c.index === index)?.kind === 'ficha') this.guardar();
      onPick(index);
    });
    const fichas = buttons.filter((_, i) => choices[i]!.kind === 'ficha');
    fichas.forEach((b) => b.classList.add('ficha'));
    const acoes = buttons.filter((_, i) => choices[i]!.kind !== 'ficha');
    this.listaTrechos.replaceChildren(...fichas);
    this.trechos.hidden = fichas.length === 0;
    this.choices.replaceChildren(...acoes);
    focusPreferred(buttons, choices);
  }

  private guardar(): void {
    this.guardadas++;
    this.contador.hidden = false;
    this.contador.textContent = t('leitor.fichas', { n: this.guardadas });
  }
}
```

`src/ui/apps/FimApp.ts`:
```ts
import type { StoryChoice, StoryLine } from '../../engine/StoryEngine';
import { t } from '../../i18n';
import { createChoiceButtons, focusPreferred } from '../choices';
import { h } from '../dom';
import type { AppView } from './AppView';

export class FimApp implements AppView {
  readonly id = 'fim' as const;
  readonly el: HTMLElement;
  private readonly texto: HTMLElement;
  private readonly choices: HTMLElement;

  constructor() {
    this.texto = h('div', { className: 'fim__texto' });
    this.choices = h('div', { className: 'choices', attrs: { role: 'group', 'aria-label': t('escolhas.rotulo') } });
    this.el = h('section', { className: 'app app--fim' }, [this.texto, this.choices]);
  }

  async showLine(line: StoryLine): Promise<void> {
    const primeira = this.texto.childElementCount === 0;
    this.texto.append(primeira ? h('h1', { className: 'fim__titulo', text: line.text }) : h('p', { text: line.text }));
  }

  showChoices(choices: StoryChoice[], onPick: (index: number) => void): void {
    const buttons = createChoiceButtons(choices, onPick);
    this.choices.replaceChildren(...buttons);
    focusPreferred(buttons, choices);
  }

  showEnd(onRestart: () => void): void {
    const button = h('button', { className: 'choice choice--sugestao', text: t('fim.recomecar'), attrs: { type: 'button' } });
    button.addEventListener('click', onRestart, { once: true });
    this.choices.replaceChildren(button);
    button.focus();
  }
}
```

`src/ui/apps/createApp.ts`:
```ts
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
```

- [ ] **Step 8: Renderer**

`src/ui/Renderer.ts`:
```ts
import type { Checkpoint, StoryEngine, StoryStep } from '../engine/StoryEngine';
import type { AppId } from '../tags/protocol';
import type { AppView } from './apps/AppView';
import { createApp } from './apps/createApp';
import { FimApp } from './apps/FimApp';
import { showChapterCard } from './shell/ChapterCard';
import type { Phone } from './shell/Phone';

export interface RendererOptions {
  onCheckpoint(checkpoint: Checkpoint): void;
  onRestart(): void;
  onError(error: unknown): void;
}

/** Leva cada passo da história para a tela: cartões, notificações, linhas nos apps e escolhas. */
export class Renderer {
  private readonly apps = new Map<AppId, AppView>();
  private current: AppView | null = null;
  private savedCheckpoint: Checkpoint | null = null;

  constructor(
    private readonly phone: Phone,
    private readonly engine: StoryEngine,
    private readonly options: RendererOptions,
  ) {
    this.phone.setComfort(this.engine.getNumber('conforto'));
  }

  async present(step: StoryStep): Promise<void> {
    try {
      for (const line of step.lines) {
        this.phone.setTime(line.time);
        if (line.meta.chapter) {
          this.saveCheckpoint();
          await showChapterCard(this.phone.screen, line.text);
        } else if (line.meta.notify) {
          await this.phone.notify(line.meta.notify, line.text);
        } else {
          await this.show(line.app).showLine(line);
        }
      }
      this.phone.setComfort(this.engine.getNumber('conforto'));
      this.saveCheckpoint();

      if (step.ended) {
        const fim = this.show('fim');
        if (fim instanceof FimApp) fim.showEnd(this.options.onRestart);
        return;
      }
      this.show(this.engine.currentApp).showChoices(step.choices, (index) => {
        void this.advance(() => this.engine.choose(index));
      });
    } catch (error) {
      this.options.onError(error);
    }
  }

  private async advance(next: () => StoryStep): Promise<void> {
    let step: StoryStep;
    try {
      step = next();
    } catch (error) {
      this.options.onError(error);
      return;
    }
    await this.present(step);
  }

  private show(id: AppId): AppView {
    let app = this.apps.get(id);
    if (!app) {
      app = createApp(id);
      this.apps.set(id, app);
    }
    if (this.current !== app) {
      this.phone.screen.replaceChildren(app.el);
      this.current = app;
    }
    return app;
  }

  private saveCheckpoint(): void {
    const checkpoint = this.engine.checkpoint;
    if (checkpoint && checkpoint !== this.savedCheckpoint) {
      this.savedCheckpoint = checkpoint;
      this.options.onCheckpoint(checkpoint);
    }
  }
}
```

- [ ] **Step 9: Bootstrap (`src/main.ts`, substituir inteiro)**

```ts
import storyJson from 'virtual:story/pt-BR';
import { StoryEngine } from './engine/StoryEngine';
import { t } from './i18n';
import { browserStorage, createSaveStore } from './save/saveStore';
import { startGame } from './save/startGame';
import { h } from './ui/dom';
import { Renderer } from './ui/Renderer';
import { Phone } from './ui/shell/Phone';
import './ui/styles.css';

const host = document.getElementById('app');
const store = createSaveStore(browserStorage());

function showFatal(error: unknown): void {
  console.error(error);
  if (!host) return;
  const button = h('button', { className: 'choice choice--sugestao', text: t('fim.recomecar'), attrs: { type: 'button' } });
  button.addEventListener('click', () => {
    store.clear();
    boot();
  }, { once: true });
  host.replaceChildren(h('div', { className: 'fatal', attrs: { role: 'alert' } }, [h('p', { text: t('erro.roteiro') }), button]));
}

function boot(): void {
  if (!host) return;
  try {
    const { engine, step } = startGame(() => new StoryEngine(storyJson), store);
    const phone = new Phone(host);
    const renderer = new Renderer(phone, engine, {
      onCheckpoint: (checkpoint) => store.save(checkpoint),
      onRestart: () => {
        store.clear();
        boot();
      },
      onError: showFatal,
    });
    void renderer.present(step);
  } catch (error) {
    showFatal(error);
  }
}

boot();
```

- [ ] **Step 10: Estilos (`src/ui/styles.css`)**

```css
/* Sapere Aude — visual base (v1). Direção de arte a ser refinada pelo responsável de design. */

:root {
  --pagina: #14161c;
  --tela: #f6f5f2;
  --texto: #1c1d21;
  --texto-suave: #6b6e78;
  --linha: #e2e0da;
  --amparo: #5b4bdb;
  --amparo-claro: #ecebfd;
  --bia: #ffffff;
  --eu: #1f7a5c;
  --eu-texto: #ffffff;
  --ficha: #fff4c2;
  --ficha-borda: #e7c54a;
  --raio: 18px;
  --fonte: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --leitura: Georgia, 'Times New Roman', serif;
  color-scheme: light;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  height: 100%;
  background: var(--pagina);
  font-family: var(--fonte);
  color: var(--texto);
}

#app {
  min-height: 100dvh;
  display: grid;
  place-items: center;
}

.phone {
  position: relative;
  width: 100%;
  height: 100dvh;
  max-width: 430px;
  background: var(--tela);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (min-width: 520px) {
  .phone {
    height: min(860px, calc(100dvh - 48px));
    border-radius: 44px;
    border: 10px solid #000;
    box-shadow: 0 30px 80px rgb(0 0 0 / 45%);
  }
}

.status {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 20px 6px;
  font-size: 13px;
  font-weight: 600;
}

.status__conforto { color: var(--amparo); font-weight: 500; }

.banner {
  display: none;
  margin: 4px 12px;
  padding: 10px 14px;
  border-radius: 14px;
  background: rgb(255 255 255 / 92%);
  box-shadow: 0 4px 18px rgb(0 0 0 / 12%);
  font-size: 14px;
  line-height: 1.35;
}

.banner--visivel { display: block; }
.banner__de { display: block; font-size: 12px; color: var(--texto-suave); }

@media (prefers-reduced-motion: no-preference) {
  .banner--entrando { animation: banner-entra 260ms ease-out; }
  @keyframes banner-entra { from { transform: translateY(-12px); opacity: 0; } }
}

.phone__tela {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
}

.app {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 8px 16px 16px;
}

.app__titulo { margin: 4px 0 8px; font-size: 18px; text-align: center; }

/* Escolhas */
.choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
}

.choice {
  font: inherit;
  font-size: 15px;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid var(--linha);
  background: #fff;
  color: var(--texto);
  text-align: left;
  cursor: pointer;
}

.choice:disabled { opacity: 0.5; cursor: default; }
.choice:focus-visible, .card__continuar:focus-visible { outline: 3px solid var(--amparo); outline-offset: 2px; }

.choice--sugestao {
  background: var(--amparo);
  border-color: var(--amparo);
  color: #fff;
  font-weight: 600;
  padding: 16px;
  text-align: center;
}

.choice--pensar, .choice--compor { border-style: dashed; }

/* Configuração */
.app--setup { text-align: center; }
.setup__logo {
  width: 72px; height: 72px; margin: 24px auto 8px; border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #9d93ff, var(--amparo));
}
.setup__nome { margin: 0 0 16px; font-weight: 700; color: var(--amparo); }
.setup__falas p { margin: 0 0 12px; font-size: 18px; line-height: 1.4; }
.setup__nota { font-size: 14px !important; color: var(--texto-suave); font-style: italic; }

/* Chat */
.chat__log { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.msg { max-width: 82%; padding: 8px 12px; border-radius: var(--raio); line-height: 1.35; overflow-wrap: anywhere; }
.msg__texto { margin: 0; }
.msg__autor { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.msg--bia { align-self: flex-start; background: var(--bia); border: 1px solid var(--linha); }
.msg--eu { align-self: flex-end; background: var(--eu); color: var(--eu-texto); }
.msg--amparo { align-self: stretch; max-width: 100%; background: var(--amparo-claro); border: 1px solid #d4d0fb; }
.msg--amparo .msg__autor { position: static; width: auto; height: auto; clip-path: none; display: block; font-size: 12px; font-weight: 600; color: var(--amparo); }
.msg--narracao, .msg--digitando { align-self: center; font-size: 13px; color: var(--texto-suave); background: none; }

/* Leitor */
.app--leitor { background: #fff; }
.leitor__fonte { margin: 4px 0 12px; font-weight: 800; letter-spacing: 0.02em; text-transform: uppercase; font-size: 13px; }
.leitor__manchete { font-family: var(--leitura); font-size: 24px; line-height: 1.2; margin: 0 0 12px; }
.leitor__artigo p { font-family: var(--leitura); font-size: 16px; line-height: 1.55; margin: 0 0 12px; }
.leitor__trechos { border-top: 1px solid var(--linha); padding-top: 12px; }
.leitor__dica { font-size: 13px; color: var(--texto-suave); margin: 0 0 8px; }
.leitor__lista { display: flex; flex-direction: column; gap: 8px; }
.ficha { background: var(--ficha); border-color: var(--ficha-borda); font-family: var(--leitura); }
.leitor__contador { font-size: 13px; font-weight: 600; margin: 12px 0 0; }

/* Cartão de capítulo */
.card {
  position: absolute; inset: 0; z-index: 10;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 32px;
  background: var(--texto); color: var(--tela); padding: 24px;
}
.card__titulo { font-family: var(--leitura); font-weight: 400; font-size: 40px; margin: 0; text-align: center; }
.card__continuar {
  font: inherit; font-size: 16px; padding: 12px 28px; border-radius: 999px;
  border: 1px solid var(--tela); background: transparent; color: var(--tela); cursor: pointer;
}

/* Fim */
.app--fim { justify-content: center; text-align: center; }
.fim__titulo { font-family: var(--leitura); font-weight: 400; font-size: 30px; }
.fim__texto p { color: var(--texto-suave); line-height: 1.5; }

.fatal { color: var(--tela); text-align: center; padding: 24px; max-width: 360px; }
```

- [ ] **Step 11: Typecheck e testes ponta a ponta**

Run: `npm run typecheck && npm test && npm run test:e2e`
Expected: typecheck limpo; unitários passam; **7 testes e2e passam**.

- [ ] **Step 12: Conferência manual**

Run: `npm run dev` e abrir a URL exibida no celular (mesma rede; usar `npx vite --host`) ou no DevTools em modo celular. Jogar os dois caminhos uma vez com animações ligadas. Verificar: indicador "digitando…", banner de notificação, troca chat → leitor → chat, widget de conforto mudando.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: interface do celular (configuração, chat, leitor, cartões) + testes ponta a ponta

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YKbePV1qGbsHQoTo21Hi9w"
```

---

### Task 9: Publicação no GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: scripts `npm test`, `npm run test:e2e`, `npm run build` (Tasks 1–8).
- Produces: site público em `https://craice.github.io/sapere-aude/`, republicado a cada push na `main`.

- [ ] **Step 1: Criar o workflow**

`.github/workflows/deploy.yml`:
```yaml
name: Testar e publicar

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - run: npm run build
      - uses: actions/upload-pages-artifact@v4
        with:
          path: dist

  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

> Antes de commitar, confirme as versões mais recentes das actions (`actions/checkout`, `actions/setup-node`, `actions/upload-pages-artifact`, `actions/deploy-pages`) com `gh api repos/actions/<nome>/releases/latest -q .tag_name` e ajuste a versão principal se houver uma mais nova.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "ci: testes e publicação automática no GitHub Pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YKbePV1qGbsHQoTo21Hi9w"
```

- [ ] **Step 3: ⚠️ Confirmar com o usuário antes de publicar**

Esta etapa é **externa e pública**. Pergunte ao usuário e aguarde um "sim" explícito:
> "Vou criar o repositório **público** `craice/sapere-aude` no GitHub, ativar o GitHub Pages e enviar o código. O jogo ficará em `https://craice.github.io/sapere-aude/`. Posso seguir? (Se preferir outro nome de repositório, me diga.)"

Se o usuário escolher outro nome, substitua `sapere-aude` nos passos abaixo (o código não depende do nome: `base: './'`).

- [ ] **Step 4: Criar o repositório, ativar o Pages e enviar**

```bash
gh repo create sapere-aude --public --source . --remote origin \
  --description "Sapere Aude — um jogo sobre o que Kant chamou de Esclarecimento"
gh api -X POST repos/craice/sapere-aude/pages -f build_type=workflow
git push -u origin main
```
Expected: repositório criado; Pages ativado com origem "GitHub Actions"; push concluído.

- [ ] **Step 5: Acompanhar o workflow**

Run: `gh run watch --exit-status $(gh run list --limit 1 --json databaseId -q '.[0].databaseId')`
Expected: jobs `build` e `deploy` concluem com sucesso.

- [ ] **Step 6: Verificar o site publicado**

Run: `curl -fsSL https://craice.github.io/sapere-aude/ | grep -o '<title>.*</title>'`
Expected: `<title>Sapere Aude</title>`. Abrir a URL no celular e jogar até "Fim do capítulo 1".

- [ ] **Step 7: Registrar a URL no README e commitar**

Adicionar logo abaixo do subtítulo em `README.md`:
```markdown
**Jogue agora:** https://craice.github.io/sapere-aude/
```

```bash
git add README.md
git commit -m "docs: link do jogo publicado

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YKbePV1qGbsHQoTo21Hi9w"
git push
```

---

## Cobertura da spec neste plano

| Spec | Onde |
|---|---|
| 2.1 "o jogo é o tutor" / 4.1 pensar × aceitar | Task 7 (roteiro), Task 8 (sugestão destacada e focada, fichas) |
| 2.2 interface diegética, mobile-first | Task 8 |
| 3 cap. 0 e cap. 1, fio da biblioteca | Task 7 |
| 4.1 pressão suave sem falha por tempo | Task 7 (notificação do Amparo durante a leitura), Task 8 (`wait`, "digitando…") |
| 4.2 escalada do Amparo (cap. 1) | Task 7 |
| 4.3 widget de conforto visível; momentos ocultos | Tasks 4, 6, 7, 8 |
| 4.5 salvamento + recomeçar | Tasks 5, 8 (recomeçar na tela final; durante o jogo → Plano 2) |
| 4.6 acessibilidade | Task 8 (teclado, `aria-live`, movimento reduzido, sem arrastar) |
| 5.1–5.6 arquitetura, protocolo, testes | Tasks 2–8 |
| 5.4 i18n preparado | Tasks 6, 2 (`virtual:story/<locale>`) |
| 7 licenças | Task 1 |
| Publicação | Task 9 |
| 3 cap. 2–5, 4.4 retrato, 6 Kant/"Sobre", 8 analítica, 9 validação | Planos 2 e 3 |
