#!/bin/bash

# Install all dependencies including dev dependencies
npm install 

# Run turbo build
npx turbo run build --filter=backend
