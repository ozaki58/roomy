import { NextRequest, NextResponse } from 'next/server';

import { generateEmbedding } from '@/lib/azure-openai';

import { createClient } from "@supabase/supabase-js";
import { create } from "domain";
import { Database } from '@/components/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// GET - グループ一覧取得
export async function GET() {
  const { data, error } = await supabase
    .from('test_groups')
    .select('id, name, description, tags, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - グループ登録
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, tags } = body;
    
 
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    const contentText = `${name} ${description || ''} ${tags ? tags.join(' ') : ''}`;
    let embedding;
    try {
      embedding = await generateEmbedding(contentText);
    } catch (embeddingError) {
      console.error('Embedding generation failed:', embeddingError);
      return NextResponse.json({ error: `Embedding generation failed: ${embeddingError instanceof Error ? embeddingError.message : 'Unknown error'}` }, { status: 500 });
    }
    
    // グループデータを保存
    const { data, error } = await supabase
      .from('test_groups')
      .insert({
        name,
        description,
        tags,
        embedding
      })
      .select();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data[0], { status: 201 });
} catch (error) {
    console.error('Error creating group:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to create group: ${errorMessage}` }, { status: 500 });
  }
}