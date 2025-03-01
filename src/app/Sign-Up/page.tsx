"use client";

import Navbar from "@/components/Navbar";
import { SignupFormDemo } from "@/components/sections/signupform";
import { ClientProvider } from "@/components/ClientProvider";

export default function SignUpPage() {
  return (
    <ClientProvider>
      <Navbar />
      <div className="bg-zinc-900 min-h-screen flex items-center justify-center p-4">
        <SignupFormDemo />
      </div>
    </ClientProvider>
  );
}
