/** Default matches BE `PORT` (see BE `.env.example`). */
const DEFAULT_BASE_URL = "http://localhost:3000";

export function getBaseUrl(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.trim() ?? process.env.BASE_URL?.trim();

  if (!baseUrl) {
    return DEFAULT_BASE_URL;
  }

  return baseUrl.replace(/\/$/, "");
}
