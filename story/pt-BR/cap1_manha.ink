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
Tudo bem! 😊 Qualquer coisa, estou aqui. # notify: amparo
Folha do Bairro # app: leitor # from: folha # time: 07:53
Biblioteca do bairro deixará de abrir à noite # title
A Biblioteca Comunitária da praça vai encerrar o atendimento às 18h a partir do mês que vem. Hoje ela fica aberta até as 22h.
A Secretaria de Cultura afirma que a medida busca “racionalizar custos” e que o horário noturno custa cerca de R$ 18 mil por mês.
Segundo dados da própria secretaria, 40% dos empréstimos de livros acontecem depois das 18h, a maioria feita por estudantes e trabalhadores.
A decisão foi publicada em portaria na semana passada. Não houve consulta pública nem conversa com o conselho de usuários da biblioteca.
O valor economizado equivale a cerca de 0,3% do orçamento anual da Cultura.
-> fichas

= fichas
{ fichas_coletadas == 1:
  A Bia está esperando… quer que eu resuma pra você? 🙂 # notify: amparo
}
* [O horário noturno custa cerca de R$ 18 mil por mês. #ficha]
  ~ ficha_custo = true
  ~ fichas_coletadas++
  -> fichas
* [40% dos empréstimos acontecem depois das 18h. #ficha]
  ~ ficha_uso = true
  ~ fichas_coletadas++
  -> fichas
* [Não houve consulta pública nem conversa com quem usa a biblioteca. #ficha]
  ~ ficha_consulta = true
  ~ fichas_coletadas++
  -> fichas
* [A economia equivale a 0,3% do orçamento da Cultura. #ficha]
  ~ ficha_orcamento = true
  ~ fichas_coletadas++
  -> fichas
+ {fichas_coletadas >= 2} [Responder à Bia com as minhas fichas #compor]
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
~ cap1_leu = true
~ ajustar_conforto(-10)
Li a matéria.{ficha_custo: O horário da noite custa uns R$ 18 mil por mês.}{ficha_uso: 40% dos empréstimos são depois das 18h.}{ficha_consulta: E ninguém perguntou nada pra quem usa.}{ficha_orcamento: Isso é 0,3% do orçamento da Cultura.}{posicao_cap1 == "erro": Acho que cortar é um erro.}{posicao_cap1 == "ouvir": Entendo a economia, mas deviam ter ouvido a gente.}{posicao_cap1 == "sentido": No fim, acho que o corte faz sentido.} # from: eu # app: chat # time: 07:58
nossa, vc leu mesmo 😮 # from: bia
{posicao_cap1 == "sentido": não concordo, mas pelo menos agora dá pra discutir com números.|faz sentido. posso usar isso no grupo do bairro?} # from: bia
Você passou 5 minutos nisso. Seu dia está um pouco menos tranquilo. # notify: amparo
-> fim_cap1

= fim_cap1
Isso foi o que Kant chamou de menoridade autoimposta. # kant: cap1
-> cap2
