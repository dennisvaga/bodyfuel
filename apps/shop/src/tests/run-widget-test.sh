#!/bin/bash

# Colors for console output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Chat Widget Configuration Test Runner ===${NC}"

# Run the test
echo -e "${YELLOW}Running Chat Widget Configuration Test...${NC}"
echo -e "${YELLOW}This will test the environment variables and API connectivity${NC}"
node apps/shop/src/tests/chat-widget-test.js
