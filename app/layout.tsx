import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar"; 

import { Menu } from "lucide-react"; 
import Link from "next/link";
import { NotificationDropdown } from "@/components/notification/NotificationDropdown";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
       
          <div className="flex-1 flex flex-col">
           
            <header className="bg-[#FF5722] border-b p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
              <Link href="/home">
                <h2 className="text-2xl font-bold text-white">roomy</h2>
              </Link>
              <NotificationDropdown />
              <Sidebar />
         
            </header>
            
            <main className="flex-1 overflow-auto p-4">
              {children}  
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}