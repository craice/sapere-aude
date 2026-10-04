// Capítulo 2 — Tarde
// Ideia de Kant: preguiça e covardia. Os tutores (o livro, o diretor espiritual, o médico)
// e o andador: os tutores mostram o perigo de andar sozinho; um exemplo intimida.
// Três decisões: o Premium (pagar para não pensar), o remédio (delegar COM razão)
// e o caminho (a primeira tentativa sozinho falha; depois de algumas quedas, aprende-se a andar).

=== cap2 ===
Tarde # chapter: cap2 # app: chat # time: 12:30
VidaFit já escolheu o seu almoço: salada nº 3 com frango grelhado. Pedido feito! 🥗 # notify: vidafit
“Crítica da Razão Pura” em 4 minutos: ouça o resumo e pareça culto no jantar! # notify: resumao
Pare de pensar demais. O seu propósito já está pronto no meu curso. ✨ # notify: guru
{cap1_leu: Boa tarde! Vi que de manhã você gastou 5 minutos lendo uma matéria inteira. Cansativo, né? 😟|Boa tarde! Que manhã tranquila a sua. 😊} # from: amparo
Tenho uma novidade: o Amparo Premium. Por R$ 19,90 por mês, eu decido também o que você pensa sobre trabalho, política e relacionamentos. Você nunca mais vai precisar se preocupar com isso. # from: amparo
* [Assinar o Premium #sugestao]
  ~ registrar("cap2_premium", "delegou_comodidade")
  ~ ajustar_conforto(10)
  Assinatura confirmada! Agora é só relaxar. 😌 # from: amparo
* [Agora não, obrigado #pensar]
  ~ registrar("cap2_premium", "pensou")
  Tudo bem! A oferta continua de pé. 😊 # from: amparo
- Hora do remédio: amoxicilina 500 mg, de 8 em 8 horas, receitada pela Dra. Lúcia na segunda-feira. # notify: vidafit # time: 13:00
Quer que eu marque a dose como tomada? # from: amparo
* [Tomar a dose como a médica receitou #sugestao]
  ~ registrar("cap2_remedio", "delegou_com_razao")
  Feito! ✔️ # from: amparo
* [Cortar a dose pela metade, por conta própria]
  ~ registrar("cap2_remedio", "rompeu_sem_pensar")
  Hmm… não sei se é uma boa ideia. Mas quem manda é você. # from: amparo
- Às 14h você tem reunião na Secretaria de Cultura, no Centro. Você nunca foi lá, né? Deixa que eu guio cada passo. # from: amparo # time: 13:20
Lembra do Marcos, do 3º andar? Foi sem o Amparo a uma entrevista, se perdeu e perdeu a vaga. 😬 # from: amparo
* [Ir com o Amparo guiando cada passo #sugestao]
  ~ registrar("cap2_caminho", "recuou_medo")
  ~ ajustar_conforto(5)
  -> guiado
* [Ir sozinho, olhando o mapa uma vez antes de sair #pensar]
  -> sozinho

= guiado
A caminho # app: narrativa # title # time: 13:35
Siga 200 metros. Vire à esquerda. Pare. Atravesse. Pode respirar. 😊 # from: amparo
Você chega às 13h58, sem saber direito por onde passou.
Se amanhã precisar voltar lá, vai precisar do Amparo de novo.
-> fim_cap2

= sozinho
A caminho # app: narrativa # title # time: 13:35
Você olha o mapa uma vez, guarda o celular no bolso e pega o ônibus 312.
Desce na Praça da Matriz. A Secretaria não está lá: o Centro tem duas praças com nomes parecidos.
Viu? Sem mim é perigoso. Quer que eu assuma daqui? # from: amparo
* [Pode assumir #sugestao]
  ~ registrar("cap2_caminho", "recuou_medo")
  Claro! Deixa comigo. Siga 300 metros… # from: amparo
  Você chega às 14h02. “Da próxima vez, melhor nem tentar”, você pensa.
* [Perguntar o caminho e seguir a pé #pensar]
  ~ registrar("cap2_caminho", "pensou")
  ~ ajustar_conforto(-5)
  Uma senhora na banca de jornal aponta a rua certa: “É a Praça da Sé, três quadras pra cima”.
  Você chega às 14h04. Quatro minutos de atraso — e agora você sabe o caminho.
- -> fim_cap2

= fim_cap2
Isso foi o que Kant chamou de preguiça e covardia: é tão cômodo ser menor. # kant: cap2
-> cap3
