"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { IconBrandGoogle } from "@tabler/icons-react";

export function LoginFormDemo() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/home");
      }
    } catch (error) {
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/home" });
    } catch (error) {
      setError("An error occurred with Google sign in");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-zinc-900">
      <h2 className="font-bold text-xl text-neutral-200">Welcome to Bidzy</h2>
      <p className="text-sm max-w-sm mt-1 text-neutral-300">
        Login to your account to continue
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mt-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer className="w-full">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="johndoe@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-8">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-blue-600 to-blue-700 block w-full text-white rounded-lg px-4 py-3 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:opacity-70"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
          <BottomGradient />
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-zinc-600"></div>
          <p className="mx-4 text-zinc-400">or</p>
          <div className="flex-1 border-t border-zinc-600"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full px-4 py-3 mt-2 border border-zinc-600 rounded-lg text-white hover:bg-zinc-800 transition-all"
          disabled={isLoading}
        >
          <IconBrandGoogle className="w-5 h-5 mr-2" />
          Sign in with Google
        </button>

        <div className="text-sm text-neutral-400 text-center mt-6">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="text-neutral-300 hover:text-blue-400"
            onClick={() => router.push("/Sign-Up")}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
