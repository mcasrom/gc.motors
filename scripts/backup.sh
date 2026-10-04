#!/usr/bin/env bash
# Backup diario de GCMotors Workshop: datos (reservas/trabajos/flota/ventas),
# imágenes subidas (public/uploads) y .env. Rotación: conserva las últimas 14 copias.
set -euo pipefail

APP="/home/deploy/gcmotors-workshop"
DEST="$APP/backups"
KEEP=14

mkdir -p "$DEST"
STAMP="$(date -u +%Y%m%d_%H%M%S)"
OUT="$DEST/gcmotors_$STAMP.tar.gz"

# .env puede no existir; uploads puede no existir todavía
tar -czf "$OUT" -C "$APP" data public/uploads .env 2>/dev/null \
  || tar -czf "$OUT" -C "$APP" data

# rota
ls -1t "$DEST"/gcmotors_*.tar.gz 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f

printf '%s backup ok · %s · %s copias\n' \
  "$(date -u +%FT%TZ)" "$(du -h "$OUT" | cut -f1)" "$(ls -1 "$DEST"/gcmotors_*.tar.gz | wc -l)"
