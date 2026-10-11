-- =====================================================================
-- 001 — Contas por idade, famílias, consentimentos e sessões.
-- Rodar como bio_admin (dono). bio_app recebe SELECT/INSERT/UPDATE/DELETE
-- pelas default privileges criadas na instalação do banco.
--
-- Regras (plano, seção "Cadastro por idade"; LGPD art. 14):
--   * adulto (18+): e-mail e senha; pode ser responsável.
--   * adolescente (12–17) e criança (até 11): conta criada pelo responsável
--     dentro da família; entra com código da família + apelido + PIN.
--   * de menores não guardamos e-mail, data de nascimento nem foto do rosto.
-- O agente CEO (bio_agente) NÃO tem acesso a nada daqui.
-- =====================================================================
begin;

create table if not exists familias (
  id          uuid primary key default gen_random_uuid(),
  codigo      text not null unique,            -- ex.: ONCA-42 (para o login com PIN)
  nome        text not null,
  plano       text not null default 'free' check (plano in ('free', 'familia', 'professor')),
  criada_em   timestamptz not null default now()
);

create table if not exists contas (
  id              uuid primary key default gen_random_uuid(),
  familia_id      uuid not null references familias(id) on delete cascade,
  faixa           text not null check (faixa in ('adulto', 'adolescente', 'crianca')),
  papel           text not null default 'membro' check (papel in ('responsavel', 'membro')),
  -- adulto: e-mail + senha
  email           text unique,
  senha_hash      text,
  nome            text,                          -- só adulto
  -- menores: apelido + PIN (dentro da família)
  pin_hash        text,
  responsavel_id  uuid references contas(id) on delete set null,
  modo            text not null default 'cientista' check (modo in ('pequeno', 'explorador', 'cientista')),
  admin           boolean not null default false,
  criada_em       timestamptz not null default now(),
  ultimo_acesso   timestamptz,
  constraint adulto_tem_email check (faixa <> 'adulto' or (email is not null and senha_hash is not null)),
  constraint menor_sem_email check (faixa = 'adulto' or (email is null and pin_hash is not null and responsavel_id is not null))
);
create index if not exists contas_familia on contas(familia_id);

-- um por conta: o que aparece na tela
create table if not exists perfis (
  conta_id   uuid primary key references contas(id) on delete cascade,
  familia_id uuid not null references familias(id) on delete cascade,
  apelido    text not null,
  avatar     text not null default 'formiga',
  xp         int not null default 0,
  nivel      int not null default 1
);
-- apelido único dentro da família (é o "usuário" do login com PIN)
create unique index if not exists perfis_apelido_familia on perfis (familia_id, lower(apelido));

create table if not exists consentimentos (
  id          bigserial primary key,
  conta_id    uuid not null references contas(id) on delete cascade,
  tipo        text not null,                    -- 'termos', 'privacidade', 'responsavel_menor'
  versao      text not null,
  sobre_conta uuid references contas(id) on delete cascade, -- consentimento dado por um menor específico
  aceito_em   timestamptz not null default now(),
  ip_hash     text                               -- hash do IP, nunca o IP puro
);
create index if not exists consentimentos_conta on consentimentos(conta_id);

create table if not exists sessoes (
  id          text primary key,                  -- sha256 do token do cookie
  conta_id    uuid not null references contas(id) on delete cascade,
  criada_em   timestamptz not null default now(),
  expira_em   timestamptz not null
);
create index if not exists sessoes_conta on sessoes(conta_id);

create table if not exists log_auditoria (
  id          bigserial primary key,
  conta_id    uuid references contas(id) on delete set null,
  acao        text not null,
  detalhe     jsonb not null default '{}',
  criado_em   timestamptz not null default now()
);

create table if not exists migracoes (
  nome        text primary key,
  aplicada_em timestamptz not null default now()
);
-- tabelas novas NÃO dão leitura automática ao bio_leitura; catálogo é concedido explicitamente.
alter default privileges for role bio_admin in schema public revoke select on tables from bio_leitura;
alter default privileges for role bio_admin in schema public revoke select on sequences from bio_leitura;

-- dados pessoais: bio_leitura (relatórios) não lê; só o app.
revoke all on familias, contas, perfis, consentimentos, sessoes, log_auditoria from bio_leitura;
revoke all on familias, contas, perfis, consentimentos, sessoes, log_auditoria from bio_agente;

insert into migracoes(nome) values ('001_contas') on conflict do nothing;

commit;
