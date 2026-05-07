"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthService } from "@/services/modules/auth/auth.service";
import type { LoginDTO, RegisterDTO, AuthUserDTO } from "@/types";
import {
  clearStoredSession,
  readStoredSession,
  writeStoredSession,
} from "@/lib/auth-storage";

export type AppRole = "admin" | "staff" | "student";

type AuthContextValue = {
  user: AuthUserDTO | null;
  accessToken: string | null;
  /** False until client has read localStorage (avoid flash of wrong UI). */
  isReady: boolean;
  login: (payload: LoginDTO) => Promise<{ ok: true } | { ok: false; message: string }>;
  register: (
    payload: RegisterDTO,
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUserDTO | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = readStoredSession();
    if (stored) {
      setUser(stored.user);
      setAccessToken(stored.accessToken);
    }
    setIsReady(true);
  }, []);

  const persistSession = useCallback((token: string, nextUser: AuthUserDTO) => {
    setAccessToken(token);
    setUser(nextUser);
    writeStoredSession({ accessToken: token, user: nextUser });
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    clearStoredSession();
  }, []);

  const refreshUser = useCallback(async () => {
    if (!accessToken) return;
    const res = await AuthService.me({ token: accessToken });
    if (res.error || !res.data) {
      logout();
      return;
    }
    const u = res.data;
    const next: AuthUserDTO = {
      id: u.id,
      email: u.email,
      username: u.username,
      full_name: u.full_name ?? null,
      role_id: u.role_id ?? null,
      role: (u.role as AppRole | null | undefined) ?? null,
    };
    persistSession(accessToken, next);
  }, [accessToken, logout, persistSession]);

  const login = useCallback(
    async (payload: LoginDTO) => {
      const res = await AuthService.login(payload);
      if (res.error || !res.data?.accessToken || !res.data.user) {
        return {
          ok: false as const,
          message: res.error?.message || "Đăng nhập thất bại",
        };
      }
      persistSession(res.data.accessToken, res.data.user);
      return { ok: true as const };
    },
    [persistSession],
  );

  const register = useCallback(async (payload: RegisterDTO) => {
    const res = await AuthService.register(payload);
    if (res.error || !res.data?.user) {
      return {
        ok: false as const,
        message: res.error?.message || "Đăng ký thất bại",
      };
    }
    return { ok: true as const };
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isReady,
      login,
      register,
      logout,
      refreshUser,
    }),
    [accessToken, isReady, login, logout, refreshUser, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
