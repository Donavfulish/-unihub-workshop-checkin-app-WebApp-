"use server";

import { CsvImportService } from "@/services/modules/csv-import/csv-import.service";
import type { JsonObject } from "@/types/http";
import type { CsvImportSummary } from "@/types";

export async function runCsvImportAction(
  payload: JsonObject,
  token?: string,
): Promise<import("@/types/api").ApiResponse<CsvImportSummary>> {
  return CsvImportService.run(payload, { token });
}
