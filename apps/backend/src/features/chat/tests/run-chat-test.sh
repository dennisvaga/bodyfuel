#!/bin/bash

# Colors for console output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Chat API Test Runner ===${NC}"

# Check if the backend server is running
echo -e "${YELLOW}Checking if backend server is running...${NC}"
if ! curl -s http://localhost:5001/api/products > /dev/null; then
  echo -e "${RED}Error: Backend server is not running${NC}"
  echo -e "${YELLOW}Please start the backend server with:${NC}"
  echo -e "cd apps/backend && npm run dev"
  exit 1
fi
echo -e "${GREEN}Backend server is running${NC}"

# Run the test
echo -e "${YELLOW}Running chat API test...${NC}"
node apps/backend/src/tests/chat-test.js
