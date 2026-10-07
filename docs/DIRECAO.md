# Direção do projeto: enciclopédia interativa da natureza

> Documento de direção. Atualizado em outubro de 2026.
> Cada item está marcado como **✅ Decidido**, **💡 Proposta** (sugestão a validar) ou **❓ Pendente** (precisa de decisão do fundador ou de teste).
> Nada aqui descreve recurso pronto, a não ser quando está escrito "**já existe**".

Documentos ligados:
- [`PROPOSTA-CATALOGO.md`](PROPOSTA-CATALOGO.md): auditoria do código, modelo de catálogo, mapa de telas e adaptações.
- [`PLANO.md`](PLANO.md): etapas de implementação e backlog do 3D.
- [`ESTRATEGIA.md`](ESTRATEGIA.md) e [`PILOTO.md`](PILOTO.md): documentos da fase "catálogo de animais". Continuam valendo nos princípios (ética, sem anúncios, piloto com escolas), mas o escopo foi ampliado por este documento.

---

## 1. De onde viemos

O projeto nasceu como **Museu das Formigas 3D**, virou **Catálogo 3D de Animais** e hoje é publicado como **Bicho no Bolso** (endereço temporário: https://formigas-beta.vercel.app/).

**Já existe:**
- catálogo de 13 animais, com ficha, ciclo de vida, curiosidades e 3 fotos reais licenciadas cada;
- 3D da formiga-saúva, da abelha-europeia, da cigarra-gigante e da aranha-de-teia-dourada;
- "Por Dentro do Bicho" (protótipo, só na cigarra);
- Meu Bolso, níveis, coleções e "Encontrei um de verdade!", tudo guardado só no aparelho;
- comparador, PWA que funciona sem internet, identidade visual e o mascote Curu.

## 2. Nova direção

✅ **Decidido:** a visão passa a ser uma **enciclopédia interativa da natureza**, inspirada na abrangência de uma enciclopédia Barsa. Ela combina:
- exploração visual;
- áudio;
- reconhecimento por fotografia;
- participação dos usuários.

✅ **Decidido:** a implementação é **por etapas**:
- não criar fichas vazias em massa;
- não inventar conteúdo para preencher o catálogo;
- uma ficha só entra quando tem texto, fontes e fotos com licença.

### Nome
- ✅ **Nome de trabalho:** **Natureza no Bolso**.
- ❓ **Pendente:** validar domínio e marca (INPI, registro.br, redes sociais).
- ✅ **Decidido:** até essa validação, **não alterar** domínio, repositório, projeto na Vercel, manifesto do app nem o nome publicado. O site continua aparecendo como **Bicho no Bolso**.
- 💡 **Proposta:** "Bicho no Bolso" pode continuar como nome da coleção de animais dentro da marca maior. Exemplo: "Natureza no Bolso › Bichos".

## 3. Escopo do conteúdo

✅ **Decidido:** seis **categorias de navegação**:

| Categoria | Exemplos de grupos dentro dela | Observação científica |
|---|---|---|
| 🐾 Animais | insetos, aracnídeos, aves, mamíferos, répteis, anfíbios, peixes | É a única categoria com conteúdo hoje |
| 🌿 Plantas | árvores, flores, ervas, samambaias, musgos | Seres vivos (reino Plantae) |
| 🍄 Fungos | cogumelos, bolores, leveduras, liquens | Não são plantas. Os liquens são associação de fungo com alga ou cianobactéria |
| 🔬 Mundo microscópico | bactérias, protozoários, microalgas, vírus | Bactérias e protozoários são seres vivos. **Vírus não são células** e o seu status de "ser vivo" é debatido: a ficha diz isso. Microrganismos não são um grupo taxonômico |
| 🪨 Rochas e minerais | minerais, rochas ígneas, sedimentares e metamórficas, fósseis (❓) | Não são seres vivos. Mineral ≠ rocha (a rocha é feita de minerais) |
| 🌦️ Fenômenos e processos | ciclo da água, fotossíntese, arco-íris, erosão, polinização, decomposição | Não são "coisas": a ficha descreve um processo |

✅ **Decidido:** essas categorias são **organização editorial**, não classificação taxonômica.
- A classificação científica (domínio, reino, filo…) fica num campo separado e só existe para seres vivos.
- "Mundo microscópico" agrupa por **tamanho** (precisa de microscópio), não por parentesco. A ficha deixa isso claro.
- ❓ **Pendente:** onde ficam os fósseis (rochas? animais extintos?) e os seres humanos/corpo humano, se entrarem.

## 4. Identidade

✅ **Decidido:**
- O **Curu** continua mascote e guia, em todas as categorias.
- A paleta (`--forest`, `--leaf`, `--lime`, `--adventure`, `--terracotta`, `--cream`, `--brown`) e a direção visual continuam.
- **"Meu Bolso"** continua sendo a coleção pessoal.

✅ **Decidido:** os textos se adaptam a **natureza**, **descobertas** e **elementos naturais** conforme o contexto, **sem trocar "animal" ou "bicho" mecanicamente**:
- onde o assunto é um animal, "bicho" continua ("Encontrei um bicho!", "Bichos do jardim");
- onde o texto vale para qualquer categoria, usa-se "descoberta" ou "elemento da natureza".

O inventário das frases está em `PROPOSTA-CATALOGO.md` §5.

## 5. Experiência de cada ficha

✅ **Decidido:** a ficha tem até seis partes:

1. **O que é?** Frase de abertura, foto e dados rápidos.
2. **Por fora:** aparência e estruturas externas.
3. **Por dentro:** corte ou transparência para ver estruturas internas.
4. **Como funciona:** processos animados e narrados.
5. **Relações:** ligações com outros elementos da natureza (come, é comido por, poliniza, vive em, forma, se transforma em).
6. **Fontes e revisão:** de onde vem cada informação, quem revisou e o estado de revisão.

✅ **Decidido:**
- Só aparecem as partes **que existem** para aquela ficha. Uma ficha **não precisa ter 3D** para existir.
- "Por dentro" e "Como funciona" podem ser 3D, ilustração, foto, vídeo ou texto narrado.

💡 **Proposta:** no modo 🧸 Pequeno, mostrar no máximo 3 partes por vez (O que é? · Por fora · Como funciona) e frases curtas lidas em voz alta. No modo 🧒 Explorador, mostrar as seis partes.

**Já existe** e será reaproveitado:
- os três modos do 3D (🐾 Por fora · 🫀 Por dentro · ▶️ Como funciona?) e o seletor Pequeno / Explorador;
- as abas atuais Ficha, Vida, Sabia? e Real. O mapeamento para as seis partes está em `PROPOSTA-CATALOGO.md` §4.

### Estado de revisão do conteúdo
✅ **Decidido:** todo conteúdo mostra seu estado de revisão.

💡 **Proposta** de estados:
- **rascunho:** não aparece para o público;
- **em revisão:** aparece com o aviso "Conteúdo simplificado, em revisão científica.";
- **revisado:** aparece com o nome de quem revisou e a data.

⚠️ **Situação atual (honesta):**
- Os textos das 13 fichas foram escritos pela equipe com apoio de IA, a partir de fontes gerais (Wikipédia, iNaturalist), e **não passaram por revisão de especialista**. Na migração, todas entram como **"em revisão"**.
- O "Por dentro" da cigarra é uma **representação didática simplificada**. A posição e a forma dos órgãos são aproximadas.

## 6. Evolução do 3D

Backlog completo e regras de validação em [`PLANO.md`](PLANO.md) §3.

✅ **Decidido:**
- Os itens do backlog são **planejados, não implementados**.
- Antes de modelar, validar espécie, casta, anatomia e processo com fonte e, se possível, com especialista.
- Todo modelo informa se é **representação didática simplificada** ou **anatomia fiel**.

## 7. Reconhecimento por foto

> ❓ **Nada disto está implementado.** Precisa de servidor, de um fornecedor ou modelo de reconhecimento e de revisão de LGPD/proteção infantil antes de existir.

### Fluxo desejado
```
Foto → possíveis identificações → confirmação ou revisão → ficha do catálogo → descoberta no Meu Bolso
```

### Três casos, tratados separadamente

| Caso | O que a pessoa vê | O que acontece |
|---|---|---|
| **A. Identificação provável + ficha existe** | "Parece uma **joaninha** (família Coccinellidae)." Mostra a foto dela ao lado da foto do catálogo e pergunta: "É esse mesmo?" | Confirmou → abre a ficha e marca "Encontrei um de verdade!" no Meu Bolso. "Não é" → mostra as outras possibilidades |
| **B. Identificação provável + ficha ainda não existe** | "Parece uma **samambaia** (grupo das samambaias). Ainda não temos ficha dela." | Mostra só o nome e o nível encontrados, mais um parente próximo que já tenha ficha, se houver. Oferece "Guardar no Meu Bolso como descoberta sem ficha". Com autorização, oferece "Sugerir para o catálogo" (ver §8). **Não cria ficha automática** |
| **C. Inconclusivo** | "Não consegui reconhecer com segurança." Dá dicas concretas: chegar mais perto, mostrar a folha inteira, ter luz natural, foto de cima | Pode tentar de novo, escolher manualmente pela busca ou guardar a foto como "não identificada". **Nunca chuta um nome** |

### Regras
✅ **Decidido:**
- **Não forçar espécie.** O resultado para no nível em que há confiança: espécie, gênero, família ou grupo ("é uma aranha", "é um cogumelo"). Hoje o próprio catálogo já tem fichas em nível de família (joaninha, beija-flor).
- **Bactérias e vírus:** não prometer reconhecimento por foto comum. São pequenos demais para uma câmera de celular. Uma foto de bolor ou de colônia numa placa mostra o **efeito** ou o **conjunto**, não o microrganismo. Nessa categoria, o reconhecimento fica fora do escopo.
- **Rochas e minerais:** comunicar os limites antes e depois da foto. A identificação visual é incerta: a cor engana e a identificação de verdade usa dureza, risco, brilho e densidade. O resultado sempre vem como "pode ser…", com a sugestão de um teste simples que ajuda a confirmar.

💡 **Proposta:**
- **Proteção da criança:** quem tira a foto é o adulto, ou a criança com o adulto ao lado, dentro de um perfil infantil.
- **Foto de pessoa:** se a foto parece ter uma pessoa, o app não envia e explica por quê.
- **Guardar fotos:** por padrão, a foto **não fica guardada** no servidor depois da identificação. Ela só é guardada se o adulto escolher contribuir (ver §8).
- **Localização:** a localização exata é removida da foto (EXIF). Se for usada, é só aproximada (cidade) e com consentimento.

❓ **Pendente:**
- Escolher o mecanismo de reconhecimento. Opções a avaliar:
  - modelo de visão do iNaturalist, que exige parceria e não tem API aberta;
  - Pl@ntNet, só para plantas;
  - modelos multimodais gerais, com risco de "inventar" nome;
  - modelo próprio.
  Avaliar em cada um: termos de uso comercial, custo, precisão com fotos brasileiras e privacidade.
- Medir a precisão com um conjunto de teste de fotos das espécies que já estão no catálogo **antes** de mostrar o recurso ao público.

## 8. Contribuições

> ❓ **Não implementado.** Depende de contas de adulto, servidor, moderação e revisão de LGPD.

✅ **Decidido:**
- Com autorização apropriada, uma observação pode ajudar a melhorar o catálogo.
- A sugestão **nunca** vira conteúdo científico publicado automaticamente.
- Evitar fichas duplicadas.
- Guardar quem é o autor da imagem e a permissão de uso dela.
- Contribuir **não** significa promessa de virar ficha nem modelo 3D.

💡 **Proposta:**
- **Estados de uma contribuição:**

  ```
  recebida → aguardando revisão → identificada → vinculada ao catálogo
                                 ↘ não aproveitada (com motivo gentil: foto pouco nítida, já temos fotos suficientes…)
  ```

- **Quem autoriza:** só a conta do adulto. Criança não aceita termos nem escolhe licença.
- **Licença:** o adulto escolhe a licença da foto (CC BY, CC BY-SA ou CC0) e o nome que aparece no crédito, que pode ser um apelido. Sem licença aberta, a foto pode ajudar a identificação, mas não é publicada.
- **Sem duplicação:** a contribuição é ligada a um **táxon** (por exemplo, o ID de táxon do iNaturalist) ou a um elemento já existente. Uma ficha nova só nasce por decisão editorial, quando várias contribuições apontam para o mesmo elemento ausente.
- **Retorno à criança:** o retorno é honesto e sem pressão. Exemplo: "Sua foto ajudou a identificar uma samambaia!". Não há ranking entre crianças.

❓ **Pendente:** contribuir vai exigir assinatura? (ver §9)

## 9. Modelo de negócio: hipótese em teste

> ❓ **Hipótese, não decisão.** Não há cobrança implementada nem planos publicados.

- **Hipótese do fundador:** assinatura da ferramenta de reconhecimento, a **R$ 9,90** ou **R$ 19,90** por mês.
- ❓ **Pendente:** preço, quantidade de reconhecimentos incluídos e benefícios.
- ❓ **Pendente:** se contribuir vai exigir assinatura.

✅ **Decidido:**
- não publicar planos definitivos;
- não implementar cobrança real nesta etapa;
- não oferecer uso ilimitado antes de medir os custos.

💡 **Proposta:** o que medir antes de definir preço.

| Custo | Como medir |
|---|---|
| Por tentativa | Custo médio da chamada de reconhecimento (fornecedor ou servidor próprio), incluindo o envio e a redução da imagem |
| Por repetição | Quantas tentativas uma pessoa faz até confirmar (caso C gera repetição) |
| Armazenamento | Tamanho médio das fotos guardadas × quantas são guardadas (só contribuições) × por quanto tempo |
| Revisão | Minutos de revisor por contribuição × custo da hora do revisor |
| Suporte e moderação | Pedidos de exclusão de dados, denúncias, dúvidas |

💡 **Proposta:**
- **O que vender:** avaliar o reconhecimento **junto com** a coleção (Meu Bolso sincronizado entre aparelhos, perfis da família) e as experiências educativas (processos novos, roteiros para escola) como proposta paga, em vez de vender só "reconhecimentos".
- **O que continua grátis:** a exploração educativa (catálogo, fichas e 3D atuais), sempre.
- **Como testar o preço com ética:** entrevistas com pais e professores e uma lista de espera com o aviso claro "em teste, sem cobrança". **Não** usar "porta falsa" (botão de assinar que leva a nada). Isso reprova no teste do impostor de `ESTRATEGIA.md` §1.
- **Escola:** o plano escola de `ESTRATEGIA.md` §4 e o piloto de `PILOTO.md` continuam como hipótese paralela.

## 10. Públicos e acesso

✅ **Decidido:**
- **Explorar sem cadastro, sempre.** Catálogo, fichas, 3D e Meu Bolso local funcionam sem conta.
- **Conta só do adulto.** As crianças têm **perfis sem e-mail próprio**, criados pelo adulto.
- **Três jeitos de usar:**
  - adulto sozinho (curioso de qualquer idade);
  - família, com o adulto mediando;
  - professor com a turma.
- **Prioridade técnica:** Safari no iPad, toque e funcionamento sem internet para o que não depende de servidor.
- **Sem anúncios. Sem coleta de dados de crianças.** Hoje tudo fica no `localStorage` do aparelho.
- **Revisão antes do servidor:** contas, fotos e assinaturas exigem servidor e revisão de LGPD (art. 14, dados de crianças e adolescentes) e de proteção infantil **antes** de existir.

## 11. Pendências do fundador (resumo)

1. Validar o nome "Natureza no Bolso" (marca e domínio). Decidir se o domínio `encontreumbicho.com.br` ainda vale.
2. Quem faz a revisão científica (biólogo, geólogo, microbiologista) e como ela é registrada.
3. Por qual categoria nova começar (sugestão em `PLANO.md`: 1 planta, 1 fungo e 1 mineral, todos revisados).
4. Mecanismo de reconhecimento e orçamento para o teste de custo.
5. Se contribuir exige assinatura.
6. Preço e benefícios da assinatura, depois das medições.
7. Se a criança pode usar a câmera dentro do perfil infantil, ou só o adulto.
8. Onde entram fósseis e corpo humano.
