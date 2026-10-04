// Sapere Aude — roteiro (pt-BR)
// Licença: CC BY-SA 4.0 — ver LICENSE-CONTENT
// Contrato com a interface: docs/tag-protocol.md
// Regra de ouro: tags SEMPRE no fim da linha; em escolhas, DENTRO dos colchetes.
// Nunca use o caractere # dentro do texto (ele inicia uma tag).

VAR conforto = 70
VAR momentos = ""

// Contadores para o retrato final (atualizados por registrar)
VAR n_pensou = 0
VAR n_comodidade = 0
VAR n_medo = 0
VAR n_rompeu = 0
VAR n_razao = 0

// Configuração
VAR resistiu_configuracao = false

// Capítulo 1 — fichas da matéria e posição final
VAR fichas_coletadas = 0
VAR ficha_custo = false
VAR ficha_uso = false
VAR ficha_consulta = false
VAR ficha_orcamento = false
VAR posicao_cap1 = ""
VAR cap1_leu = false

// Capítulo 3 — carta aberta e minijogo
VAR cap3_escreveu = false
VAR arg_uso = false
VAR arg_orcamento = false
VAR arg_consulta = false
VAR arg_proposta = false
VAR acertos = 0

// Capítulo 4
VAR debate_pensou = false
VAR liberta_instalado = false

// Epílogo
VAR leu_depois = false

INCLUDE cap0_configuracao.ink
INCLUDE cap1_manha.ink
INCLUDE cap2_tarde.ink
INCLUDE cap3_trabalho.ink
INCLUDE cap4_tres_meses.ink
INCLUDE cap5_epilogo.ink
INCLUDE fim.ink

-> cap0

// Registra uma decisão para o retrato final. Cada id deve ser único na partida
// e ter um rótulo em rotulo_momento.
// Tipos: pensou, delegou_comodidade, recuou_medo, rompeu_sem_pensar, delegou_com_razao
=== function registrar(id, tipo) ===
~ momentos = "{momentos}{id}:{tipo};"
{ tipo:
  - "pensou":
    ~ n_pensou++
  - "delegou_comodidade":
    ~ n_comodidade++
  - "recuou_medo":
    ~ n_medo++
  - "rompeu_sem_pensar":
    ~ n_rompeu++
  - "delegou_com_razao":
    ~ n_razao++
}

// Rótulo de cada decisão na linha do tempo do retrato.
=== function rotulo_momento(id) ===
{ id:
  - "cap1_bia":
    ~ return "Manhã — responder à Bia sobre a biblioteca"
  - "cap2_premium":
    ~ return "Tarde — a oferta do Amparo Premium"
  - "cap2_remedio":
    ~ return "Tarde — a dose do remédio"
  - "cap2_caminho":
    ~ return "Tarde — o caminho até a reunião"
  - "cap3_ordem":
    ~ return "Trabalho — a portaria da biblioteca"
  - "cap4_debate":
    ~ return "Três meses depois — responder ao Seu Arnaldo"
  - "cap4_liberta":
    ~ return "Três meses depois — o convite do Liberta"
  - else:
    ~ return ""
}

// Altera o conforto mantendo-o entre 0 e 100.
=== function ajustar_conforto(delta) ===
~ conforto = MAX(0, MIN(100, conforto + delta))
