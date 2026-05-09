import { serviceRequest } from "@/services/modules/shared-request";
import type { AuthRequestOptions } from "@/types/http";
import type {
  ReservationResponse,
  RegistrationListResponse,
  RegistrationRequestBody,
} from "@/types";

const BASE_PATH = "/registrations";

export const RegistrationService = {
  listMine: (options?: AuthRequestOptions) =>
    serviceRequest<RegistrationListResponse>(`${BASE_PATH}/me`, "GET", options),

  create: (data: RegistrationRequestBody, options?: AuthRequestOptions) =>
    serviceRequest<ReservationResponse>(`${BASE_PATH}/`, "POST", {
      ...options,
      body: data,
    }),

  registerLegacy: (
    data: RegistrationRequestBody,
    options?: AuthRequestOptions,
  ) =>
    serviceRequest<RegistrationDTO>(`${BASE_PATH}/register`, "POST", {
      ...options,
      body: data,
    }),
};
