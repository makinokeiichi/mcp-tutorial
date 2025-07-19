#!/usr/bin/env node

import { AIUseCasesMCPServer } from './mcp/server.js';

async function main() {
  const server = new AIUseCasesMCPServer();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down AI Use Cases MCP Server...');
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\nShutting down AI Use Cases MCP Server...');
    await server.close();
    process.exit(0);
  });

  try {
    // Start with stdio transport for MCP clients
    await server.start('stdio');
    console.log('AI Use Cases MCP Server is running...');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 