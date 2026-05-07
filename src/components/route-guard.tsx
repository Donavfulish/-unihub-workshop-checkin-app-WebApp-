"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import type { AppRole } from "@/types";

type RouteGuardProps = {
  children: React.ReactNode;
  /** If set, user must have one of these roles (JWT `role`). */
  roles?: AppRole[];
};

/**
 * Client-side guard for pages that need authentication (and optionally RBAC).
 * For stronger protection, APIs must still enforce roles server-side.
 */
export function RouteGuard({ children, roles }: RouteGuardProps) {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (roles?.length) {
      const r = user.role as AppRole | null | undefined;
      if (!r || !roles.includes(r)) {
        router.replace("/");
      }
    }
  }, [isReady, user, roles, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (roles?.length) {
    const r = user.role as AppRole | null | undefined;
    if (!r || !roles.includes(r)) {
      return null;
    }
  }

  return <>{children}</>;
}
