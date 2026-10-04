// Capítulo 4 — Três meses depois
// Ideia de Kant: o esclarecimento é um processo coletivo e lento. Um público se esclarece se tiver liberdade;
// tutores incitam o público; uma revolução troca os tutores, não o modo de pensar (o Liberta é um novo andador).

=== cap4 ===
Três meses depois # chapter: cap4 # app: chat # time: 19:10
Debate sobre o horário da biblioteca chega à Câmara Municipal # notify: folha
{cap3_escreveu: A sua carta aberta|O texto que a Bia escreveu} na Folha já tem 312 comentários. Um deles está bombando: # from: amparo
Biblioteca aberta de noite é desperdício. Ninguém mais lê livro. Quem quiser estudar que estude em casa. # from: arnaldo
Quer que eu responda por você? Já sei o que você pensa. 😊 # from: amparo
* [Deixar o Amparo responder #sugestao]
  ~ registrar("cap4_debate", "delegou_comodidade")
  ~ ajustar_conforto(5)
  Discordo totalmente!!! 👎👎👎 # from: eu
  Argumento nenhum, né? Típico. # from: arnaldo
* [Responder com um argumento #pensar]
  ~ registrar("cap4_debate", "pensou")
  ~ debate_pensou = true
  ~ ajustar_conforto(-5)
  { apoia_corte():
    Seu Arnaldo, eu até apoio a mudança — mas não porque ninguém lê.{viu_uso(): 40% dos empréstimos ainda são depois das 18h.} O bom argumento é o orçamento, e ele merece ser discutido em público. # from: eu
    Hm. Pelo menos você explica o porquê. # from: arnaldo
  - else:
    Seu Arnaldo, {viu_uso(): 40% dos empréstimos são depois das 18h:|segundo a própria Secretaria, muita gente usa a biblioteca à noite:} quem usa à noite é quem trabalha de dia. Que tal ir à audiência pública e ver quem aparece lá? # from: eu
    Hm. Não sabia disso. Vou pensar. # from: arnaldo
  }
- GENTE!!! A biblioteca fechou e o Amparo NÃO AVISOU NINGUÉM 😡 CANCELA O AMPARO!!! Baixem o LIBERTA, o app que pensa por você DO JEITO CERTO 🔥 # from: duda
Instale agora. Eu digo em quem confiar, o que ler e o que postar. Liberdade de verdade! ✊ # notify: liberta
* [Instalar o Liberta #sugestao]
  ~ registrar("cap4_liberta", "rompeu_sem_pensar")
  ~ liberta_instalado = true
  Pronto! Já desinstalei o Amparo e escolhi as suas próximas dez opiniões. ✊ # notify: liberta
  vc trocou um andador por outro? kkkk # from: bia
* [Ler os termos de uso do Liberta antes #pensar]
  ~ registrar("cap4_liberta", "pensou")
  Termos de uso do Liberta # app: leitor # from: liberta
  Termos de uso # title
  Item 4. O Liberta decidirá por você em quais causas acreditar, quais textos ler e o que publicar.
  Item 7. Discordar do Liberta desativa a sua conta.
  É o Amparo com outra camiseta. # app: chat # from: eu
  kkkk exatamente # from: bia
- A audiência # app: narrativa # title # time: 20:00
Na audiência pública, a Câmara lota. Tem estudante, tem aposentado, tem gente que nunca tinha pisado ali.
{debate_pensou: Seu Arnaldo também está lá, de braços cruzados — mas está lá.}
A Secretaria propõe manter a biblioteca aberta até as 21h às terças e quintas. Não agrada a todo mundo. Mas é a primeira vez que a decisão é discutida em público, com números na mesa.
não é tudo, mas é alguma coisa. # from: bia
{ cap3_escreveu:
  {cap1_leu: lembra daquela manhã em que vc leu a matéria inteira? depois da sua carta, escrevi meu próprio texto também 📝|depois da sua carta, cansei de esperar opinião pronta: escrevi meu próprio texto 📝} # from: bia
- else:
  {cap1_leu: lembra daquela manhã em que vc leu a matéria inteira? foi aí que eu resolvi escrever o meu texto 📝|nunca imaginei que o meu textinho na Folha fosse virar tudo isso 📝} # from: bia
}
Isso é o que Kant descreve: um público só se esclarece devagar. # kant: cap4
-> cap5
