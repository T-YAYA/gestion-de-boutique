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
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
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
      {success ? (
        <Card className="bg-emerald-100 border-emerald-300 shadow-lg w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-emerald-800 font-bold">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-emerald-700">
              Password reset instructions sent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-700">
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
            <div className="mt-4 text-center text-sm">
              Back to{" "}
              <Link
                href="/auth/login"
                className="underline underline-offset-4 text-emerald-800 hover:text-emerald-900"
              >
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-emerald-100 border-emerald-300 shadow-lg w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-emerald-800 font-bold">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-emerald-700">
              Type in your email and we&apos;ll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleForgotPassword}
              className="flex flex-col gap-4"
            >
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
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset email"}
              </Button>
              <div className="mt-4 text-center text-sm text-emerald-700">
                Back to{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4 text-emerald-800 hover:text-emerald-900"
                >
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
