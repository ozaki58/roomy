import { NextRequest, NextResponse } from 'next/server';

import { generateEmbedding } from '@/lib/azure-openai';

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }
    
    
    const embedding = await generateEmbedding(query);
    const { data, error } = await supabase
      .rpc('match_test_groups', {
        query_embedding: embedding,
        match_threshold: 0.3,
        match_count: 10
      });
    
    if (error) {
      console.error('Error searching test_groups:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json({ error: 'Failed to search test_groups' }, { status: 500 });
  }
}