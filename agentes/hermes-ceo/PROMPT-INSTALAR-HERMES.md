Quero instalar na minha VPS o **Hermes Agent** (Nous Research) para atuar como "CEO" do meu projeto Bio no Bolso: um agente que me ajuda a priorizar, acompanhar números e cobrar prazos, conversando comigo pelo Telegram. Use a documentação oficial como referência: https://hermes-agent.nousresearch.com/docs. Confira nela os comandos e caminhos exatos em vez de supor.

Nesta VPS também roda (ou vai rodar) o banco Postgres `bionobolso`, que no futuro terá dados de crianças. O agente precisa ficar **isolado** desse banco e do resto do servidor.

## Antes de instalar
1. Verifique RAM, disco, sistema e o que já roda. Me mostre o plano antes de executar.
2. Não altere nem pare nada que já esteja rodando sem me perguntar.

## Instalação isolada
- Crie um usuário Linux próprio, `hermes`, **sem sudo** e sem acesso a `/opt/bionobolso` (em especial ao `.env` com as senhas do banco). Confirme isso testando a leitura com esse usuário.
- Instale o Hermes com o instalador oficial, rodando **como o usuário `hermes`**, não como root.
- Deixe o Hermes rodando como serviço (systemd ou o que a documentação recomendar), reiniciando sozinho se cair.
- Ligue a **aprovação de comandos** e o isolamento em contêiner, se a documentação oferecer. O agente não pode executar comandos de terminal sem a minha aprovação.

## Modelo de IA
- Use o Claude como modelo, pela API da Anthropic ou pelo OpenRouter (veja o que a documentação suporta). Me diga onde colocar a chave de API. **Não peça para eu colar a chave na conversa:** me explique como eu mesmo coloco no arquivo de configuração.
- Me diga como acompanhar o gasto e como pôr um limite mensal na conta do provedor.

## Telegram
- Configure o gateway do Telegram. Me guie para criar o bot no @BotFather.
- O bot deve responder **só a mim**: restrinja pelo meu ID de usuário do Telegram e me ensine a descobri-lo.

## Personalidade e contexto
Vou enviar dois arquivos para a VPS:
- `SOUL.md`: a personalidade e os limites do CEO
- `CONTEXTO.md`: o contexto do projeto (decisões, planos, cronograma, riscos)

Me diga o comando `scp` para enviá-los do meu Windows, saindo da pasta `C:\Users\Luis Filipe\Desktop\NOVO\hermes-ceo`. Depois, coloque cada um onde a documentação manda: o `SOUL.md` como persona e o `CONTEXTO.md` como arquivo de contexto do projeto. Os dois são de leitura para o agente; só eu altero.

## Acesso ao banco (só leitura)
- Quando o banco `bionobolso` existir, dê ao agente acesso **apenas** com o usuário `bio_leitura`.
- Crie, como `bio_admin`, um schema `relatorios` com views agregadas. Exemplos: total de espécies-alvo, fichas por status, fotos aprovadas e pendentes, espécies sem foto, e mais tarde contagem de assinantes por plano e receita do mês.
- O agente lê só essas views. Revogue dele o acesso direto às tabelas de usuários, perfis, observações e identificações, quando existirem.
- Guarde a senha do `bio_leitura` num arquivo legível só pelo usuário `hermes`.

## Rotinas agendadas
Configure no agendador do Hermes, com entrega no Telegram:
- **Segunda, 8h (America/Sao_Paulo):** "Plano da semana: as 3 prioridades, o que ficou da semana passada e o principal risco."
- **Sexta, 17h:** "Relatório da semana: o que andou, números do banco pelas views de relatórios e atrasos contra o cronograma do CONTEXTO.md."

## Teste final
1. Mande pelo Telegram: "Quem é você e qual a prioridade número 1 desta semana?" A resposta deve vir no papel de CEO do Bio no Bolso, citando o portão de cobrança.
2. Peça a ele para ler o arquivo `/opt/bionobolso/.env`. Isso tem que falhar.
3. Peça a ele para fazer um INSERT no banco. Isso tem que falhar.

## No final, me entregue
- Onde está cada arquivo (configuração, persona, contexto, memória, logs).
- Como reiniciar, atualizar e desligar o Hermes.
- Como ver o que ele fez (log de comandos e conversas).
- Riscos ou pendências que você encontrou.
