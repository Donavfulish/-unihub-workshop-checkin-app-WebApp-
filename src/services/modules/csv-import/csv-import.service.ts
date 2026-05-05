import { serviceRequest } from "@/services/modules/shared-request";
import type { AuthRequestOptions, JsonObject } from "@/types/http";
import type { CsvImportSummary } from "@/types";
import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/csv-import";

export const CsvImportService = {
  run: (data: JsonObject, options?: AuthRequestOptions) =>
    serviceRequest<CsvImportSummary>(`${BASE_PATH}/run`, "POST", {
      ...options,
      body: data,
    }),
};
