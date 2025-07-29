import axios from 'axios';

export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

export class OllamaService {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl?: string, model?: string) {
    this.baseUrl = baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = model || process.env.OLLAMA_MODEL || 'deepseek-coder:1.3b';
  }

  async chat(prompt: string, context?: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: this.model,
        prompt: context ? `${context}\n\nUser: ${prompt}` : prompt,
        stream: false
      });

      return response.data.response;
    } catch (error) {
      console.error('Ollama API error:', error);
      throw new Error('Failed to communicate with Ollama');
    }
  }

  async analyzeData(data: any[], question: string): Promise<string> {
    const context = `You are a helpful assistant analyzing product data. Here's the data:\n${JSON.stringify(data, null, 2)}`;
    return this.chat(question, context);
  }

  async isAvailable(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/api/tags`);
      return true;
    } catch {
      return false;
    }
  }
}