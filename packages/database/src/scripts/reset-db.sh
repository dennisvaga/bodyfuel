#!/bin/bash

# Reset Database Script for BodyFuel (Render Cron Job)
# Drops and recreates the database using a backup SQL file

set -e

# Make sure DATABASE_URL is provided
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL not set."
  exit 1
fi

# Parse the DATABASE_URL components using 'awk'
DB_USER=$(echo "$DATABASE_URL" | sed -E 's|^postgresql://([^:]+):.*$|\1|')
DB_PASSWORD=$(echo "$DATABASE_URL" | sed -E 's|^postgresql://[^:]+:([^@]+)@.*$|\1|')
DB_HOST=$(echo "$DATABASE_URL" | sed -E 's|^postgresql://[^@]+@([^:/]+):.*$|\1|')
DB_PORT=$(echo "$DATABASE_URL" | sed -E 's|^postgresql://[^@]+@[^:/]+:([0-9]+).*|\1|')
DB_NAME=$(echo "$DATABASE_URL" | sed -E 's|^postgresql://[^@]+@[^:/]+:[0-9]+/([^?]+).*|\1|')

# Path to backup file (relative to this script)
BACKUP_FILE="$(dirname "$0")/../backup/bodyfuel_backup_20250521.sql"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Backup file not found at $BACKUP_FILE"
  exit 1
fi

# Set password env var for psql
export PGPASSWORD="$DB_PASSWORD"

echo "⚙️ Dropping existing database $DB_NAME..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME WITH (FORCE);"

echo "🛠️ Creating fresh database $DB_NAME..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"

echo "📦 Restoring database from backup..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE"

# Clean up
unset PGPASSWORD

echo "✅ Database reset completed."
exit 0
