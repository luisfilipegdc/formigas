/* =====================================================================
   Bioma Cerrado · relações ecológicas: o que o Ruído quebrou
   prova: como a relação é descoberta (vira "Conectado")
     ver-acao → o bicho faz a ação numa área e o jogador observa na hora
     ativar   → só é descoberta quando o jogador ativa a espécie no mundo
   ativar: como o jogador religa a relação no mundo (Sprint 2 em diante)
   CONTEÚDO EM REVISÃO CIENTÍFICA.
   ===================================================================== */
Relacao({ id: 'borboleta-poliniza-flor', de: 'borboleta-azul', tipo: 'poliniza', para: 'Flores do jardim',
  texto: 'Pousa nas flores para beber néctar e leva pólen de uma flor para outra.',
  prova: { tipo: 'ativar' },
  ativar: { tipo: 'soltar', especie: 'borboleta-azul', fase: 'adulto', onde: 'jardim' },
  revisao: { status: 'rascunho', fonte: '', revisor: '' } });

Relacao({ id: 'jatai-poliniza-flor', de: 'jatai', tipo: 'poliniza', para: 'Flores da horta',
  texto: 'A jataí pousa na flor e sai com pólen grudado nas patas de trás.',
  prova: { tipo: 'ver-acao', area: 'horta', acao: 'na flor' },
  ativar: { tipo: 'reativar', especie: 'jatai', onde: 'jardim' },
  revisao: { status: 'rascunho', fonte: '', revisor: '' } });

Relacao({ id: 'sauva-cultiva-fungo', de: 'formiga-sauva', tipo: 'cultiva', para: 'Fungo do formigueiro',
  texto: 'Ela leva o pedaço de folha para dentro do formigueiro. A folha vira adubo para o fungo que alimenta a colônia.',
  prova: { tipo: 'ver-acao', area: 'rota', acao: 'com a folha' },
  revisao: { status: 'rascunho', fonte: '', revisor: '' } });

Relacao({ id: 'lagartixa-come-mosquito', de: 'lagartixa', tipo: 'come', para: 'Mosquitos',
  texto: 'Ela espera parada perto da lâmpada e, num bote rápido, pega um mosquito.',
  prova: { tipo: 'ver-acao', area: 'base', acao: 'caçando' },
  revisao: { status: 'rascunho', fonte: '', revisor: '' } });

Relacao({ id: 'sapo-come-mosquito', de: 'sapo-cururu', tipo: 'come', para: 'Mosquitos',
  texto: 'De noite, na beira da água, o sapo come mosquitos e outros insetos.',
  prova: { tipo: 'ativar' },
  ativar: { tipo: 'soltar', especie: 'sapo-cururu', fase: 'adulto', onde: 'vereda' },
  revisao: { status: 'rascunho', fonte: '', revisor: '' } });
