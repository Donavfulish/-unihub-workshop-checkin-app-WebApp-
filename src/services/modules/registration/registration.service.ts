import { serviceRequest } from "@/services/modules/shared-request";
import type { AuthRequestOptions } from "@/types/http";
import type { RegistrationRequestBody, RegistrationDTO } from "@/types";
import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/registrations";

export const RegistrationService = {
  create: (data: RegistrationRequestBody, options?: AuthRequestOptions) =>
    serviceRequest<RegistrationDTO>(`${BASE_PATH}/`, "POST", {
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
