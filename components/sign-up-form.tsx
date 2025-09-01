"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [name, setName] = useState(""); // 🔹 Champ nom
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { name }, // 🔹 Ajout du nom dans user_metadata
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 items-center justify-center min-h-screen bg-emerald-50",
        className
      )}
      {...props}
    >
      <Card className="bg-emerald-100 border-emerald-300 shadow-lg w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-emerald-800 font-bold">
            Sign Up
          </CardTitle>
          <CardDescription className="text-emerald-700">
            Create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            {/* 🔹 Champ Nom */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-emerald-800">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-emerald-800">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-emerald-800">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="repeat-password" className="text-emerald-800">
                Repeat Password
              </Label>
              <Input
                id="repeat-password"
                type="password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating an account..." : "Sign up"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-emerald-700">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="underline underline-offset-4 text-emerald-800 hover:text-emerald-900"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
