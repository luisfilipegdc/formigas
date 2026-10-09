-- =====================================================================
-- Bio no Bolso — banco próprio de biodiversidade (Postgres 15+)
-- Roda em qualquer Postgres: VPS, Supabase ou local.
--   psql "$DATABASE_URL" -f schema.sql
--   psql "$DATABASE_URL" -f seed.sql
-- Regra: todo dado guarda de onde veio (fonte, fonte_url) e quando.
-- O que vem de importação nunca sobrescreve o que a equipe editou:
-- as edições ficam em colunas/tabelas próprias (ex.: fichas).
-- =====================================================================

create table if not exists fontes (
  codigo       text primary key,              -- 'inaturalist', 'gbif', 'icmbio'…
  nome         text not null,
  url          text,
  licenca      text,
  acessado_em  date
);

-- árvore taxonômica (reino → espécie); id = id do táxon no iNaturalist
create table if not exists taxons (
  id                 bigint primary key,
  nome_cientifico    text not null,
  rank               text not null,           -- kingdom, phylum, class, order, family, genus, species…
  rank_nivel         int,
  pai_id             bigint references taxons(id) deferrable initially deferred,
  ancestrais         bigint[] not null default '{}',
  nome_popular       text,                    -- nome preferido em português
  grupo              text,                    -- Aves, Insecta, Mammalia…
  extinto            boolean not null default false,
  observacoes_mundo  int not null default 0,
  wikipedia_url      text,
  alvo               boolean not null default false,  -- tem ficha planejada
  fonte              text references fontes(codigo),
  fonte_url          text,
  importado_em       date
);
create index if not exists taxons_pai on taxons(pai_id);
create index if not exists taxons_nome on taxons(lower(nome_cientifico));

-- por que cada espécie entrou no banco
create table if not exists alvos (
  taxon_id          bigint primary key references taxons(id),
  origem            text not null,            -- 'top_brasil' | 'catalogo'
  posicao           int,                      -- posição no ranking de mais vistas no Brasil
  registros_brasil  int,
  catalogo_id       text,                     -- id no catálogo atual (formiga, abelha…)
  importado_em      date
);

create table if not exists nomes_populares (
  id         bigserial primary key,
  taxon_id   bigint not null references taxons(id),
  nome       text not null,
  idioma     text not null default 'pt',
  regiao     text,                            -- quando o nome é regional
  preferido  boolean not null default false,
  ordem      int not null default 0,
  fonte      text references fontes(codigo),
  unique (taxon_id, nome)
);
create index if not exists nomes_busca on nomes_populares(lower(nome));

-- fotos, ilustrações e sons (só licenças que permitem uso comercial)
create table if not exists midias (
  id            bigserial primary key,
  taxon_id      bigint not null references taxons(id),
  tipo          text not null,                -- 'foto' | 'som' | 'ilustracao'
  posicao       int not null default 0,
  url_media     text,
  url_grande    text,
  url_original  text,
  arquivo_local text,                         -- caminho no storage próprio, quando baixado
  largura       int,
  altura        int,
  autor         text,
  atribuicao    text not null,
  licenca       text not null check (licenca in ('cc0', 'cc-by', 'cc-by-sa', 'propria')),
  fonte         text references fontes(codigo),
  fonte_id      text,
  fonte_url     text,
  aprovada      boolean not null default false,  -- curadoria no painel admin
  unique (fonte, fonte_id, taxon_id)
);

create table if not exists conservacao (
  id            bigserial primary key,
  taxon_id      bigint not null references taxons(id),
  status        text not null,
  iucn_codigo   int,
  autoridade    text,
  local         text,
  local_id      bigint,
  url           text,
  uso_comercial boolean not null,             -- false = IUCN: não exibir no produto pago
  fonte         text references fontes(codigo),
  unique nulls not distinct (taxon_id, autoridade, local, status)
);

create table if not exists estabelecimento (
  taxon_id  bigint not null references taxons(id),
  local     text not null,
  meio      text,                             -- native | introduced | endemic…
  fonte     text references fontes(codigo),
  primary key (taxon_id, local)
);

-- "Quando ver": registros por mês do ano
create table if not exists sazonalidade (
  taxon_id  bigint not null references taxons(id),
  mes       int not null check (mes between 1 and 12),
  registros int not null,
  local     text not null default 'Brasil',
  fonte     text not null references fontes(codigo),
  primary key (taxon_id, mes, local, fonte)
);

create table if not exists registros_ano (
  taxon_id  bigint not null references taxons(id),
  ano       int not null,
  registros int not null,
  local     text not null default 'Brasil',
  fonte     text not null references fontes(codigo),
  primary key (taxon_id, ano, local, fonte)
);

-- mapa de calor: contagem por hexágono H3 (nunca o ponto exato)
create table if not exists ocorrencias_celulas (
  taxon_id   bigint not null references taxons(id),
  h3         text not null,
  resolucao  int not null,
  registros  int not null,
  fonte      text not null references fontes(codigo),   -- 'inaturalist', 'gbif', 'app'
  primary key (taxon_id, h3, fonte)
);
create index if not exists celulas_h3 on ocorrencias_celulas(h3);

-- fichas escritas pela equipe (preenchidas depois, pelo painel admin)
create table if not exists fichas (
  taxon_id      bigint primary key references taxons(id),
  status        text not null default 'rascunho' check (status in ('rascunho', 'em-revisao', 'revisado')),
  dados         jsonb not null default '{}',  -- tamanho, peso, vida, dieta, ciclo de vida, textos por idade…
  revisado_por  text,
  revisado_em   date,
  atualizado_em timestamptz not null default now()
);
