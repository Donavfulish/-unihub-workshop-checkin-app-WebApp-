import { getBaseUrl } from "@/lib/env";
import type { ApiResponse } from "@/types/api";

function normalizePath(path: string): string {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${normalizePath(path)}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status} ${errorText}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetch JSON API using the backend envelope `{ data, error, meta }`.
 * Does not throw on HTTP 4xx/5xx when the body follows that shape.
 */
export async function apiFetchApiResponse<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${normalizePath(path)}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  let parsed: unknown = null;
  try {
    parsed = await response.json();
  } catch {
    return {
      data: null,
      error: {
        message: "Phản hồi không hợp lệ từ máy chủ",
        status: response.status,
      },
    };
  }

  const envelope = parsed as ApiResponse<T>;

  if (envelope?.error) {
    return envelope;
  }

  if (!response.ok) {
    return {
      data: null,
      error: {
        message:
          typeof envelope === "object" && envelope !== null && "message" in envelope
            ? String((envelope as { message?: string }).message)
            : response.statusText,
        status: response.status,
      },
    };
  }

  return envelope;
}
