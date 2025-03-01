"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { IconBrandGoogle } from "@tabler/icons-react";

export function SignupFormDemo() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      // Sign in after successful signup
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during sign up");
      }
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
      <h2 className="font-bold text-xl text-neutral-200">
        Create your account
      </h2>
      <p className="text-sm max-w-sm mt-1 text-neutral-300">
        Join Bidzy to start bidding on projects
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mt-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
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
            minLength={8}
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-blue-600 to-blue-700 block w-full text-white rounded-lg px-4 py-3 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:opacity-70"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
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
          Continue with Google
        </button>

        <div className="text-sm text-neutral-400 text-center mt-6">
          Already have an account?{" "}
          <button
            type="button"
            className="text-neutral-300 hover:text-blue-400"
            onClick={() => router.push("/login")}
          >
            Sign In
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
