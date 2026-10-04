# Sapere Aude — Plano 2: jogo completo (capítulos 2–5, Kant, retrato, Sobre, analítica)

> Executado inline pela mesma sessão que escreveu o plano (superpowers:executing-plans). Por isso este plano registra decisões, interfaces e testes; o roteiro e o código são escritos diretamente nas tarefas, com TDD, e validados pelo robô de jogatina e pelos testes e2e.

**Goal:** Terminar o jogo descrito na spec: tradução de Kant + cartões de citação, capítulos 2 (Tarde), 3 (Trabalho), 4 (Três meses depois), epílogo com retrato, tela "Sobre", analítica, e as pendências da revisão do Plano 1.

**Spec:** `docs/superpowers/specs/2026-10-03-aufklaerung-design.md` (aprovada). **Base:** Plano 1 publicado.

## Global Constraints
Os mesmos do Plano 1 (Ink como única fonte de verdade; texto narrativo só em `story/pt-BR/`, textos de interface só em `src/i18n/pt-BR.json`, conteúdo de Kant só em `content/pt-BR/kant/`; tags no fim da linha; nada falha por tempo; PT-BR com acentuação; commits com os trailers de atribuição).

## Decisões de design (escritas pelo assistente, conforme pedido do usuário)

### Capítulo 2 — Tarde (preguiça, covardia, tutores)
- Tutores como notificações rápidas: **VidaFit** (o médico: já escolheu seu almoço), **Resumão** (o livro: "Crítica da Razão Pura em 4 minutos"), **Guru do Propósito** (o diretor espiritual).
- `cap2_premium` — Amparo Premium, R$ 19,90/mês, "eu decido também o que você pensa" (= "não preciso pensar, se posso pagar"). Assinar → `delegou_comodidade`; Agora não → `pensou`.
- `cap2_remedio` — dose de antibiótico receitada pela médica. Tomar como receitado → `delegou_com_razao`; cortar a dose por conta própria → `rompeu_sem_pensar`.
- `cap2_caminho` — reunião num prédio novo. O Amparo cita "o Marcos, que se perdeu sem o Amparo" (o exemplo que intimida). Ir guiado → `recuou_medo`. Ir sozinho → **primeira tentativa falha** (desce no ponto errado); o Amparo: "Viu? Perigoso." → aceitar ajuda (`recuou_medo`) ou perguntar o caminho e seguir (`pensou`, "depois de algumas quedas, aprende-se a andar").

### Capítulo 3 — Trabalho (uso público × privado)
- Você é analista na Secretaria de Cultura. A chefe, **Célia**, pede para publicar a portaria do novo horário. A Bia pede ajuda. O Amparo: "Melhor não se expor."
- `cap3_ordem`: arquivar a Bia e publicar calado → `recuou_medo`; recusar publicar → `rompeu_sem_pensar` (Célia: "publicar é sua função"); desabafar xingando a chefe nas redes → `rompeu_sem_pensar`; **publicar e, à noite, escrever como cidadão uma carta aberta na Folha** (fichas + composição) → `pensou`.
- Minijogo (4 afirmações, toques): "no cargo (uso privado)" × "diante do público (uso público)", com retorno explicativo. Seguido da explicação de por que Kant chama de *privado* o uso no cargo e dos "não raciocinem!" (de Kant e de hoje: "não pense, siga a rota / compre / curta").

### Capítulo 4 — Três meses depois (processo coletivo)
- O texto (seu, se `cap3_ordem` = pensou; senão, o da Bia) circula. **Seu Arnaldo** objeta. `cap4_debate`: deixar o Amparo responder → `delegou_comodidade` (resposta rasa); responder com argumento → `pensou`.
- A influenciadora **Duda** incita "#CancelaOAmparo" e o app **Liberta** ("eu decido por você do jeito certo"). `cap4_liberta`: instalar → `rompeu_sem_pensar` (trocar de andador); ler os termos antes → `pensou` ("é o Amparo com outra camiseta").
- Resolução lenta: audiência pública, a biblioteca abre até 21h às terças e quintas. A Bia escreve o próprio texto.

### Epílogo
- App **retrato**: linha do tempo dos 7 momentos (rótulos vindos do Ink via `rotulo_momento(id)`), sem nota; leitura pelo padrão predominante (contadores no Ink); nota sobre delegação razoável; "época de esclarecimento".
- O Amparo pergunta: continuar decidindo ou **só sugerir** (`# evento: amparo_sugerir`).
- "Quer que eu resuma o texto de Kant?" → resumo raso, ou **"Não, vou ler eu mesmo"** (`# evento: leu_kant`) → app **texto** com a tradução completa. Tela final: "Sapere aude!" + Recomeçar.

### Kant
- Tradução própria e completa do original (Berlinische Monatsschrift, 1784, via Wikisource) em `content/pt-BR/kant/esclarecimento.md`, com cabeçalho declarando que é **tradução assistida por IA, pendente de revisão filosófica**, e notas do tradutor (inclusive sobre "o belo sexo").
- Cartões `# kant: capN` ao fim dos capítulos 1–4; o texto do cartão vem de `content/pt-BR/kant/trechos.json` (lista de fragmentos). **Teste: todo fragmento aparece literalmente na tradução.**

## Mudanças de arquitetura
1. Protocolo: apps `narrativa`, `retrato`, `texto`; personagens `vidafit`, `resumao`, `guru`, `celia`, `arnaldo`, `duda`, `liberta`; tags `# kant: capN`, `# evento: nome`.
2. `StoryEngine.describeMoments()` → `{id, type, label}[]` usando `EvaluateFunction('rotulo_momento', [id])`.
3. Renderer: cartão de Kant (com pausa de leitura antes), eventos → analítica, capítulos → evento de analítica, **descarta as telas dos apps a cada capítulo** (pendência obrigatória do Plano 1).
4. Salvamento com **versão do roteiro** (hash do JSON compilado): save de outro roteiro → começa do zero.
5. Tela **Sobre** (botão na barra de status): créditos, título original, licenças, repositório, privacidade, Recomeçar com confirmação.
6. **Analítica GoatCounter** desligada por padrão: só envia se `VITE_GOATCOUNTER_URL` estiver definida no build (variável do repositório), nunca em dev, respeita Do Not Track; pixel sem cookies (`/count?p=…&e=true`).

## Pendências do Plano 1 incluídas
Telas por capítulo; save versionado; robô retoma **todo** checkpoint encontrado (lista de capítulos cap0–cap5); CI sem build duplicado e sem cancelar deploy da `main`; leitor anuncia a matéria (foco na manchete); "Tudo bem! 😊" ao escolher ler a matéria no cap. 1; lint não confunde `https://` com comentário.

## Testes
- Unitários: protocolo (novos valores), `describeMoments`, save versionado, analítica (desligada sem URL / com DNT; monta a URL certa), trechos ⊂ tradução, lint com URL.
- Robô: 300 partidas aleatórias até o fim; cada partida registra exatamente os 7 ids de momento uma vez; todos os rótulos existem; todos os tipos aparecem ao longo das partidas; todo checkpoint é retomável; caminhos "aceitar tudo" e "pensar".
- E2E: jogo completo "aceitar tudo" e "pensar" até a tela final; cartão de Kant; retrato lista 7 momentos; texto de Kant abre; Sobre + Recomeçar; testes do Plano 1 continuam.

## Fora do alcance do assistente (dependem de pessoas)
Revisão filosófica do roteiro e da tradução; playtest com 3–5 pessoas; criação da conta GoatCounter (o usuário cria e define a variável `GOATCOUNTER_URL` no repositório).
