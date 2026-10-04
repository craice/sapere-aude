// Capítulo 5 — Epílogo
// O retrato: linha do tempo das decisões (montada pela interface a partir de `momentos` e rotulo_momento),
// sem nota; a leitura pelo padrão predominante; a delegação razoável; "época de esclarecimento".
// Por fim, o Amparo pergunta se deve só sugerir e oferece resumir Kant. Recusar abre o texto completo.

=== cap5 ===
Epílogo # chapter: cap5 # app: retrato # time: 22:30
Seu dia, visto de cima
{
- n_pensou >= n_comodidade && n_pensou >= n_medo && n_pensou >= n_rompeu:
  Na maior parte das vezes, você pensou por conta própria — e isso deu trabalho. Kant diria que é exatamente esse esforço que vale a pena. # evento: padrao_pensou
- n_comodidade >= n_medo && n_comodidade >= n_rompeu:
  Você delegou mais por comodidade do que por medo. Kant diria que o primeiro passo não é ficar mais inteligente: é se decidir. # evento: padrao_comodidade
- n_medo >= n_rompeu:
  Muitas vezes, você recuou por medo do que poderia dar errado. Kant diria que o perigo não é tão grande: depois de algumas quedas, aprende-se a andar. # evento: padrao_medo
- else:
  Algumas vezes, você rompeu sem pensar: trocou um andador por outro, ou brigou no lugar errado. Para Kant, sair da menoridade não é desobedecer a tudo; é pensar — e argumentar em público. # evento: padrao_rompeu
}
{ n_razao > 0:
  E quando confiou na receita da médica, fez bem. Kant não pede que você saiba tudo; pede que não renuncie a pensar.
}
Ninguém termina este dia “esclarecido”. Nem você, nem Kant. Ele dizia que não vivemos numa época esclarecida, mas numa época de esclarecimento: um caminho, não uma chegada.
{ liberta_instalado:
  (O Liberta saiu do ar na semana seguinte. Você reinstalou o Amparo.) # app: chat
}
Posso fazer uma pergunta? Daqui para a frente, você quer que eu continue decidindo por você, ou que eu só sugira? # from: amparo # app: chat
* [Só sugerir. Quem decide sou eu. #pensar]
  Combinado. Vou sentir falta de decidir tudo… mas faz sentido. 😊 # from: amparo # evento: amparo_sugerir
* [Pode continuar decidindo #sugestao]
  Oba! Deixa comigo. 😊 # from: amparo
- Ah, vi que você jogou um jogo sobre Kant. Quer que eu resuma o texto dele pra você? São só três frases. # from: amparo
* [Sim, resume #sugestao]
  Kant diz: pense por conta própria. Tenha coragem. Pronto! 😊 # from: amparo
  (Será que um texto inteiro cabe em três frases?)
  ** [Terminar #sugestao]
     -> fim
  ** [Ler o texto completo mesmo assim #pensar]
     ~ leu_depois = true
     -> leitura_kant
* [Não, vou ler eu mesmo #pensar]
  -> leitura_kant

= leitura_kant
{ leu_depois:
  Resposta à pergunta: O que é Esclarecimento? — o texto completo, numa tradução nova. # app: texto # evento: leu_kant_depois
- else:
  Resposta à pergunta: O que é Esclarecimento? — o texto completo, numa tradução nova. # app: texto # evento: leu_kant
}
+ [Terminar]
  -> fim
