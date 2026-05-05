import { apiFetch } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { AuthRequestOptions, JsonObject } from "@/types/http";

interface ServiceRequestOptions extends AuthRequestOptions {
  body?: JsonObject;
}

export async function serviceRequest<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  options?: ServiceRequestOptions,
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {};

  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  return apiFetch<ApiResponse<T>>(path, {
    method,
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
}
