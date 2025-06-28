#!/bin/bash

# Reset Database Script for BodyFuel (Render Cron Job)
# Drops the entire database and recreates it from backup

set -e

# Debug: Print masked DATABASE_URL for troubleshooting
masked_url=$(echo "$DATABASE_URL" | sed -E 's|^(postgresql://[^:]+:)[^@]+(@.*)$|\1*****\2|')
echo "🔍 Using database connection: $masked_url"

# Make sure DATABASE_URL is provided
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL not set."
  exit 1
fi

# Parse the DATABASE_URL components
DB_USER=$(echo "$DATABASE_URL" | sed -E 's|^postgresql://([^:]+):.*$|\1|')
DB_PASSWORD=$(echo "$DATABASE_URL" | sed -E 's|^postgresql://[^:]+:([^@]+)@.*$|\1|')
DB_HOST=$(echo "$DATABASE_URL" | sed -E 's|^postgresql://[^@]+@([^:/]+):.*$|\1|')
DB_PORT=$(echo "$DATABASE_URL" | sed -E 's|^postgresql://[^@]+@[^:/]+:([0-9]+).*|\1|')
DB_NAME=$(echo "$DATABASE_URL" | sed -E 's|^postgresql://[^@]+@[^:/]+:[0-9]+/([^?]+).*|\1|')

# Path to backup file (relative to this script)
BACKUP_FILE="$(dirname "$0")/../backup/bodyfuel_backup_20250612_210113.sql"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Backup file not found at $BACKUP_FILE"
  exit 1
fi

# Set password env var for psql
export PGPASSWORD="$DB_PASSWORD"

echo "🗑️ Dropping database..."
# Connect to 'postgres' database (not the target) to drop the target database
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres --no-psqlrc -c "DROP DATABASE IF EXISTS \"$DB_NAME\";" || {
  echo "⚠️ Could not drop database. It may not exist or you may not have permissions."
}

echo "🆕 Creating fresh database..."
# Use separate commands to avoid transaction issues
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres --no-psqlrc -c "CREATE DATABASE \"$DB_NAME\" OWNER \"$DB_USER\";" || {
  echo "❌ Failed to create database. Check permissions."
  exit 1
}

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres --no-psqlrc -c "GRANT ALL PRIVILEGES ON DATABASE \"$DB_NAME\" TO \"$DB_USER\";" || {
  echo "⚠️ Could not grant privileges, but database was created."
}

echo "📦 Restoring database from backup..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE" || {
  echo "⚠️ Backup restore had some errors, but may have partially succeeded."
}

# Clean up
unset PGPASSWORD

echo "✅ Database reset completed."
exit 0