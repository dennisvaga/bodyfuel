// Test script to debug the chat widget SSE streaming
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
const API_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/chat` : 'http://localhost:5001/api/chat';
const TEST_MESSAGE = 'Tell me about your protein supplements.';

/**
 * Test the chat widget by mimicking the behavior of the useChat hook
 */
async function testChatWidget() {
  console.log(`${colors.cyan}Starting Chat Widget Test${colors.reset}`);
  console.log(`${colors.blue}API URL:${colors.reset} ${API_URL}`);
  console.log(`${colors.blue}Test Message:${colors.reset} "${TEST_MESSAGE}"`);

  try {
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

    // Log important headers for debugging
    console.log(`${colors.green}Response received:${colors.reset}`);
    console.log(`${colors.blue}Content-Type:${colors.reset} ${response.headers.get('content-type')}`);
    console.log(`${colors.blue}X-Conversation-Id:${colors.reset} ${response.headers.get('X-Conversation-Id')}`);
    console.log(`${colors.blue}Cache-Control:${colors.reset} ${response.headers.get('cache-control')}`);
    console.log(`${colors.blue}Connection:${colors.reset} ${response.headers.get('connection')}`);

    // Process the streamed response
    console.log(`${colors.yellow}--- Stream Start ---${colors.reset}`);

    // This is what the Vercel AI SDK expects
    console.log(`${colors.magenta}Expected format for Vercel AI SDK:${colors.reset}`);
    console.log(`data: {"id":"<id>","role":"assistant","content":""}\n\n`);
    console.log(`data: {"id":"<id>","role":"assistant","content":"Hello"}\n\n`);
    console.log(`data: [DONE]\n\n`);

    // Process the stream using the on('data') event
    let buffer = '';
    
    response.body.on('data', (chunk) => {
      // Convert the chunk to a string and add it to the buffer
      const chunkStr = chunk.toString();
      buffer += chunkStr;
      
      console.log(`${colors.magenta}Received Chunk:${colors.reset}`);
      console.log(chunkStr);
      
      // Process complete SSE events in the buffer
      let eventEnd = buffer.indexOf('\n\n');
      while (eventEnd !== -1) {
        const event = buffer.substring(0, eventEnd + 2);
        buffer = buffer.substring(eventEnd + 2);
        
        // Log the raw event
        console.log(`${colors.green}Raw SSE Event:${colors.reset}`);
        console.log(event);
        
        // Try to parse the event data
        try {
          const dataMatch = event.match(/^data: (.+)$/m);
          if (dataMatch && dataMatch[1]) {
            const data = dataMatch[1].trim();
            if (data === '[DONE]') {
              console.log(`${colors.yellow}Stream End Marker:${colors.reset} [DONE]`);
            } else {
              try {
                const parsedData = JSON.parse(data);
                console.log(`${colors.blue}Parsed Data:${colors.reset}`, parsedData);
              } catch (parseError) {
                console.log(`${colors.red}Error parsing JSON:${colors.reset}`, parseError.message);
                console.log(`${colors.red}Raw data:${colors.reset}`, data);
              }
            }
          }
        } catch (e) {
          console.log(`${colors.red}Error processing event:${colors.reset}`, e.message);
        }
        
        eventEnd = buffer.indexOf('\n\n');
      }
    });
    
    response.body.on('end', () => {
      console.log(`${colors.yellow}--- Stream End ---${colors.reset}`);
      console.log(`${colors.green}Test completed${colors.reset}`);
    });
    
    response.body.on('error', (error) => {
      console.log(`${colors.red}Stream Error:${colors.reset}`, error.message);
    });

  } catch (error) {
    console.log(`${colors.red}Error:${colors.reset} ${error.message}`);
    console.log(error.stack);
  }
}

// Run the test
testChatWidget();
