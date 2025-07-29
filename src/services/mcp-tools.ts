import { PrismaClient } from '@prisma/client';
import { OllamaService } from './ollama';

const prisma = new PrismaClient();
const ollama = new OllamaService();

export interface MCPTool {
    name: string;
    description: string;
    execute: (input: any) => Promise<any>;
}

export const mcpTools: MCPTool[] = [
    {
        name: 'fetch-products',
        description: 'Fetch products from MySQL database using Prisma',
        execute: async (input: { category?: string; inStock?: boolean }) => {
            const where: any = {};

            if (input.category) {
                where.category = input.category;
            }

            if (input.inStock !== undefined) {
                where.inStock = input.inStock;
            }

            const products = await prisma.product.findMany({
                where,
                orderBy: { createdAt: 'desc' }
            });

            return { products, count: products.length };
        }
    },

    {
        name: 'analyze-products',
        description: 'Use LLM to analyze product data and answer questions',
        execute: async (input: { question: string; category?: string }) => {
            // First fetch the data
            const where = input.category ? { category: input.category } : {};
            const products = await prisma.product.findMany({ where });

            // Create a more specific prompt for the LLM
            const prompt = `You are analyzing product data from a database. Here is the complete product data:

${JSON.stringify(products, null, 2)}

Based on this data, please answer the following question: ${input.question}

Important: Use ONLY the data provided above to answer. Do not say you don't have access to data - the data is right here. Provide specific details from the products shown.`;

            // Then analyze with LLM
            const analysis = await ollama.chat(prompt);

            return {
                question: input.question,
                analysis,
                dataCount: products.length,
                products: products // Include the raw data too
            };
        }
    },

    {
        name: 'chat-llm',
        description: 'Direct chat with the LLM',
        execute: async (input: { prompt: string; context?: string }) => {
            const response = await ollama.chat(input.prompt, input.context);
            return { response };
        }
    },

    {
        name: 'create-product',
        description: 'Create a new product in the database',
        execute: async (input: { name: string; description?: string; price: number; category: string; inStock?: boolean }) => {
            const product = await prisma.product.create({
                data: {
                    name: input.name,
                    description: input.description,
                    price: input.price,
                    category: input.category,
                    inStock: input.inStock ?? true
                }
            });

            return { product, message: 'Product created successfully' };
        }
    }
];

export async function executeMCPTool(toolName: string, input: any) {
    const tool = mcpTools.find(t => t.name === toolName);

    if (!tool) {
        throw new Error(`Tool '${toolName}' not found`);
    }

    return await tool.execute(input);
}