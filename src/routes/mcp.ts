import { Router } from 'express';
import { executeMCPTool, mcpTools } from '../services/mcp-tools';
import { OllamaService } from '../services/ollama';
import console from 'console';
import process from 'process';
import process from 'process';
import console from 'console';
import console from 'console';

const router = Router();
const ollama = new OllamaService();

// List available MCP tools
router.get('/tools', (req, res) => {
  const tools = mcpTools.map(tool => ({
    name: tool.name,
    description: tool.description
  }));
  res.json({ tools });
});

// Execute an MCP tool
router.post('/execute/:toolName', async (req, res) => {
  try {
    const { toolName } = req.params;
    const input = req.body;
    
    const result = await executeMCPTool(toolName, input);
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Smart chat endpoint - LLM decides which tool to use
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Check if Ollama is available
    const isAvailable = await ollama.isAvailable();
    if (!isAvailable) {
      return res.status(503).json({ 
        error: 'Ollama service is not available. Please make sure Ollama is running.' 
      });
    }

    // Enhanced intent detection
    let response;
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('product') && lowerMessage.includes('show')) {
      // Fetch products
      const result = await executeMCPTool('fetch-products', {});
      response = `Found ${result.count} products:\n${JSON.stringify(result.products, null, 2)}`;
    } else if (lowerMessage.includes('most expensive') || 
               lowerMessage.includes('highest price') || 
               lowerMessage.includes('product detail') ||
               lowerMessage.includes('id:') ||
               lowerMessage.includes('analyze') ||
               lowerMessage.includes('which product') ||
               lowerMessage.includes('what are the')) {
      // Use analyze-products for any product analysis questions
      const result = await executeMCPTool('analyze-products', { question: message });
      response = result.analysis;
    } else {
      // Direct chat
      const result = await executeMCPTool('chat-llm', { prompt: message });
      response = result.response;
    }
    
    res.json({ response });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to process chat' 
    });
  }
});

// Health check for Ollama
router.get('/ollama/status', async (req, res) => {
  try {
    console.log('Checking Ollama status...');
    const isAvailable = await ollama.isAvailable();
    console.log('Ollama available:', isAvailable);
    res.json({ 
      available: isAvailable,
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'deepseek-coder:1.3b'
    });
  } catch (error) {
    console.error('Ollama status check error:', error);
    res.status(500).json({ available: false, error: 'Failed to check Ollama status' });
  }
});

export { router as mcpRoutes };