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

O caractere `|` não pode aparecer dentro de tags. O caractere `#` não pode aparecer no texto (ele inicia uma tag).

## Tags de linha

| Tag | Valor | Efeito |
|---|---|---|
| `# app: X` | `setup`, `chat`, `leitor`, `narrativa`, `retrato`, `texto`, `fim` | Troca o app em tela. **Vale desta linha em diante.** No `retrato`, a primeira linha é o título e a linha do tempo das decisões aparece logo abaixo. No `texto`, a linha introduz o texto completo de Kant. |
| `# time: HH:MM` | ex.: `07:42` | Muda o relógio. **Vale desta linha em diante.** |
| `# from: X` | `amparo`, `bia`, `eu`, `folha`, `vidafit`, `resumao`, `guru`, `celia`, `arnaldo`, `duda`, `liberta` | No chat/configuração/narrativa: autor da fala. No leitor: nome do veículo (cabeçalho). |
| `# notify: X` | idem | A linha aparece como notificação de X. |
| `# chapter: X` | nome do knot (ex.: `cap1`) | Mostra o cartão de capítulo com o texto da linha e cria um ponto de salvamento. **Deve ser a primeira linha do knot.** |
| `# title` | — | No leitor: a linha é a manchete. Na narrativa: subtítulo da cena. |
| `# kant: capN` | `cap1`…`cap4` | Cartão de citação: o texto da linha é o título; a citação vem de `content/<idioma>/kant/trechos.json`. |
| `# evento: nome` | letras minúsculas, números e `_` | Conta um evento anônimo na analítica (se estiver ligada). A linha é exibida normalmente. |

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

Tipos de momento: `pensou`, `delegou_comodidade`, `recuou_medo`, `rompeu_sem_pensar`, `delegou_com_razao`. Cada `id` deve ser registrado **uma única vez** por partida e ter um rótulo na função `rotulo_momento(id)` (usado no retrato).

## Eventos de analítica

Capítulos (`cap0`…`cap5`) são contados automaticamente. O roteiro também emite: `padrao_pensou`, `padrao_comodidade`, `padrao_medo`, `padrao_rompeu`, `amparo_sugerir`, `leu_kant` (recusou o resumo e leu) e `leu_kant_depois` (aceitou o resumo e leu mesmo assim).
