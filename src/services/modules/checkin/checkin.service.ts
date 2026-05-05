import { serviceRequest } from "@/services/modules/shared-request";
import type { AuthRequestOptions } from "@/types/http";
import type { CheckinDTO } from "@/types";
import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/checkin";

export const CheckinService = {
  submit: (data: CheckinDTO, options?: AuthRequestOptions) =>
    serviceRequest<CheckinDTO>(`${BASE_PATH}/`, "POST", {
      ...options,
      body: data,
    }),
};
