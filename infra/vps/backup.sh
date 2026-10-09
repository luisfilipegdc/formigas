#!/bin/bash
# Backup diário do bionobolso: pg_dump formato custom (compactado), guarda 14 dias.
set -euo pipefail
set -a; . /opt/bionobolso/.env; set +a
DIR=/opt/bionobolso/backups
F="$DIR/bionobolso_$(date +%Y-%m-%d_%H%M).dump"
umask 077
docker exec -e PGPASSWORD="$POSTGRES_PASSWORD" bionobolso-db pg_dump -U bio_admin -d bionobolso -Fc -Z 6 > "$F.tmp"
mv "$F.tmp" "$F"
find "$DIR" -name 'bionobolso_*.dump' -mtime +13 -delete
echo "$(date '+%F %T') ok $F $(stat -c %s "$F") bytes"
