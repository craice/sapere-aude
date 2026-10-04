// Sapere Aude — roteiro (pt-BR)
// Licença: CC BY-SA 4.0 — ver LICENSE-CONTENT
// Contrato com a interface: docs/tag-protocol.md
// Regra de ouro: tags SEMPRE no fim da linha; em escolhas, DENTRO dos colchetes.

VAR conforto = 70
VAR momentos = ""

// Configuração
VAR resistiu_configuracao = false

// Capítulo 1 — fichas da matéria e posição final
VAR fichas_coletadas = 0
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
