# Ouse saber — Especificação de design

> *Um jogo sobre o que Kant chamou de Esclarecimento.*

- **Data:** 2026-10-03
- **Status:** aguardando revisão
- **Texto-base:** Immanuel Kant, *Beantwortung der Frage: Was ist Aufklärung?* (*Berlinische Monatsschrift*, dezembro de 1784)

---

## 1. Visão geral

### 1.1 Objetivo
Jogo sério, gratuito e de código aberto, que faz o jogador **viver** — e não apenas ler — as ideias centrais do texto de Kant sobre o Esclarecimento.

### 1.2 Público e contexto de uso
- Público geral, jogando sozinho, sem mediação de professor.
- Chega por um link, sem conhecimento prévio de Kant.
- O jogo precisa se explicar por conta própria e prender a atenção desde a primeira tela.

### 1.3 Ideias que o jogador deve levar
1. **Menoridade autoimposta** — Esclarecimento é a saída da menoridade da qual o próprio ser humano é culpado; não falta entendimento, falta decisão e coragem. *Sapere aude!*
2. **Preguiça, covardia e tutores** — é cômodo ser menor; tutores bem-intencionados pensam por nós e fazem parecer perigoso andar sozinho (o andador).
3. **Uso público × uso privado da razão** — no cargo, obedece-se (uso "privado"); como cidadão que se dirige ao público, argumenta-se livremente (uso público). "Raciocinai o quanto quiserdes, mas obedecei!"
4. **Esclarecimento como processo coletivo e gradual** — um público livre se esclarece aos poucos; revolução troca os tutores, não o modo de pensar. Não vivemos numa época esclarecida, mas numa época *de* esclarecimento.

### 1.4 Critério de sucesso
Uma pessoa sem contato prévio com Kant termina a partida e consegue explicar, com as próprias palavras, (a) por que a menoridade é "autoimposta" e (b) o que Kant quer dizer com uso público da razão.

Indicador quantitativo principal: proporção de jogadores que, no epílogo, recusam o resumo do Amparo e abrem o texto de Kant (`leu_kant`).

### 1.5 Restrições
- Publicação no GitHub Pages (site estático, sem backend).
- Duração de uma partida completa: **10–15 minutos**.
- Idioma de lançamento: **português brasileiro**, com todo o texto separado do código para permitir traduções futuras.
- Mobile-first; no desktop, o celular aparece centralizado.
- Código aberto: MIT (código) + CC BY-SA 4.0 (conteúdo).

---

## 2. Conceito

### 2.1 Mecânica central: "o jogo é o tutor"
O jogo inteiro é a tela do celular do jogador. Nele vive o **Amparo**, um assistente digital simpático, competente e bem-intencionado, que já resolve quase tudo pelo jogador. Aceitar o Amparo é fácil e confortável; pensar por conta própria dá um pouco mais de trabalho. A forma do jogo encena a tese de Kant: "É tão cômodo ser menor."

### 2.2 Ambientação e linguagem visual
- **Contemporânea.** Os tutores são o assistente digital, o app de resumos de livros, o coach de propósito, o app de saúde.
- **Interface diegética:** tudo acontece em telas de celular — chat, notificações, apps, leitor de matérias. Pouca ilustração; o design é a própria interface.
- A fidelidade a Kant vem dos **cartões de citação** ao fim de cada capítulo; a identificação vem do cenário.

### 2.3 Princípios de tom
- **O Amparo nunca é vilão.** É genuinamente útil e simpático; abrir mão dele precisa custar algo. Se for antipático, a lição vira caricatura.
- **Não é um sermão contra tecnologia ou IA.** Kant não condena livros nem médicos; condena renunciar a pensar quando se poderia pensar.
- **Sem "vitória".** Ninguém termina "esclarecido". O final é aberto e processual.
- **"Uso público" ≠ "postar nas redes".** O jogo encena essa diferença em vez de equipará-las.

---

## 3. Narrativa e estrutura

A partida cobre um dia e um epílogo meses depois. Um fio condutor atravessa os capítulos: **a biblioteca do bairro vai deixar de abrir à noite.**

O nome "Amparo" é inofensivo de propósito; a citação de Kant sobre o **andador** (*Gängelwagen*), no capítulo 2, permite ao jogador ligar os pontos sozinho.

| # | Capítulo | Ideia de Kant | O que o jogador vive | ~min |
|---|---|---|---|---|
| 0 | **Configuração** | — | O Amparo pede permissões: "Posso decidir pequenas coisas por você?". Todos os botões levam ao "sim". | 1 |
| 1 | **Manhã** | Menoridade autoimposta, *Sapere aude* | A amiga Bia pergunta o que você acha do novo horário da biblioteca. O Amparo tem a resposta pronta, a um toque. Responder por conta própria exige abrir a matéria, coletar fichas de argumento e montar a resposta: dá trabalho, mas você consegue. Não falta entendimento, falta decisão. | 3 |
| 2 | **Tarde** | Preguiça, covardia, tutores | Três tutores modernos: app de resumos de livros (*o livro*), coach de propósito (*o diretor espiritual*), app de saúde que decide a dieta (*o médico*). O Amparo oferece o Premium ("não preciso pensar, se posso pagar"). Você tenta algo sozinho, tropeça uma vez, o Amparo diz "viu? perigoso"; na segunda tentativa dá certo — depois de algumas quedas, aprende-se a andar. Inclui um momento em que delegar é razoável (a dose de um remédio). | 3 |
| 3 | **Trabalho** | Uso público × privado | Você trabalha na prefeitura e recebe a ordem de executar o novo horário da biblioteca. Opções: recusar no cargo; obedecer calado; desabafar com raiva nas redes; **cumprir a função e escrever, como cidadão, um texto público argumentado**. Minijogo: classificar falas em "no cargo" ou "diante do público". Tela explicando por que Kant chama de *privado* o uso feito no cargo. Paralelos contemporâneos dos "não raciocineis!" de Kant: "Não pense, siga a rota!", "Não pense, compre!", "Não pense, curta!". | 3 |
| 4 | **Três meses depois** | Processo coletivo | Seu texto circula. Há quem argumente contra; um influenciador incita a multidão (o público sob o jugo pode forçar os próprios tutores a permanecer nele). Surge o movimento "Cancela o Amparo" com outro app, o *Liberta* — só um novo andador: a revolução troca os tutores, não o modo de pensar. A mudança vem devagar: a Bia escreve o próprio texto, o horário é revisto em parte, nada fica "resolvido". | 3 |
| 5 | **Epílogo** | Época *de* esclarecimento | Retrato das escolhas (seção 4.4). O jogador pode trocar o Amparo de "decidir por mim" para "só sugerir". Por fim, o Amparo oferece: *"Quer que eu resuma o texto de Kant pra você?"* — opções: aceitar, ou **"Não, vou ler eu mesmo"**, que abre o texto completo. | 2 |

Cada capítulo termina com um **cartão de Kant**: *"Isso foi o que Kant chamou de…"* seguido do trecho correspondente da tradução.

**Liberdade interpretativa assumida:** o retrato reconhece momentos em que delegar era razoável. Isso é compatível com Kant (que critica renunciar ao próprio juízo, não consultar especialistas), mas não está explícito no texto. Deve ser validado na revisão filosófica.

---

## 4. Mecânicas

### 4.1 O verbo central: pensar × aceitar
Todo momento de decisão tem a mesma forma:

- **Aceitar a sugestão do Amparo:** um toque; botão grande, destacado, pré-selecionado.
- **Pensar por conta própria:** abrir a fonte (matéria, portaria, comentário), **coletar 2–3 fichas de argumento** tocando em trechos, e montar a resposta com elas. Duração-alvo: 15–30 segundos.

A mesma mecânica se repete nos capítulos 1, 3 e 4. O jogo não proíbe nada; apenas torna pensar um pouco mais trabalhoso.

**Pressão suave:** "Bia está digitando…" e notificações acumulando empurram para o atalho. **Nada falha por tempo.**

### 4.2 Escalada do Amparo
| Cap. | Comportamento | Encena |
|---|---|---|
| 1 | Sugere; se recusado, "tudo bem! 😊" | comodidade |
| 2 | Avisa do perigo, mostra a história de alguém que "se deu mal sozinho" | covardia; o exemplo que intimida |
| 3 | "Melhor não se expor. Quer que eu arquive isso?" | o "não raciocineis!" |
| 4 | Oferece escrever sua resposta no debate | tentação final |

O Amparo nunca fica hostil — apenas um pouco mais insistente e carente.

### 4.3 Medidores
- **Visível (diegético):** widget do Amparo, *"Seu dia está 😊 tranquilo"* — mede o **conforto**. É a métrica do tutor, não do jogo.
- **Não há barra de autonomia visível.** Ela transformaria o jogo em "encha a barra certa" e entregaria a moral antes da experiência.
- **Oculto:** cada decisão registra um *momento*, com uma classificação:

| Código | Significado |
|---|---|
| `pensou` | 💭 pensou por conta própria |
| `delegou_comodidade` | 🤝 delegou por comodidade (preguiça) |
| `recuou_medo` | 😟 recuou por medo (covardia) |
| `rompeu_sem_pensar` | ⚡ rompeu sem pensar (recusou ordem no cargo, desabafou com raiva, aderiu ao *Liberta*) |
| `delegou_com_razao` | ✓ delegou com razão (ex.: dose do remédio) |

### 4.4 Retrato final
- Linha do tempo do dia, com cada momento marcado pelo ícone da sua classificação.
- **Sem nota, sem porcentagem.**
- Leitura curta escolhida pelo padrão predominante. Exemplo: *"Você delegou mais por comodidade do que por medo. Kant diria que o primeiro passo não é ficar mais inteligente: é se decidir."*
- Em seguida: troca do modo do Amparo → oferta de resumo → texto completo.

### 4.5 Salvamento
- Salvamento automático no navegador (`localStorage`) ao início de cada capítulo.
- Botão "Recomeçar".
- Se o armazenamento estiver indisponível, o jogo funciona normalmente, apenas sem retomar a partida.

### 4.6 Acessibilidade
- Tudo jogável com toque, clique ou teclado; nenhuma interação exige arrastar (o minijogo do capítulo 3 usa toques).
- Mensagens do chat anunciadas a leitores de tela (`aria-live`).
- Animações respeitam `prefers-reduced-motion`.
- Nenhuma falha por tempo.

### 4.7 Fora do escopo (v1)
Imagem compartilhável do retrato, conquistas, seleção de capítulos, outros idiomas, áudio.

---

## 5. Arquitetura técnica

### 5.1 Stack
- **Ink** (linguagem narrativa da Inkle, MIT) para o roteiro.
- **inkjs** para executar a história no navegador.
- **Vite + TypeScript**, sem framework de UI. Se o chat ficar complexo demais, o Preact pode ser adicionado sem reescrita.
- **GitHub Actions** compila e publica no GitHub Pages a cada push na `main`.

### 5.2 Princípio central
**O Ink é a única fonte de verdade.** História, variáveis, momentos registrados e progresso vivem no estado do Ink. A interface apenas renderiza o que a história emite e devolve as escolhas.
- O salvamento é o JSON do estado do Ink.
- O roteiro pode ser editado sem tocar no código.
- Não há estado duplicado que possa divergir.

### 5.3 Protocolo de tags
A história comunica eventos de interface por tags do Ink. Exemplos (a especificação completa vive em `docs/tag-protocol.md`, a ser escrito no plano):

```
# app: chat
# from: bia
# notify: Amparo | Seu dia está 😊 tranquilo
# moment: delegou_comodidade
# ficha                 (esta escolha é renderizada como trecho tocável no Leitor)
# kant: cap1            (exibe o cartão de citação do capítulo 1)
```

Este protocolo é a fronteira mais arriscada do sistema. **Qualquer tag desconhecida ou malformada faz os testes falharem.**

### 5.4 Estrutura do repositório
```
story/pt-BR/          roteiro .ink (main.ink + um arquivo por capítulo)
content/pt-BR/kant/   tradução própria do texto de Kant (markdown)
src/
  engine/             envolve o inkjs: avançar, escolher, salvar/carregar
  tags/               converte tags em eventos tipados
  ui/
    shell/            moldura do celular, barra de status, notificações
    apps/             Chat, Leitor, Cartão Kant, Classificador,
                      Retrato, Ajustes do Amparo
  i18n/pt-BR.json     textos da interface
  analytics.ts        camada fina, desligável
docs/                 specs, protocolo de tags
.github/workflows/    build e deploy
LICENSE               MIT
LICENSE-CONTENT       CC BY-SA 4.0
```

Uma tradução futura consiste em adicionar `story/<idioma>/`, `content/<idioma>/` e `src/i18n/<idioma>.json`, sem alterar código.

### 5.5 Fluxo de autoria
- Edição do `.ink` no **Inky** (editor gratuito) para testar a lógica narrativa — mostra texto e tags, não a interface.
- `npm run dev` para ver o resultado no celular simulado, com recarga automática.
- O Ink é compilado no build; não há passo manual.

### 5.6 Testes
- **Unitários (Vitest):** parser de tags, engine (avançar, escolher, salvar/carregar).
- **Robô de jogatina:** centenas de partidas com escolhas aleatórias; verifica que toda partida chega ao epílogo, sem becos sem saída, e que todas as tags emitidas são válidas.
- **Ponta a ponta (Playwright):** um teste que abre a página e joga até o fim aceitando todas as sugestões.

---

## 6. Conteúdo

### 6.1 Texto de Kant
- **Fonte:** original alemão de 1784, em domínio público (via Wikisource).
- **Tradução própria** completa, feita a partir do alemão, revisada pelo responsável do projeto e publicada no repositório sob CC BY-SA 4.0.
- Traduções brasileiras comerciais (Vozes, Edições 70 etc.) **não** são usadas.

### 6.2 Glossário
| Alemão | Tradução | Observação |
|---|---|---|
| *Aufklärung* | Esclarecimento | Padrão nas traduções brasileiras; "Iluminismo" designa o período histórico. O título original aparece na tela "Sobre". |
| *Unmündigkeit* | menoridade | |
| *Vormünder* | tutores | |
| *Gängelwagen* | andador | |
| *räsonnieren* | raciocinar | |
| *Sapere aude!* | Ouse saber! | Com a paráfrase de Kant: "Tem coragem de servir-te de teu próprio entendimento!" |

### 6.3 Roteiro
Primeiro rascunho escrito pelo assistente de IA; revisão do responsável do projeto; revisão filosófica antes do lançamento.

### 6.4 Tela "Sobre"
Créditos, título original do texto de Kant, licenças, link para o repositório e uma nota de privacidade de uma frase.

---

## 7. Licenças
- **Código:** MIT (`LICENSE`).
- **Conteúdo** (roteiro em `story/`, tradução em `content/`, arte): CC BY-SA 4.0 (`LICENSE-CONTENT`).
- O README explica a divisão.

---

## 8. Analítica

**GoatCounter** — gratuito para projetos não comerciais, código aberto, sem cookies, sem dados pessoais; dispensa banner de consentimento. Desligado em desenvolvimento; respeita "Do Not Track". Falhas no carregamento do GoatCounter nunca afetam o jogo.

| Evento | Pergunta que responde |
|---|---|
| `inicio`, `cap1`…`cap4`, `epilogo` | Onde as pessoas abandonam? |
| `amparo_sugerir` | Quantos trocam o modo do Amparo para "só sugerir"? |
| `leu_kant` | Quantos recusam o resumo e abrem o texto? (**indicador-chave**) |
| `padrao_<padrão>` | Distribuição dos padrões predominantes no retrato |

---

## 9. Validação antes do lançamento
1. Testes automáticos (seção 5.6) passando.
2. **Playtest com 3–5 pessoas do público geral**, sem explicação prévia; ao final, cada uma explica com as próprias palavras menoridade autoimposta e uso público da razão (critério da seção 1.4).
3. **Revisão filosófica** do roteiro e da tradução por alguém da área.

---

## 10. Riscos
| Risco | Mitigação |
|---|---|
| Lição rasa ("pense por si mesmo!" / "IA é ruim") | Amparo simpático e útil; momento de delegação razoável; final aberto; revisão filosófica. |
| Confusão entre "uso privado" e "pessoal" | Capítulo 3 dedicado, minijogo, tela explicativa. |
| Mecânica de "pensar" cansativa | Duração-alvo de 15–30 s; reaproveitamento da mesma mecânica; playtest. |
| Erros no protocolo de tags quebrando cenas em silêncio | Parser estrito; robô de jogatina; tag desconhecida falha os testes. |
| Abandono antes do fim (sem mediador) | Capítulos curtos; primeira tela envolvente; analítica de abandono por capítulo. |
| Imprecisão na tradução de Kant | Glossário fixo; revisão filosófica. |
