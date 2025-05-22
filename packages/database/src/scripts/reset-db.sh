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

echo "🔄 Terminating all connections to database $DB_NAME..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "
  SELECT pg_terminate_backend(pg_stat_activity.pid) 
  FROM pg_stat_activity 
  WHERE pg_stat_activity.datname = '$DB_NAME' 
  AND pid <> pg_backend_pid();" || true

echo "⚙️ Dropping existing database $DB_NAME..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" || {
  echo "⚠️ Could not drop database. It may be in use or you may not have sufficient permissions."
  echo "🔍 Checking if database exists..."
  DB_EXISTS=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
  if [ "$DB_EXISTS" = "1" ]; then
    echo "⚠️ Database still exists. Will attempt to continue with existing database..."
  else
    echo "✅ Database does not exist. Will create it now..."
  fi
}

echo "🛠️ Creating fresh database $DB_NAME if it doesn't exist..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null || 
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || 
echo "⚠️ Could not create database. It may already exist. Continuing..."

echo "📦 Restoring database from backup..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE"

# Clean up
unset PGPASSWORD

echo "✅ Database reset completed."
exit 0
