# Bio no Bolso · identidade visual v2 (outubro de 2026)

Substitui as artes antigas com o nome "Bicho no Bolso" e "Encontre um Bicho" (`img/marca/bnb-*`, `design/`), que não usam mais o nome do app.

## Ideia
**A natureza em 3D, no seu bolso.** O símbolo é um bolso costurado com um broto saindo e um sol pequeno: a vida que cabe no bolso e cresce quando a criança explora.

## Símbolo e nome
- `img/marca/simbolo.svg`: símbolo colorido (bolso verde, costura em verde-broto, folhas, sol). Use em cabeçalho, rodapé e abertura.
- `img/marca/simbolo-icone.svg`: versão de ícone (fundo verde, bolso creme). Gera os ícones do app em `img/icone/` (192, 512, maskable, apple-touch, favicon).
- O nome é texto, não imagem: `<span class="marca-nome">Bio <i>no</i> Bolso</span>`, em **Fredoka 700**. "Bio" e "Bolso" em verde-floresta, "no" menor, em terra. Sobre fundo verde: nome branco e "no" em sol.
- Componente pronto em `css/marca.css`: `<a class="marca"><img src="img/marca/simbolo.svg"><span class="marca-nome">…</span></a>`.
- Área de respiro: metade da altura do símbolo em volta. Tamanho mínimo do símbolo: 32 px.
- Não usar: símbolo esticado, sombras pesadas, nome em outra fonte, o "no" do mesmo tamanho.

## Cores (variáveis em `css/marca.css`)
| Nome | Hex | Uso |
|---|---|---|
| Verde-floresta | `#12503B` | títulos, nome, contornos |
| Verde Bio | `#22A06B` | símbolo, ícones |
| Verde de botão | `#1E8A5A` | botão principal (texto branco, contraste AA) |
| Broto | `#9BD84E` | descoberta, progresso, costura |
| Sol | `#FFC53D` | chamada para ação, 3D, recompensa |
| Céu | `#3FA7E0` | micromundo, informação |
| Terra | `#E8774A` | destaque em títulos, o "no" |
| Creme | `#FFF9EF` | fundo |
| Tinta | `#22302A` | texto |
| Tinta suave | `#5E6B64` | texto secundário |
| Linha | `#EDE3CF` | bordas |

## Tipografia
- **Fredoka** (600–700): nome e títulos (`--font-titulo`). `h1`, `h2` e `h3` já usam.
- **Nunito** (600–900): texto e botões (`--font`).
- Texto corrido com no mínimo 16 px.

## Onde já está aplicada
Página inicial (Biblioteca 3D), abertura e boas-vindas, página dos bichos (`bichos.html`), QR para imprimir, ícones do app e manifesto. A página 3D dos bichos (`bicho3d.html`) e o comparador seguem com o visual antigo e podem migrar depois.
