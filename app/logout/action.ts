'use server'
import { createClient } from "../utils/supabase/server";
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
export async function logout(formData: FormData) {
    const supabase = await createClient()
  
   
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      console.error("Signup error:", error);
      redirect('/error')
    }
  
    revalidatePath('/', 'layout')
    redirect('/')
  }