#!/bin/bash

# Install dependencies
npm install

# Install pg type definitions explicitly
npm install --save-dev @types/pg

# Run turbo build
npx turbo run build --filter=backend
