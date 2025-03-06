// app/page.tsx
'use client';
import { redirect } from 'next/navigation';

export default function App() {
  redirect('/home');
  return null;
}
