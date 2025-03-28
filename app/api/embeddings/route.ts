import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/azure-openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const embedding = await generateEmbedding(text);
    return NextResponse.json({ embedding });
  } catch (error) {
    console.error('Error in embeddings API:', error);
    return NextResponse.json({ error: 'Failed to generate embedding' }, { status: 500 });
  }
}