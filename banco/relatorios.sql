-- =====================================================================
-- Schema `relatorios`: números agregados para o agente CEO (Hermes).
-- Rodar como bio_admin. O agente usa o usuário `bio_agente`, que só
-- enxerga estas views (nunca as tabelas). As views rodam com o dono
-- (bio_admin), então não é preciso dar acesso às tabelas.
-- Regra: nada de dado de usuário/criança aqui, só contagens.
-- =====================================================================

create schema if not exists relatorios;

create or replace view relatorios.catalogo as
select
  (select count(*) from alvos)                                   as especies_alvo,
  (select count(*) from alvos where origem = 'catalogo')         as especies_catalogo_atual,
  (select count(*) from taxons)                                  as taxons_total,
  (select count(*) from nomes_populares)                         as nomes_populares,
  (select count(*) from fichas)                                  as fichas_total,
  (select count(*) from fichas where status = 'revisado')        as fichas_revisadas,
  (select count(*) from midias where tipo = 'foto')              as fotos_total,
  (select count(*) from midias where tipo = 'foto' and aprovada) as fotos_aprovadas,
  (select count(*) from midias where tipo = 'foto' and not aprovada) as fotos_pendentes,
  (select count(*) from alvos a where not exists (
     select 1 from midias m where m.taxon_id = a.taxon_id and m.tipo = 'foto')) as especies_sem_foto,
  (select count(*) from alvos a where not exists (
     select 1 from midias m where m.taxon_id = a.taxon_id and m.tipo = 'foto' and m.aprovada)) as especies_sem_foto_aprovada,
  (select count(*) from midias where tipo = 'som')               as sons_total,
  now()                                                          as gerado_em;

create or replace view relatorios.fichas_por_status as
select s.status, count(f.taxon_id) as fichas
from (values ('rascunho'), ('em-revisao'), ('revisado')) s(status)
left join fichas f on f.status = s.status
group by s.status
order by array_position(array['rascunho','em-revisao','revisado'], s.status);

create or replace view relatorios.portao_cobranca as
select
  50 as meta_fichas,
  (select count(*) from fichas where status = 'revisado') as fichas_revisadas,
  greatest(0, 50 - (select count(*) from fichas where status = 'revisado')) as faltam_fichas;

create or replace view relatorios.especies_por_grupo as
select coalesce(t.grupo, 'sem grupo') as grupo, count(*) as especies_alvo
from alvos a join taxons t on t.id = a.taxon_id
group by 1 order by 2 desc;

-- Futuro (quando existirem as tabelas de assinatura): assinantes por plano
-- e receita do mês, sempre agregados.

do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'bio_agente') then
    create role bio_agente login;
  end if;
end $$;
alter role bio_agente set default_transaction_read_only = on;
alter role bio_agente set search_path = relatorios;
alter role bio_agente connection limit 3;
revoke all on schema public from bio_agente;
grant connect on database bionobolso to bio_agente;
grant usage on schema relatorios to bio_agente;
grant select on all tables in schema relatorios to bio_agente;
alter default privileges for role bio_admin in schema relatorios grant select on tables to bio_agente;
