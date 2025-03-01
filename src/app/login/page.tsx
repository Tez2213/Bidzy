"use client";

import Navbar from "@/components/Navbar";
import { LoginFormDemo } from "@/components/sections/loginform";
import { ClientProvider } from "@/components/ClientProvider";

export default function LoginPage() {
  return (
    <ClientProvider>
      <Navbar />
      <div className="bg-zinc-900 min-h-screen flex items-center justify-center p-4">
        <LoginFormDemo />
      </div>
    </ClientProvider>
  );
}
