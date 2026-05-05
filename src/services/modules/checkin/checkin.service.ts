import { serviceRequest } from "@/services/modules/shared-request";
import type { AuthRequestOptions } from "@/types/http";
import type { CheckinDTO } from "@/types";
import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/checkin";

export const CHECKIN_ROUTES = {
  submit: `${BASE_PATH}/`,
} as const;
export const CheckinService = {
  submit: (data: CheckinDTO, options?: AuthRequestOptions) =>
    serviceRequest<CheckinDTO>(CHECKIN_ROUTES.submit, "POST", {
      ...options,
      body: data,
    }),
};
