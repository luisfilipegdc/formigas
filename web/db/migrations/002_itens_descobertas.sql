-- =====================================================================
-- 002 — Catálogo (itens) e Meu Bolso na nuvem (descobertas por conta).
-- "itens" e não "animais": depois recebe plantas, fungos e minerais.
-- O conteúdo dos 13 bichos atuais vem de js/catalogo.js
-- (web/scripts/importar-catalogo.mjs gera o SQL de carga).
-- =====================================================================
begin;

create table if not exists itens (
  id               text primary key,                 -- 'formiga', 'abelha'… (o mesmo id do site)
  universo         text not null default 'animais' check (universo in ('animais', 'plantas', 'fungos', 'micromundo', 'rochas', 'fenomenos')),
  nome             text not null,
  nome_cientifico  text,
  grupo            text not null,                    -- insetos, aves, mamiferos…
  emoji            text,
  taxon_id         bigint references taxons(id),     -- ligação com o banco do iNaturalist, quando houver
  tem_3d           boolean not null default false,
  gratis_3d        boolean not null default false,   -- entra nos 3 bichos 3D do plano grátis
  publicado        boolean not null default true,
  revisao          text not null default 'rascunho' check (revisao in ('rascunho', 'em-revisao', 'revisado')),
  revisado_por     text,
  revisado_em      date,
  dados            jsonb not null default '{}',      -- ficha completa (textos, ciclo, fotos, comparador…)
  ordem            int not null default 0,
  atualizado_em    timestamptz not null default now()
);
create index if not exists itens_grupo on itens(grupo);

-- Meu Bolso: o que cada conta descobriu em cada item.
-- tipo segue o site: 3d, ficha, vida, cur, real, casa, dentro, funciona, vi (viu de verdade)
create table if not exists descobertas (
  conta_id      uuid not null references contas(id) on delete cascade,
  item_id       text not null references itens(id) on delete cascade,
  tipo          text not null check (tipo in ('3d', 'ficha', 'vida', 'cur', 'real', 'casa', 'dentro', 'funciona', 'vi')),
  vezes         int not null default 1 check (vezes between 1 and 10000),
  primeira_em   timestamptz not null default now(),
  ultima_em     timestamptz not null default now(),
  primary key (conta_id, item_id, tipo)
);
create index if not exists descobertas_conta on descobertas(conta_id);

-- leitura do catálogo para relatórios; descobertas são dado pessoal (fora do bio_leitura e do bio_agente)
grant select on itens to bio_leitura;
revoke all on descobertas from bio_leitura;
revoke all on descobertas from bio_agente;

-- números agregados para o CEO (nunca linha por pessoa)
create or replace view relatorios.uso as
select
  (select count(*) from familias)                                  as familias,
  (select count(*) from contas where faixa = 'adulto')             as contas_adulto,
  (select count(*) from contas where faixa <> 'adulto')            as contas_menores,
  (select count(*) from itens where publicado)                     as itens_publicados,
  (select count(*) from itens where tem_3d)                        as itens_3d,
  (select count(*) from itens where revisao = 'revisado')          as itens_revisados,
  (select count(distinct conta_id) from descobertas
     where ultima_em > now() - interval '7 days')                  as contas_ativas_7d,
  (select count(*) from descobertas where tipo = 'vi')             as observacoes_reais,
  now()                                                            as gerado_em;
grant select on relatorios.uso to bio_agente;

insert into migracoes(nome) values ('002_itens_descobertas') on conflict do nothing;
commit;
