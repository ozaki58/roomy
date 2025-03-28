

import { AzureOpenAI } from "openai";

const client = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT, 
  deployment: "text-embedding-3-small",
  apiVersion: "2024-10-21"
});

export function getOpenAIClient(): AzureOpenAI {
  if (!client) {
    return new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      deployment: "text-embedding-3-small",
      apiVersion: "2024-10-21"
    });
  }
  return client;
}

/**
 
 * @param {string} text 
 * @returns {Promise<number[]>}
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const client = getOpenAIClient();
    const result = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: text
    });
    return result.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}