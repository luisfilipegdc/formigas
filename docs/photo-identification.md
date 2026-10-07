# Descobrir por foto e contribuições

> **Nada deste documento está implementado.** O recurso precisa de servidor, de um mecanismo de reconhecimento e de revisão de LGPD e proteção infantil antes de existir.
> Marcas: **DECIDIDO** · **PROPOSTA** · **HIPÓTESE** · **PENDENTE**.
> Direção em [`product-direction.md`](product-direction.md). Modelo do catálogo em [`catalog-model.md`](catalog-model.md).

---

## 1. Princípio

**DECIDIDO:** o reconhecimento comunica **probabilidade, não certeza**.
- Nunca força o nível de espécie.
- Nunca chuta um nome quando não há segurança.
- Nunca fabrica conteúdo para um item sem ficha.

## 2. Fluxo

```
📷 FOTO
   ↓
Análise
   ↓
"Parece ser…"
   ↓
┌──────────────────────────────┐
│ Possibilidade 1  (foto + nível: espécie / gênero / família / grupo)
│ Possibilidade 2
│ Possibilidade 3
└──────────────────────────────┘
   ↓
Usuário confirma  ·  "Não é nenhum desses"
   ↓
ficha do catálogo → descoberta no Meu Bolso
```

**PROPOSTA:**
- Cada possibilidade mostra a **foto do catálogo** (ou uma foto de referência licenciada) ao lado da foto tirada, para comparar.
- Cada possibilidade mostra o nível ("é uma **joaninha**, família Coccinellidae") e não uma porcentagem crua.
- No 🧸 Pequeno, uma possibilidade por vez: "É esse?" Sim / Não.

## 3. Os três casos

| Caso | O que a pessoa vê | O que acontece |
|---|---|---|
| **A. Provável + ficha existe** | "Parece ser uma **joaninha**." + **Conhecer esta descoberta** | Confirmou → abre a ficha e marca a descoberta no Meu Bolso (o mesmo `vi`, "Encontrei de verdade", que já existe). "Não é" → próximas possibilidades ou busca manual |
| **B. Provável + ficha ainda não existe** | "Parece ser uma **samambaia**. Ainda não temos uma ficha completa." | Mostra só o nome e o nível identificados, e um parente com ficha, se houver. Oferece guardar no Meu Bolso como **observação sem ficha** e, com autorização, contribuir (§5). **Nenhum conteúdo é gerado** |
| **C. Inconclusivo** | "Não conseguimos identificar com segurança." + dicas: chegar mais perto, mostrar a folha ou o corpo inteiro, luz natural, outro ângulo | Tentar de novo, procurar pela busca ou guardar como "não identificada" |

**DECIDIDO:** quando a espécie não é defensável, aceita-se uma identificação mais ampla (gênero, família, grupo).
- O catálogo já tem fichas nesses níveis: joaninha (família) e beija-flor (família).
- O campo `nivel` ([`catalog-model.md`](catalog-model.md) §2) liga cada resultado à ficha certa.

## 4. Limites por universo

| Universo | O que comunicar | `foto.reconhecivel` |
|---|---|---|
| Animais | Funciona melhor com o bicho inteiro e parado. Insetos parecidos podem ficar só em família | sim |
| Plantas | Folha, flor e fruto ajudam. Muitas plantas só no gênero | sim |
| Fungos | Muitos cogumelos só se distinguem com exame. **O app nunca diz se é comestível**, e a ficha avisa: "Nunca coma cogumelos do mato" | limitado |
| **Bactérias e vírus** | **Não prometer reconhecimento por foto comum.** São pequenos demais para a câmera. Uma foto de bolor ou de colônia mostra o conjunto ou o efeito, não o microrganismo. Mensagem: "Bactérias e vírus são pequenos demais para uma foto de celular. Veja como eles são no Micromundo." | **nao** |
| **Rochas e minerais** | **Avisar dos limites antes e depois.** A cor engana. A identificação de verdade usa dureza, risco, brilho e densidade. O resultado vem como "pode ser…", com um teste simples para confirmar (ex.: "Risca o vidro? Pode ser quartzo."), feito com um adulto | limitado |
| Fenômenos | Fora do escopo nesta fase (talvez nuvens e arco-íris mais tarde) | nao |

## 5. Contribuições

**DECIDIDO:** **descoberta pessoal ≠ contribuição ao catálogo.**
- Fotografar algo não significa que a imagem vai alimentar conteúdo público.
- Contribuir é uma escolha separada, com autorização.

```
OBSERVAÇÃO
    ↓
Meu Bolso            ← fica só com a pessoa (padrão)
    ↓
[autoriza contribuição?]   ← só o adulto responsável
    ↓
Recebida
    ↓
Aguardando revisão
    ↓
Identificada
    ↓
Vinculada ao catálogo
        ↘ Não aproveitada (motivo gentil: foto pouco nítida, já temos fotos suficientes…)
```

**DECIDIDO:**
- **Nada de publicação científica automática.** A sugestão passa por revisão humana.
- **Sem fichas duplicadas.** A contribuição é ligada a um item existente ou a um táxon (ex.: o ID de táxon do iNaturalist). Uma ficha nova só nasce por decisão editorial.
- **Autoria e permissões preservadas:** autor, licença e data ficam guardados com cada imagem.
- **Contribuir não promete** ficha nova nem modelo 3D.

**PROPOSTA:**
- **Quem autoriza:** só a conta do adulto. Criança não aceita termos nem escolhe licença.
- **Licença:** o adulto escolhe CC BY, CC BY-SA ou CC0, e o nome no crédito (pode ser apelido). Sem licença aberta, a foto pode ajudar na identificação interna, mas não é publicada.
- **Retorno honesto:** "Sua foto ajudou a identificar uma samambaia!". Sem ranking entre crianças.
- **Exclusão:** o adulto pode retirar a contribuição. Se ela já estiver publicada, a imagem sai do catálogo na próxima atualização.

**PENDENTE:**
- Contribuir exige assinatura?
- Quem revisa, e com que tempo de resposta?

## 6. Privacidade e proteção infantil

**DECIDIDO:** nada disto vai ao ar sem revisão de LGPD (art. 14) e de proteção infantil.

**PROPOSTA:**
- A foto é tirada pelo adulto, ou pela criança com o adulto ao lado, dentro de um perfil infantil (**PENDENTE:** se a criança pode usar a câmera).
- **Por padrão, a foto não fica guardada** no servidor depois da análise. Só fica se o adulto escolher contribuir.
- **Localização exata removida** da foto (EXIF). Se for usada, é aproximada (cidade) e com consentimento.
- **Foto com pessoa:** se parecer haver uma pessoa, o app não envia e explica por quê.
- Nenhum dado de reconhecimento é usado para publicidade. O app continua sem anúncios.

## 7. Mecanismo de reconhecimento

**PENDENTE:** escolher depois do teste técnico interno (Etapa 6 de [`product-direction.md`](product-direction.md) §8).

**HIPÓTESE:** opções a comparar (verificar termos de uso comercial, custo, privacidade e precisão com fotos brasileiras):
- modelo de visão do iNaturalist (não tem API aberta; exige parceria);
- Pl@ntNet (só plantas);
- modelos multimodais gerais (risco de "inventar" nome; exigem filtro por nível de confiança);
- modelo próprio, treinado com fotos licenciadas.

**PROPOSTA de teste antes de qualquer público:**
- conjunto de fotos de teste das 13 espécies do catálogo, mais itens que **não** estão nele;
- medir precisão por nível, porcentagem de casos A, B e C, tempo de resposta no 4G e custo.

## 8. O que medir antes de definir preço

**HIPÓTESE do fundador:** R$ 9,90 ou R$ 19,90 por mês. Nada de uso ilimitado antes destes números.

| Custo / sinal | Como medir |
|---|---|
| Custo por tentativa | Chamada de reconhecimento + envio e redução da imagem |
| Repetição | Tentativas até confirmar (o caso C gera repetição) |
| Armazenamento | Tamanho médio × fotos guardadas (só contribuições) × tempo |
| Revisão | Minutos de revisor por contribuição × custo da hora |
| Suporte e moderação | Pedidos de exclusão, denúncias, dúvidas |
| Uso | Reconhecimentos por usuário ativo por mês; distribuição (poucos usuários pesados?) |
| Valor percebido | Entrevistas: o que a família pagaria pelo conjunto (reconhecimento + bolso sincronizado + experiências) |

**DECIDIDO:** a cobrança real só entra no experimento comercial (Etapa 8), depois desses dados.
