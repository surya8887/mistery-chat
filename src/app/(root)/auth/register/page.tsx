"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signUpSchema } from "@/schema/signUPSchema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type FormData = z.infer<typeof signUpSchema>;

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormData) => {
    console.log("✅ Register Data:", data);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Something went wrong");
      } else {
        toast.success("User registered successfully!");
      }
    } catch (error) {
      toast.error("Network error. Try again.");
      console.error("Request failed:", error);
    }
  };

  const handleGoogleRegister = () => {
    console.log("🔗 Google register clicked");
    // Replace with signIn("google") if using NextAuth
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted to-background px-4">
      <Card className="w-full max-w-md border shadow-lg rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription>Start your journey today</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Username */}
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...register("username")} />
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Register
            </Button>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
              <span className="h-px flex-1 bg-muted-foreground/30"></span>
              or
              <span className="h-px flex-1 bg-muted-foreground/30"></span>
            </div>

            {/* Google Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 hover:bg-muted transition"
              onClick={handleGoogleRegister}
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </Button>

            {/* Login Redirect */}
            <p className="text-sm text-center text-muted-foreground pt-2">
              Already have an account?{" "}
              <Link href="/auth/login/" className="text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

