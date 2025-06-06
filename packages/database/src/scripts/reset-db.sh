#!/bin/bash

# Reset Database Script for BodyFuel (Render Cron Job)
# Instead of recreating the database, we'll clear and restore its contents

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
BACKUP_FILE="$(dirname "$0")/../backup/bodyfuel_backup_20250521.sql"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Backup file not found at $BACKUP_FILE"
  exit 1
fi

# Set password env var for psql
export PGPASSWORD="$DB_PASSWORD"

echo "🧹 Clearing existing database content..."
# Connect directly to the target database and drop all tables/functions/etc
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
-- Drop all tables, views, functions, etc.
DO \$\$ 
DECLARE
  r RECORD;
BEGIN
  -- Drop all tables with CASCADE
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
  
  -- Drop all views
  FOR r IN (SELECT viewname FROM pg_views WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP VIEW IF EXISTS ' || quote_ident(r.viewname) || ' CASCADE';
  END LOOP;
  
  -- Drop all functions/procedures
  FOR r IN (SELECT oid::regprocedure FROM pg_proc WHERE pronamespace = 'public'::regnamespace) LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS ' || r.oid || ' CASCADE';
  END LOOP;
  
  -- Drop all sequences
  FOR r IN (SELECT relname FROM pg_class WHERE relkind = 'S' AND relnamespace = 'public'::regnamespace) LOOP
    EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.relname) || ' CASCADE';
  END LOOP;
END \$\$;
" || {
  echo "⚠️ Could not clear database. Attempting to continue anyway..."
}

echo "📦 Restoring database from backup..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE"

# Clean up
unset PGPASSWORD

echo "✅ Database reset completed."
exit 0