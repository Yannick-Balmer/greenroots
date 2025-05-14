#!/bin/bash

set -e

# 🔧 Charger les variables d'environnement
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Affichage des variables pour debug
echo "🔧 Connexion à PostgreSQL avec les variables suivantes :"
echo "   HOST: $POSTGRES_HOST"
echo "   DB:   $POSTGRES_DB"
echo "   USER: $POSTGRES_USER"

# Boucle jusqu'à ce que la base soit prête
until PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  echo "⏳ PostgreSQL n'est pas encore prêt - nouvelle tentative dans 2s..."
  sleep 2
done

echo "✅ PostgreSQL est prêt. Lancement du script d'insertion..."
exec node insert.js
