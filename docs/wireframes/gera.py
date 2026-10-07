import html, datetime
from telas import SECOES
E=html.escape
def el(e):
    t=e[0]
    if t=='bar': return f'<div class="bar"><b>{E(e[1])}</b><span>{E(e[2])}</span></div>'
    if t=='h': return f'<div class="h">{E(e[1])}</div>'
    if t=='h2': return f'<div class="h2">{E(e[1])}</div>'
    if t=='p': return f'<div class="p">{E(e[1])}</div>'
    if t=='btn': return f'<div class="btn{" pri" if e[2] else ""}">{E(e[1])}</div>'
    if t=='img': return f'<div class="img" style="height:{e[2]}px"><span>{E(e[1])}</span></div>'
    if t=='grid': return '<div class="grid">'+''.join('<i></i>' for _ in range(e[1]))+'</div>'
    if t=='chips': return '<div class="chips">'+''.join(f'<i>{E(c)}</i>' for c in e[1])+'</div>'
    if t=='list': return '<div class="list">'+''.join(f'<div>{E(x)}</div>' for x in e[1])+'</div>'
    if t=='input': return f'<div class="input">{E(e[1])}</div>'
    if t=='nav': return '<div class="nav"><i>Explorar</i><b>Encontrar</b><i>Meu Bolso</i><i>Missões</i></div>'
    if t=='toast': return f'<div class="toast">{E(e[1])}</div>'
    if t=='card': return f'<div class="card">{E(e[1])}</div>'
    if t=='row': return '<div class="row">'+''.join(f'<i>{E(x)}</i>' for x in e[1])+'</div>'
    if t=='progress': return f'<div class="prog"><span>{E(e[1])}</span><i></i></div>'
    if t=='side': return '<div class="side">'+''.join(f'<i>{E(x)}</i>' for x in e[1])+'</div>'
    if t=='lupi': return f'<div class="lupi"><b>Lupi</b>{E(e[1])}</div>'
    if t=='pill': return f'<div class="pill">{E(e[1])}</div>'
    if t=='dots': return '<div class="dots">'+'<i class="on"></i>'+'<i></i>'*(e[1]-1)+'</div>'
    if t=='cam': return '<div class="cam"><i></i><b></b></div>'
    if t=='dark': return ''
    if t=='dim': return ''
    return ''
ST={'E':('●','já existe'),'P':('◐','parcial'),'N':('○','novo')}
def tela(t):
    id_,nome,st,srv,els,nota=t
    cls='tela'+(' escura' if els and els[0][0]=='dark' else '')+(' dim' if els and els[0][0]=='dim' else '')
    s=ST[st]
    return (f'<div class="slot"><div class="cab"><b>{id_}</b> {E(nome)}</div>'
            f'<div class="{cls}">'+''.join(el(e) for e in els)+'</div>'
            f'<div class="tags"><span>{s[0]} {s[1]}</span>'+('<span class="srv">⚙ precisa de servidor</span>' if srv else '')+'</div>'
            f'<div class="nota">{E(nota)}</div></div>')
CSS=open('wf.css').read()
pags=[]
hoje=datetime.date.today().strftime('%d/%m/%Y')
tot=sum(len(s[3]) for s in SECOES)
pags.append(f'''<section class="pag capa"><div><small>BICHO NO BOLSO</small><h1>Wireframes do produto</h1>
<p>Mapa de telas de ponta a ponta: site público, primeiro uso, app da criança, área do responsável, escola e estados especiais.</p>
<p class="meta">v1.0 · {hoje} · {tot} telas · sem identidade visual (só hierarquia, fluxo e navegação)</p></div>
<div class="legenda"><b>Como ler</b><div>● já existe no site hoje</div><div>◐ existe em parte</div><div>○ novo</div><div>⚙ precisa de servidor (conta, fotos, assinatura)</div><div>→ caminho entre telas</div></div></section>''')
pags.append('''<section class="pag"><h2>Decisões que guiam tudo</h2><div class="cols">
<div><h3>Produto</h3><ul><li><b>A criança brinca sem conta.</b> O adulto só entra para guardar/sincronizar, gerenciar perfis ou assinar.</li>
<li>Conta pertence ao <b>responsável</b>; criança tem só apelido + avatar.</li><li>Conhecimento básico sobre os animais nunca fica atrás de paywall.</li>
<li>Cobrança só <b>depois do hábito</b> (ex.: após 3 descobertas). Botão "continuar grátis" sempre visível.</li>
<li>Escola compra por <b>piloto + contrato anual</b>, não por checkout.</li></ul></div>
<div><h3>Jogo</h3><ul><li>Recompensa <b>descobrir e aprender</b>, não tempo de tela.</li><li>Cartas, coleções, missões, níveis e conquistas.</li>
<li>Bicho repetido = nova observação no diário da carta.</li><li><b>Sem</b> moedas, loot box, roleta, streak que pune, ranking público, chat aberto, "volte em 3 horas".</li>
<li>Identificação por foto diz "parece ser…" e nunca inventa certeza.</li></ul></div>
<div><h3>Segurança e dados</h3><ul><li>Portão parental antes de conta, compra e configurações.</li><li>Coletar o mínimo; localização nunca pública.</li>
<li>Exclusão e exportação de dados simples.</li><li>Revisão de LGPD e proteção de crianças <b>antes</b> de lançar fotos e contas.</li>
<li>Funciona offline (já é PWA). Infra de servidor (ex.: Supabase/Firebase) só depois de fechar estes fluxos.</li></ul></div></div>
<h3>Métrica que importa primeiro</h3><p class="destaque">animal_opened → first_discovery → second_discovery → account_created → subscription_started<br><b>De 20 crianças que encontram o 1º bicho, quantas querem o 2º?</b></p></section>''')
pags.append('''<section class="pag"><h2>Mapa geral</h2><div class="mapa">
<div class="lin"><i>VISITANTE<br><small>Google · QR · indicação · redes</small></i></div><div class="sx">↓</div>
<div class="lin"><i>EXPLORAR</i><em>→</em><i>ANIMAL</i><em>→</em><i>3D</i><em>·</em><i>COMPARAR</i></div><div class="sx">↓</div>
<div class="lin"><i>ENCONTRAR</i><em>→</em><i>FOTO</i><em>→</em><i>DESCOBERTA</i><em>→</em><i>NOVA CARTA</i></div><div class="sx">↓ (quando quiser guardar/sincronizar)</div>
<div class="lin"><i>PORTÃO ADULTO</i><em>→</em><i>CRIAR CONTA</i><em>→</em><i>CRIAR PERFIL</i><em>→</em><i>QUEM VAI EXPLORAR?</i></div><div class="sx">↓</div>
<div class="lin"><i class="forte">MEU BOLSO</i></div><div class="sx">↙ ↓ ↘</div>
<div class="lin"><i>COLEÇÕES</i><i>MISSÕES</i><i>CONQUISTAS</i><i>PASSAPORTE</i></div><div class="sx">↓ (depois do hábito)</div>
<div class="lin"><i>LIMITE GRÁTIS</i><em>→</em><i>PLANO FAMÍLIA</i></div></div>
<div class="lado"><h3>Fora do fluxo da criança</h3><p><b>Responsável:</b> painel · perfis · assinatura · privacidade/fotos · histórico · configurações · exportar/excluir.</p>
<p><b>Escola:</b> /escolas → professor → turma → missão → QR da turma → álbum coletivo → resultados.</p>
<h3>Navegação do app</h3><div class="navx"><i>Explorar</i><b>Encontrar</b><i>Meu Bolso</i><i>Missões</i></div><p>Perfil no avatar (canto superior). Encontrar no centro, maior: é a ação principal.</p></div></section>''')
for letra,titulo,desc,telas in SECOES:
    for k in range(0,len(telas),4):
        grupo=telas[k:k+4]
        miolo='<em class="seta">→</em>'.join(tela(t) for t in grupo)
        cab=f'<h2>{letra} · {E(titulo)}</h2><p class="desc">{E(desc)}</p>' if k==0 else f'<h2>{letra} · {E(titulo)} <small>(continuação)</small></h2>'
        pags.append(f'<section class="pag">{cab}<div class="fluxo">{miolo}</div></section>')
pags.append('''<section class="pag"><h2>Ordem sugerida de implementação</h2><ol class="ordem">
<li><b>Já feito (estático, sem servidor):</b> A1–A3, A5, B1, B3–B5, C2, C3, C9 · offline · cartas · pistas · níveis · "Encontrei um!" pela lista.</li>
<li><b>Próximo, ainda sem servidor:</b> A4/C4 Modo Explorar (3D) · B2 onboarding · C10 coleções · C12 mais missões · C13 conquistas · F1/F5/F6 com Lupi · página por bicho (SEO) · /familias e /escolas (A6, A7, A9).</li>
<li><b>Piloto em escola:</b> roteiro de aula (docs/PILOTO.md) · E6 código/QR da turma em modo simples · coletar feedback de professores.</li>
<li><b>Com servidor (depois da revisão de LGPD):</b> B6–B10 contas e perfis · D1–D7 área do responsável · C5–C8 foto e identificação · C11 diário com fotos · C14 passaporte · E2–E8 escola completa.</li>
<li><b>Monetização:</b> A8 preços · F7–F10 limite, paywall, assinatura e cancelamento.</li></ol>
<p class="rod">Documento gerado a partir do repositório (docs/wireframes). Para mudar uma tela, edite docs/wireframes/telas.py e gere de novo.</p></section>''')
n=len(pags)
pags=[p.replace('</section>',f'<span class="num">{i+1}/{n}</span></section>') for i,p in enumerate(pags)]
open('wf.html','w').write(f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Wireframes · Bicho no Bolso</title><style>{CSS}</style></head><body>'+''.join(pags)+'</body></html>')
print(n,'páginas')
