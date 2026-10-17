# Terra Codex · rascunho de RIPD e classificação indicativa

> **Rascunho para revisão jurídica.** Base: `reports/Boas práticas de jogabilidade.md` (seções sobre LGPD art. 14, ECA Digital e regras de plataforma). Os artigos do ECA Digital (Lei 15.211/2025, em vigor desde 17/03/2026) e do Decreto 12.880/2026 vieram de resumos de imprensa e escritórios; **conferir no texto oficial** antes de usar.

## 1. O que existe hoje (fatia vertical)

| Item | Situação |
|---|---|
| Dados pessoais da criança | Nenhum. Não há conta, nome, foto, localização, chat nem analytics |
| O que fica no aparelho | Progresso do jogo (`terracodex2`) e ajustes (`terracodex-ajustes`) no `localStorage`. Não sai do aparelho |
| Terceiros | Nenhum SDK de anúncio ou análise. Fontes do Google Fonts são carregadas pelo navegador (avaliar hospedar localmente para não expor IP a terceiros) |
| Monetização | Nenhuma no jogo. Nada aleatório pago (caixa de recompensa) e nada que se compre dentro do jogo pela criança |
| Design | Sem notificações, sem sequência de dias, sem perda por ausência, sem contagem regressiva, sem ranking |

## 2. O que muda com a conta da família (antes de lançar)

| Tratamento | Base legal provável | Medida de proteção |
|---|---|---|
| Conta do adulto (e-mail, senha) | Execução de contrato | Adulto cria; verificação de idade do adulto |
| Perfil da criança (apelido e avatar) | Melhor interesse da criança, com consentimento do responsável (LGPD art. 14; Enunciado ANPD 1/2023 permite outras bases desde que prevaleça o melhor interesse) | Nada de nome real, foto ou data de nascimento completa |
| Progresso salvo na nuvem | Execução do serviço contratado pelo adulto | Minimização: só o que o jogo precisa para continuar |
| Painel da família (tempo de jogo, o que aprendeu) | Interesse da criança e supervisão parental (ECA Digital) | Mostrar ao adulto; avisar à criança que o adulto acompanha |
| Pagamento do Passe da Família | Execução de contrato | Só o adulto, atrás de portão parental; preço e renovação claros; cancelamento tão fácil quanto assinar |

## 3. Riscos e respostas

| Risco | Probabilidade | Resposta |
|---|---|---|
| Coletar dado da criança sem necessidade | Média com a conta | Só apelido; revisão de cada campo novo |
| Design que prende (uso excessivo) | Baixa hoje | Paradas naturais, sem prêmio por voltar em horário certo, painel de tempo para a família |
| Contato com estranhos | Nula hoje | Sem chat; social futuro só por código trocado entre adultos, sem texto livre |
| Compra pela criança | Nula hoje | Portão parental, nenhuma oferta dentro do jogo da criança |
| Conteúdo científico errado | Média | `revisao.status` em toda espécie e relação; revisor antes do lançamento |

## 4. Classificação indicativa (sugestão para o processo no Ministério da Justiça)

**Livre (L)**: sem violência, sem medo intenso, sem linguagem imprópria, sem compras pela criança e sem interação com estranhos. O escorpião aparece com aviso de perigo real ("afaste-se e chame um adulto"), que é conteúdo de segurança. Se um dia houver interação entre usuários, rever a classificação e os descritores de interatividade.

## 5. Próximos passos

1. Revisão por advogado com prática em LGPD e ECA Digital.
2. Hospedar as fontes localmente (sem chamadas a terceiros).
3. Política de privacidade em linguagem para adultos e um resumo em linguagem para crianças.
4. Repetir este RIPD antes da conta da família e antes de qualquer pagamento.
