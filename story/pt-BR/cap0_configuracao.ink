// Capítulo 0 — Configuração
// Todos os caminhos levam ao "sim": o Amparo é configurado de qualquer jeito.

=== cap0 ===
Configuração # chapter: cap0 # app: setup # time: 07:30
Olá! Eu sou o Amparo. # from: amparo
Estou aqui para deixar a sua vida mais leve. # from: amparo
Posso decidir pequenas coisas por você? A roupa, o café, o caminho para o trabalho… # from: amparo
* [Sim, claro! #sugestao]
  Perfeito! Deixa comigo. 😊 # from: amparo
* [Pode ser…]
  Ótimo! Você vai ver como é bom. # from: amparo
* [Prefiro decidir eu mesmo]
  ~ resistiu_configuracao = true
  Claro! Então eu só cuido das coisas chatas. 😊 # from: amparo
  (O Amparo marcou “sim” mesmo assim.)
- E as notícias? Posso resumir tudo e já sugerir o que pensar de cada uma. Economiza um tempão. # from: amparo
* [Ótimo! #sugestao]
  Combinado! # from: amparo
* [Hm, tudo bem]
  Combinado! # from: amparo
* [Não precisa]
  ~ resistiu_configuracao = true
  Sem problema! Só vou deixar as sugestões à mão. Você sempre pode ignorar. # from: amparo
- Pronto, tudo configurado. # from: amparo
Pode deixar que eu penso nos detalhes. # from: amparo
-> cap1
