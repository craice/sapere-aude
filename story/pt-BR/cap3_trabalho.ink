// Capítulo 3 — Trabalho
// Ideia de Kant: uso público × uso privado da razão.
// No cargo (uso "privado"), cumpre-se a função; em seu próprio nome, por escrito, diante do público
// (uso público), argumenta-se livremente. Recusar a função e desabafar com raiva não são o uso público de Kant.

=== cap3 ===
Trabalho # chapter: cap3 # app: chat # time: 16:40
Oi! Saiu a portaria da biblioteca. Preciso que você publique hoje no site da Secretaria e mande imprimir os cartazes com o novo horário. Obrigada! # from: celia
vc trabalha na prefeitura né?? dá pra fazer alguma coisa?? 😢 # from: bia
Melhor não se expor. Quer que eu arquive a mensagem da Bia e publique a portaria por você? # from: amparo
* [Sim: arquiva a Bia e publica a portaria #sugestao]
  ~ registrar("cap3_ordem", "recuou_medo")
  ~ ajustar_conforto(10)
  Feito! Portaria publicada, mensagem arquivada. Ninguém vai te incomodar. 😊 # from: amparo
  -> classificador
* [Recusar: não vou publicar a portaria]
  ~ registrar("cap3_ordem", "rompeu_sem_pensar")
  ~ ajustar_conforto(-10)
  Não vou publicar isso. Acho a decisão errada. # from: eu
  Entendo que você discorde. Mas publicar é a sua função; se cada servidor só cumprir as ordens com que concorda, nada funciona. Vou pedir para outra pessoa. Amanhã a gente conversa. # from: celia
  -> classificador
* [Desabafar agora nas redes, xingando a chefia]
  ~ registrar("cap3_ordem", "rompeu_sem_pensar")
  ~ ajustar_conforto(-10)
  Chefia incompetente fechando a biblioteca!!! Vergonha!!! 🤬 # from: eu
  O seu post teve 3 curtidas e 41 respostas furiosas. Ninguém discutiu o horário da biblioteca. # notify: amparo
  Vi o seu post. A portaria já foi publicada por outra pessoa. Podemos conversar amanhã? # from: celia
  -> classificador
* [Publicar a portaria e, à noite, escrever um texto público em seu próprio nome #pensar]
  -> carta

= carta
~ fichas_coletadas = 0
Tudo bem… mas cuidado com o que você escreve, hein. 😬 # notify: amparo
Terça-feira, à noite # app: narrativa # title # time: 21:15
Às 17h você publicou a portaria, como pede o seu cargo. Os cartazes foram para a gráfica.
Agora, em casa, você abre o espaço de opinião da Folha do Bairro. Aqui você não fala pelo seu cargo: fala em seu próprio nome, para quem quiser ler.
Folha do Bairro — Opinião # app: leitor # from: folha
Carta aberta # title
Escolha os argumentos que vão sustentar a sua carta. Ela será assinada com o seu nome, como moradora ou morador do bairro.
-> argumentos

= argumentos
* [40% dos empréstimos da biblioteca acontecem depois das 18h. #ficha]
  ~ arg_uso = true
  ~ fichas_coletadas++
  -> argumentos
* [A economia é de 0,3% do orçamento da Cultura. #ficha]
  ~ arg_orcamento = true
  ~ fichas_coletadas++
  -> argumentos
* [A decisão foi tomada sem consultar quem usa a biblioteca. #ficha]
  ~ arg_consulta = true
  ~ fichas_coletadas++
  -> argumentos
* [Proposta: uma audiência pública antes de mudar o horário. #ficha]
  ~ arg_proposta = true
  ~ fichas_coletadas++
  -> argumentos
+ {fichas_coletadas >= 2} [Publicar a carta aberta #compor]
  -> publicar
+ [Deixar para outro dia #sugestao]
  ~ registrar("cap3_ordem", "recuou_medo")
  Melhor assim. Amanhã você nem vai lembrar disso. 😊 # notify: amparo
  -> classificador

= publicar
~ registrar("cap3_ordem", "pensou")
~ cap3_escreveu = true
~ ajustar_conforto(-10)
Carta aberta: a biblioteca à noite # app: narrativa # title
Moro no bairro e escrevo aqui em meu próprio nome, não em nome do meu cargo.{arg_uso: Segundo a própria Secretaria, 40% dos empréstimos acontecem depois das 18h: quem usa a biblioteca à noite é quem trabalha de dia.}{arg_orcamento: A economia prevista equivale a 0,3% do orçamento da Cultura.}{arg_consulta: A decisão foi tomada sem ouvir quem usa a biblioteca.}{arg_proposta: Proponho uma audiência pública antes de qualquer mudança.} Peço que a decisão seja revista.
Você publica. Na Secretaria, amanhã, você vai continuar cumprindo a sua função — e ninguém pode te impedir de argumentar em público.
vc escreveu na Folha!! 😮 vou compartilhar # from: bia
-> classificador

= classificador
Uso público, uso privado # app: narrativa # title # time: 21:40
Kant tem um nome estranho para o que acabou de acontecer.
Para ele, uso PRIVADO da razão é o que você faz num cargo ou função — mesmo que seja um cargo público. Ali, é preciso cumprir a função.
Uso PÚBLICO é quando você fala em seu próprio nome, por escrito, para qualquer pessoa que queira ler. Esse, dizia Kant, deve ser sempre livre.
Vamos testar? Toque onde cada caso se encaixa.
-> q1

= q1
1. Publicar a portaria no site da Secretaria, porque é a sua tarefa.
* [No cargo (uso privado)]
  ~ acertos++
  Isso: é o seu cargo falando, não você.
* [Diante do público (uso público)]
  Quase. Está no site, mas é o seu cargo falando. Para Kant, isso é uso privado.
- -> q2

= q2
2. Escrever na Folha uma carta aberta, assinada em seu nome, criticando a portaria.
* [No cargo (uso privado)]
  Quase. Você escreve em seu próprio nome, para o público. Para Kant, isso é uso público.
* [Diante do público (uso público)]
  ~ acertos++
  Isso: é você falando, em seu nome, para quem quiser ler.
- -> q3

= q3
3. Uma professora ensina em sala de aula o currículo oficial da escola.
* [No cargo (uso privado)]
  ~ acertos++
  Isso: na sala de aula, ela cumpre a função que aceitou.
* [Diante do público (uso público)]
  Quase. A turma é grande, mas ela fala pela escola. Para Kant, isso é uso privado.
- -> q4

= q4
4. A mesma professora publica um artigo argumentando que o currículo deveria mudar.
* [No cargo (uso privado)]
  Quase. No artigo, ela fala em seu próprio nome, para o público. Para Kant, isso é uso público.
* [Diante do público (uso público)]
  ~ acertos++
  Isso: e ninguém deveria impedi-la de publicar.
- -> explicacao

= explicacao
{acertos == 4: Quatro de quatro!|Você acertou {acertos} de 4.}
Kant ouvia de todos os lados: “não raciocinem!”. O oficial: “não raciocinem, façam exercícios!”. O fiscal: “não raciocinem, paguem!”.
Hoje o coro é outro: não pense, siga a rota! Não pense, compre! Não pense, curta!
Kant não pede que se desobedeça no cargo. Pede que, fora dele, ninguém seja impedido de argumentar em público.
Isso foi o que Kant chamou de uso público da razão. # kant: cap3
-> cap4
