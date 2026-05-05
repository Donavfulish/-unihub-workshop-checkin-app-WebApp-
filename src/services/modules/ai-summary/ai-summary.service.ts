import { serviceRequest } from "@/services/modules/shared-request";
import type { AuthRequestOptions, JsonObject } from "@/types/http";
import type { AISummaryResult } from "@/types";
import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/ai-summary";

export const AISummaryService = {
  summarizePdf: (data: JsonObject, options?: AuthRequestOptions) =>
    serviceRequest<AISummaryResult>(`${BASE_PATH}/pdf`, "POST", {
      ...options,
      body: data,
    }),
};
