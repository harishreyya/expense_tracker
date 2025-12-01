"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import Header from "../components/Header";

interface ProvidersProps {
  children: React.ReactNode;
  session?: any; 
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-slate-50">
        <Header />
        {children}
      </div>
    </SessionProvider>
  );
}
