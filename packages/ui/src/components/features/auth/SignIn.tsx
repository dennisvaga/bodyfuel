"use client";

import Link from "next/link";
import { Button } from "#components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#components/ui/card";
import { Input } from "#components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "#hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#components/ui/form";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { providerMap, SignInInput, signInSchema } from "@repo/auth";
import { onErrors } from "@repo/shared";

interface signInProps {
  callbackUrl?: string;
  isAdmin?: boolean; // From middleware
}

const SignIn = ({ callbackUrl, isAdmin = false }: signInProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (isAuthenticated) router.push(callbackUrl || "/");
  }, [isAuthenticated, router]);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function handleCredentialsSignIn(data: SignInInput) {
    // result object is always in auth.js structure
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, // Avoid automatic redirect
    });

    if (!result || result.error) {
      if (result?.error?.includes("CredentialsSignin")) {
        form.setError("password", { message: "Invalid email or password" });
      } else {
        toast({
          variant: "destructive",
          description: result?.error || "Authentication failed.",
        });
      }
      return;
    }

    router.push(callbackUrl || "/");
  }

  return (
    <div className="layout flex justify-center items-center min-h-[80vh]">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* CREDENTIALS LOGIN FORM */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCredentialsSignIn, onErrors)}
                className="grid gap-4"
              >
                <div className="flex flex-col gap-4 pb-5">
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="john@example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>Password</FormLabel>
                          <Link
                            href="#"
                            className="ml-auto inline-block text-base underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>

                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Login Button */}
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>

            {/* OAUTH (Google) */}
            {!isAdmin &&
              Object.values(providerMap).map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    signIn(provider.id, { callbackUrl: callbackUrl ?? "/" });
                  }}
                >
                  Login with {provider.name}
                </Button>
              ))}
          </div>
          {/* Sign Up Link */}
          {!isAdmin && (
            <div className="mt-4 text-center text-base">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
