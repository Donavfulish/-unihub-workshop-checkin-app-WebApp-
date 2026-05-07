/** Default matches current BE `.env` PORT=4000. */
const DEFAULT_BASE_URL = "http://localhost:4000";

export function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();

  if (!baseUrl) {
    return DEFAULT_BASE_URL;
  }

  return baseUrl.replace(/\/$/, "");
}
