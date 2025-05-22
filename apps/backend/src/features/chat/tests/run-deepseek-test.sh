#!/bin/bash

# Colors for console output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== DeepSeek API Test Runner ===${NC}"

# Run the test
echo -e "${YELLOW}Running DeepSeek API test...${NC}"
echo -e "${YELLOW}This will test multiple model names to find which one works with your API key${NC}"
node apps/backend/src/tests/deepseek-api-test.js
