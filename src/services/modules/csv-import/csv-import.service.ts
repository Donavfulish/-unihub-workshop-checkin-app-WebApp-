import { serviceRequest } from "@/services/modules/shared-request";
import type { AuthRequestOptions, JsonObject } from "@/types/http";
import type { CsvImportSummary } from "@/types";
import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/csv-import";

export const CSV_IMPORT_ROUTES = {
  run: `${BASE_PATH}/run`,
} as const;
export const CsvImportService = {
  run: (data: JsonObject, options?: AuthRequestOptions) =>
    serviceRequest<CsvImportSummary>(CSV_IMPORT_ROUTES.run, "POST", {
      ...options,
      body: data,
    }),
};
