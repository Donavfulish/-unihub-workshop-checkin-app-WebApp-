import { serviceRequest } from "@/services/modules/shared-request";
import type { AuthRequestOptions, JsonObject } from "@/types/http";
import type { AISummaryResult } from "@/types";
import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/ai-summary";

export const AI_SUMMARY_ROUTES = {
  summarizePdf: `${BASE_PATH}/pdf`,
} as const;
export const AISummaryService = {
  summarizePdf: (data: JsonObject, options?: AuthRequestOptions) =>
    serviceRequest<AISummaryResult>(AI_SUMMARY_ROUTES.summarizePdf, "POST", {
      ...options,
      body: data,
    }),
};
