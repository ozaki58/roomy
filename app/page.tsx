// app/page.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server';

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
export default function App() {

  if (user) {
    redirect('/home');
  } else {
    redirect('/searchGroup');
  }
  return null;
}
