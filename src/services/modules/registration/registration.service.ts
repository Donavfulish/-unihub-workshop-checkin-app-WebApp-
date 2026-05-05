import { serviceRequest } from "@/services/modules/shared-request";
import type { AuthRequestOptions } from "@/types/http";
import type { RegistrationRequestBody, RegistrationDTO } from "@/types";
import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/registrations";

export const REGISTRATION_ROUTES = {
  create: `${BASE_PATH}/`,
  legacyRegister: `${BASE_PATH}/register`,
} as const;
export const RegistrationService = {
  create: (data: RegistrationRequestBody, options?: AuthRequestOptions) =>
    serviceRequest<RegistrationDTO>(REGISTRATION_ROUTES.create, "POST", {
      ...options,
      body: data,
    }),

  registerLegacy: (
    data: RegistrationRequestBody,
    options?: AuthRequestOptions,
  ) =>
    serviceRequest<RegistrationDTO>(
      REGISTRATION_ROUTES.legacyRegister,
      "POST",
      {
        ...options,
        body: data,
      },
    ),
};
