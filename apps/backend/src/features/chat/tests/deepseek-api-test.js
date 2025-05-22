// Direct test for the DeepSeek API
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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

// Test configuration
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const TEST_MESSAGE = 'Hello, can you help me find protein supplements?';

// List of models to test
const MODELS_TO_TEST = [
  'deepseek-chat',
  'deepseek-llm-7b-chat',
  'deepseek-coder',
  'deepseek-coder-instruct',
  'deepseek-coder-instruct-v1.5',
  'deepseek-llm',
  'deepseek-llm-instruct'
];

/**
 * Test the DeepSeek API directly
 */
async function testDeepSeekAPI() {
  console.log(`${colors.cyan}Starting DeepSeek API Direct Test${colors.reset}`);
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
    console.log(`${colors.blue}API Key:${colors.reset} ${DEEPSEEK_API.substring(0, 5)}...`);
    
    // Test each model
    for (const model of MODELS_TO_TEST) {
      console.log(`\n${colors.yellow}Testing model: ${model}${colors.reset}`);
      
      try {
        // Send a request to the DeepSeek API
        const requestBody = {
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for BodyFuel, an e-commerce platform focused on fitness and nutrition products.'
            },
            {
              role: 'user',
              content: TEST_MESSAGE,
            },
          ],
          stream: false
        };
        
        console.log(`${colors.blue}Request:${colors.reset}`);
        console.log(JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API}`
          },
          body: JSON.stringify(requestBody)
        });
        
        // Check if the response is OK
        if (!response.ok) {
          const errorText = await response.text();
          console.log(`${colors.red}Error: ${response.status} ${response.statusText}${colors.reset}`);
          console.log(`${colors.red}Response:${colors.reset} ${errorText}`);
          continue;
        }
        
        // Parse the response
        const data = await response.json();
        console.log(`${colors.green}Response received:${colors.reset}`);
        console.log(JSON.stringify(data, null, 2));
        
        // Check if the response has the expected format
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          console.log(`${colors.red}Error: Response does not contain message content${colors.reset}`);
          continue;
        }
        
        console.log(`${colors.green}Test passed for model: ${model}!${colors.reset}`);
        console.log(`${colors.magenta}AI Response:${colors.reset} "${data.choices[0].message.content}"`);
        
        // If we found a working model, we can stop testing
        console.log(`${colors.green}Found working model: ${model}${colors.reset}`);
        break;
      } catch (error) {
        console.log(`${colors.red}Error with model ${model}:${colors.reset} ${error.message}`);
      }
    }
  } catch (error) {
    console.log(`${colors.red}Error:${colors.reset} ${error.message}`);
    console.log(error.stack);
  }
}

// Run the test
testDeepSeekAPI();
