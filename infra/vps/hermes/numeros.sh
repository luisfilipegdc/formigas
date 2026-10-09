#!/bin/bash
# Números agregados do Bio no Bolso (só views do schema relatorios, usuário bio_agente).
set -euo pipefail
Q(){ psql -h 127.0.0.1 -U bio_agente -d bionobolso -X -q -P footer=off -P border=2 -c "$1"; }
echo "# Números do Bio no Bolso"
echo "Gerado em $(TZ=America/Sao_Paulo date '+%d/%m/%Y %H:%M')"
echo; echo "## Catálogo"; Q "select especies_alvo, fichas_total, fichas_revisadas, fotos_total, fotos_aprovadas, fotos_pendentes, especies_sem_foto, especies_sem_foto_aprovada, sons_total from catalogo"
echo; echo "## Fichas por status"; Q "select * from fichas_por_status"
echo; echo "## Portão de cobrança (fichas)"; Q "select * from portao_cobranca"
echo; echo "## Espécies por grupo"; Q "select * from especies_por_grupo limit 15"
