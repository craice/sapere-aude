# Sapere Aude

*Um jogo sobre o que Kant chamou de Esclarecimento.*

**Jogue agora:** https://craice.github.io/sapere-aude/

Jogo sério, gratuito e de código aberto, baseado em *Resposta à pergunta: O que é Esclarecimento?* (Immanuel Kant, 1784). O jogo inteiro acontece na tela de um celular, onde vive o **Amparo** — um assistente simpático que decide quase tudo por você.

## O jogo

Um dia na vida de alguém comum, em cinco capítulos (10–15 minutos): **Configuração**, **Manhã** (menoridade autoimposta), **Tarde** (preguiça, covardia e tutores), **Trabalho** (uso público × uso privado da razão), **Três meses depois** (o esclarecimento como processo coletivo) e um **Epílogo** com o retrato das suas escolhas. Cada capítulo termina com um trecho de Kant, e o texto completo — numa tradução própria do original alemão, assistida por IA e pendente de revisão filosófica — está em [`content/pt-BR/kant/esclarecimento.md`](content/pt-BR/kant/esclarecimento.md).

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

## Analítica (opcional)

O jogo pode contar acessos de forma anônima com o [GoatCounter](https://www.goatcounter.com/) (sem cookies, sem dados pessoais). Vem **desligado**. Para ligar: crie um site no GoatCounter e defina a variável de repositório `GOATCOUNTER_URL` (ex.: `https://seu-codigo.goatcounter.com`) em *Settings → Secrets and variables → Actions → Variables*. Os eventos estão listados em [`docs/tag-protocol.md`](docs/tag-protocol.md).

## Licenças

- **Código:** MIT — ver [`LICENSE`](LICENSE).
- **Conteúdo** (roteiro em `story/`, textos em `content/`, arte): CC BY-SA 4.0 — ver [`LICENSE-CONTENT`](LICENSE-CONTENT).
