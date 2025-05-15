# Utiliser l'image officielle comme base
FROM postgres:14

# Définir les variables d’environnement par défaut (surchargeables au run)
ENV POSTGRES_USER=greenroots
ENV POSTGRES_PASSWORD=greenroots
ENV POSTGRES_DB=greenroots

COPY init_db.sql ./docker-entrypoint-initdb.d/init_db.sql