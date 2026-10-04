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
