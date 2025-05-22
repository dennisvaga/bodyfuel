// Test script to simulate frontend SSE streaming consumption
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Test configuration
const API_URL = 'http://localhost:5001/api/chat';
const TEST_MESSAGE = 'Tell me about your protein supplements.'; // A message likely to trigger a product search

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Test the chat API endpoint with streaming
 */
async function testChatStreaming() {
  console.log(`${colors.cyan}Starting Chat API Streaming Test${colors.reset}`);
  console.log(`${colors.blue}API URL:${colors.reset} ${API_URL}`);
  console.log(`${colors.blue}Test Message:${colors.reset} "${TEST_MESSAGE}"`);

  try {
    // Check if the DeepSeek API key is set
    const DEEPSEEK_API = process.env.DEEPSEEK_API;
    if (!DEEPSEEK_API) {
      console.log(`${colors.red}Error: DEEPSEEK_API environment variable is not set${colors.reset}`);
      return;
    }
    console.log(`${colors.green}DeepSeek API key is set${colors.reset}`);

    // Send a streaming request to the chat API
    console.log(`${colors.yellow}Sending streaming request to chat API...${colors.reset}`);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: TEST_MESSAGE,
          },
        ],
      }),
    });

    // Check if the response is OK and is a stream
    if (!response.ok || !response.body) {
      const errorText = await response.text();
      console.log(`${colors.red}Error: ${response.status} ${response.statusText}${colors.reset}`);
      console.log(`${colors.red}Response:${colors.reset} ${errorText}`);
      return;
    }

    console.log(`${colors.green}Streaming response received:${colors.reset}`);
    console.log(`${colors.yellow}--- Stream Start ---${colors.reset}`);

    // Process the streamed response
    response.body.on('data', (chunk) => {
      // Log each received chunk
      console.log(`${colors.magenta}Received Chunk:${colors.reset} ${chunk.toString()}`);
    });

    response.body.on('end', () => {
      console.log(`${colors.yellow}--- Stream End ---${colors.reset}`);
      console.log(`\n${colors.green}Streaming test finished.${colors.reset}`);
    });

    response.body.on('error', (error) => {
      console.error(`${colors.red}Stream Error:${colors.reset}`, error);
      console.log(`${colors.yellow}--- Stream Error End ---${colors.reset}`);
    });

  } catch (error) {
    console.log(`${colors.red}Fetch Error:${colors.reset} ${error.message}`);
    console.log(error.stack);
  }
}

// Run the test
testChatStreaming();
