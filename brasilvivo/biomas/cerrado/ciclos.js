/* =====================================================================
   Bioma Cerrado · ciclos de vida do Viveiro
   passo: de → para, recursos que precisa (a criança arrasta até o nicho) e tempo real em minutos.
   Tempos curtos para o teste; no lançamento passam a horas.
   ===================================================================== */
Ciclo({
  id: 'metamorfose-borboleta', especie: 'borboleta-azul', nicho: 'terrario', inicio: 'ovo',
  passos: [
    { de: 'ovo', para: 'lagarta', precisa: ['folha-hospedeira', 'sombra'], minutos: 1.5,
      sinal: 'O ovinho escureceu. Tem alguém se mexendo lá dentro.' },
    { de: 'lagarta', para: 'crisalida', precisa: ['folha-hospedeira'], minutos: 2,
      sinal: 'A lagarta come sem parar e já trocou de pele. Está ficando grande.' },
    { de: 'crisalida', para: 'adulto', precisa: ['quieto'], minutos: 2,
      sinal: 'A crisálida está parada, mas por dentro tudo está mudando.' }
  ],
  ativar: { tipo: 'soltar', onde: 'jardim' }
});

Ciclo({
  id: 'metamorfose-sapo', especie: 'sapo-cururu', nicho: 'aquario', inicio: 'ovos',
  passos: [
    { de: 'ovos', para: 'girino', precisa: ['agua-limpa', 'sombra'], minutos: 1.5,
      sinal: 'Os pontinhos pretos ganharam cauda.' },
    { de: 'girino', para: 'sapinho', precisa: ['agua-limpa', 'algas'], minutos: 2,
      sinal: 'Apareceram perninhas de trás. A cauda está encolhendo.' },
    { de: 'sapinho', para: 'adulto', precisa: ['pedra-seca'], minutos: 2,
      sinal: 'O sapinho já respira fora da água e quer subir na pedra.' }
  ],
  ativar: { tipo: 'soltar', onde: 'vereda' }
});
