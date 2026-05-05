"use server";

import { AISummaryService } from "@/services/modules/ai-summary/ai-summary.service";
import type { JsonObject } from "@/types/http";
import type { AISummaryResult } from "@/types";

export async function summarizePdfAction(
  payload: JsonObject,
  token?: string,
): Promise<import("@/types/api").ApiResponse<AISummaryResult>> {
  return AISummaryService.summarizePdf(payload, { token });
}
