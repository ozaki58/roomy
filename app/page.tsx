// app/page.tsx
'use client';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
export default async function App() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    redirect('/home');
  } else {
    redirect('/searchGroup');
  }
}
