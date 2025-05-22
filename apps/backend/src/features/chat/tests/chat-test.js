// Simple test script to verify the chat API endpoint
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
const TEST_MESSAGE = 'Hello, can you help me find protein supplements?';

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
 * Test the chat API endpoint
 */
async function testChatAPI() {
  console.log(`${colors.cyan}Starting Chat API Test${colors.reset}`);
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
    
    // Send a request to the chat API
    console.log(`${colors.yellow}Sending request to chat API...${colors.reset}`);
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
    
    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`${colors.red}Error: ${response.status} ${response.statusText}${colors.reset}`);
      console.log(`${colors.red}Response:${colors.reset} ${errorText}`);
      return;
    }
    
    // Process the SSE stream
    console.log(`${colors.green}Response received (streaming):${colors.reset}`);
    let assistantMessage = '';
    let buffer = '';

    // Use Node.js stream handling
    response.body.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer

      for (const line of lines) {
        if (line.trim() === '' || !line.startsWith('data: ')) continue;

        const data = line.substring(6); // Remove 'data: ' prefix

        if (data === '[DONE]') {
          console.log(`${colors.green}Stream finished.${colors.reset}`);
          // The stream is ending, but we might still have data in the buffer
          // Process any remaining data in the buffer before the 'end' event
          continue; // Continue processing lines in the current chunk
        }

        try {
          const parsedData = JSON.parse(data);
          // Assuming the AI SDK stream format with delta content
          if (parsedData.choices && parsedData.choices[0] && parsedData.choices[0].delta && parsedData.choices[0].delta.content) {
            const content = parsedData.choices[0].delta.content;
            assistantMessage += content;
            process.stdout.write(content); // Print the content as it streams
          } else if (parsedData.error) {
             console.log(`${colors.red}Error received in stream:${colors.reset}`, parsedData.error);
             // Depending on the error structure, you might want to accumulate or handle it differently
          }
        } catch (e) {
          console.error(`${colors.red}Error parsing SSE data:${colors.reset}`, e);
          console.log(`${colors.red}Problematic data:${colors.reset}`, data);
        }
      }
    });

    response.body.on('end', () => {
      // Process any remaining data in the buffer
       const lines = buffer.split('\n');
       for (const line of lines) {
         if (line.trim() === '' || !line.startsWith('data: ')) continue;

         const data = line.substring(6); // Remove 'data: ' prefix

         if (data === '[DONE]') {
           console.log(`${colors.green}Stream finished.${colors.reset}`);
           continue;
         }

         try {
           const parsedData = JSON.parse(data);
           if (parsedData.choices && parsedData.choices[0] && parsedData.choices[0].delta && parsedData.choices[0].delta.content) {
             const content = parsedData.choices[0].delta.content;
             assistantMessage += content;
             process.stdout.write(content);
           } else if (parsedData.error) {
              console.log(`${colors.red}Error received in stream:${colors.reset}`, parsedData.error);
           }
         } catch (e) {
           console.error(`${colors.red}Error parsing SSE data:${colors.reset}`, e);
           console.log(`${colors.red}Problematic data:${colors.reset}`, data);
         }
       }

      console.log(`\n${colors.green}Test passed!${colors.reset}`);
      console.log(`${colors.magenta}Accumulated AI Response:${colors.reset} "${assistantMessage}"`);
    });

    response.body.on('error', (error) => {
      console.error(`${colors.red}Stream error:${colors.reset}`, error);
    });

    // Wait for the stream to finish
    await new Promise((resolve, reject) => {
      response.body.on('end', resolve);
      response.body.on('error', reject);
    });

  } catch (error) {
    console.log(`${colors.red}Error:${colors.reset} ${error.message}`);
    console.log(error.stack);
  }
}

// Run the test
testChatAPI();
