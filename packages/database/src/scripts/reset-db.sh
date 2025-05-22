#!/bin/bash

# Reset Database Script for BodyFuel
# This script will drop and recreate the database from the backup file without confirmation

set -e  # Exit immediately if a command exits with a non-zero status

# Change to the project root directory for absolute paths resolution
cd "$(dirname "$0")/../../"

# Read database credentials from .env file
if [ -f ".env" ]; then
  echo "Reading database credentials from .env file..."
  # Direct export of the DATABASE_URL
  export $(grep DATABASE_URL .env | xargs)
else
  echo "Error: .env file not found!"
  exit 1
fi

# Print the DATABASE_URL for debugging (will be masked in output)
echo "Database URL: ${DATABASE_URL}"

# Extract database connection info from DATABASE_URL
# Format: postgresql://username:password@host:port/database
DB_USER=$(echo $DATABASE_URL | sed -E 's|^postgresql://([^:]+):.*$|\1|')
DB_PASSWORD=$(echo $DATABASE_URL | sed -E 's|^postgresql://[^:]+:([^@]+)@.*$|\1|')
DB_HOST=$(echo $DATABASE_URL | sed -E 's|^postgresql://[^@]+@([^:]+):.*$|\1|')
DB_PORT=$(echo $DATABASE_URL | sed -E 's|^postgresql://[^@]+@[^:]+:([0-9]+)/.*$|\1|')
DB_NAME=$(echo $DATABASE_URL | sed -E 's|^postgresql://[^@]+@[^:]+:[0-9]+/(.*)$|\1|')

echo "Database information:"
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"

# Path to the backup file
BACKUP_FILE="src/backup/bodyfuel_backup_20250521.sql"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found at $BACKUP_FILE!"
  exit 1
fi

echo "Using backup file: $BACKUP_FILE"
echo "Proceeding with database reset without confirmation..."

# Set PGPASSWORD environment variable to avoid password prompt
export PGPASSWORD="$DB_PASSWORD"

echo "Dropping database $DB_NAME if it exists..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME WITH (FORCE);"

echo "Creating fresh database $DB_NAME..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"

echo "Restoring database from backup..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE"

echo "Database reset completed successfully!"

# Unset password for security
unset PGPASSWORD

exit 0