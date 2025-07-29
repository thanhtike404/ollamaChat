# MCP Learning Project

A full-stack application demonstrating Model Context Protocol (MCP) integration with TypeScript, Express, MySQL, Prisma, and Ollama LLM.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL with Prisma ORM
- **LLM**: Ollama (deepseek-coder:1.3b or other models)
- **MCP**: Custom MCP tools for database operations and LLM integration

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MySQL** (local or remote)
3. **Ollama** installed and running

### Install Ollama

```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model (e.g., deepseek-coder)
ollama pull deepseek-coder:1.3b
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Update `.env` file with your database credentials:

```env
DATABASE_URL="mysql://username:password@localhost:3306/mcp_learning_db"
PORT=3000
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="deepseek-coder:1.3b"
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed with sample data
npx ts-node prisma/seed.ts
```

### 4. Start Ollama

```bash
# Start Ollama service
ollama serve

# In another terminal, run your model
ollama run deepseek-coder:1.3b
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Products API
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product

### MCP API
- `GET /api/mcp/tools` - List available MCP tools
- `POST /api/mcp/execute/:toolName` - Execute specific MCP tool
- `POST /api/mcp/chat` - Smart chat (LLM decides which tool to use)
- `GET /api/mcp/ollama/status` - Check Ollama availability

## Available MCP Tools

1. **fetch-products** - Fetch products from database
2. **analyze-products** - Use LLM to analyze product data
3. **chat-llm** - Direct chat with LLM
4. **create-product** - Create new product

## Example Usage

### Test MCP Tools

```bash
# List available tools
curl http://localhost:3000/api/mcp/tools

# Fetch all products
curl -X POST http://localhost:3000/api/mcp/execute/fetch-products \
  -H "Content-Type: application/json" \
  -d '{}'

# Analyze products with LLM
curl -X POST http://localhost:3000/api/mcp/execute/analyze-products \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the most expensive products?"}'

# Smart chat
curl -X POST http://localhost:3000/api/mcp/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me all products"}'
```

### Test Ollama Integration

```bash
# Check Ollama status
curl http://localhost:3000/api/mcp/ollama/status

# Chat with LLM
curl -X POST http://localhost:3000/api/mcp/execute/chat-llm \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?"}'
```

## Next Steps

1. **Frontend**: Add React/Next.js frontend
2. **Authentication**: Add user authentication
3. **Advanced MCP**: Implement more sophisticated tool selection
4. **Real-time**: Add WebSocket support for streaming responses
5. **Deployment**: Deploy to cloud platform

## Troubleshooting

- **Ollama not available**: Make sure Ollama is running (`ollama serve`)
- **Database connection**: Check your MySQL credentials in `.env`
- **Port conflicts**: Change PORT in `.env` if 3000 is occupied# ollamaChat
