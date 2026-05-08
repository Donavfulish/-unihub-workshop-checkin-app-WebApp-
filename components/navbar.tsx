"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserDropdown } from "@/components/user-dropdown";
import { useAuth } from "@/contexts/auth-context";
import type { AppRole } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const role = (user?.role as AppRole | undefined) ?? undefined;
  const displayName =
    user?.full_name?.trim() ||
    user?.username?.trim() ||
    user?.email?.split("@")[0] ||
    "Khách";

  const isAdmin = role === "admin";
  const isStaff = role === "staff";
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={isAdmin ? "/admin" : "/"}
          className="flex items-center gap-2"
        >
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            UH
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">
            UniHub
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          {user && isAdmin ? (
            <>
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  Workshops
                </Button>
              </Link>
            </>
          ) : user ? (
            <>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Workshops
                </Button>
              </Link>
              {(role === "student" || isStaff) && (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    My Workshops
                  </Button>
                </Link>
              )}
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <UserDropdown
              userName={displayName}
              userRole={
                role === "admin"
                  ? "admin"
                  : role === "staff"
                    ? "staff"
                    : "student"
              }
              onSignOut={logout}
            />
          ) : !isAuthPage ? (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Đăng ký</Button>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
