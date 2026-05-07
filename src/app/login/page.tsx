"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";

function LoginForm() {
  const { login, user, isReady } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const registeredToastShown = useRef(false);

  useEffect(() => {
    if (registeredToastShown.current) return;
    if (searchParams.get("registered") === "1") {
      registeredToastShown.current = true;
      toast.success("Đăng ký thành công. Vui lòng đăng nhập.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isReady || !user) return;
    const next = searchParams.get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      router.replace(next);
      return;
    }
    router.replace(user.role === "admin" ? "/admin" : "/");
  }, [isReady, user, router, searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const result = await login({ email: email.trim(), password });
    setPending(false);
    if (!result.ok) {
      setError(result.message);
    }
  }

  return (
    <main className="container mx-auto flex max-w-md flex-col gap-6 px-4 py-12 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email và mật khẩu UniHub Workshop của bạn.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
              {pending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                Đăng ký
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
            Đang tải...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
