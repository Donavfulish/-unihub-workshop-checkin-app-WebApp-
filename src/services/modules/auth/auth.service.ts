import { serviceRequest } from "@/services/modules/shared-request";
import type {
  LoginDTO,
  RegisterDTO,
  LoginResponseDTO,
  RegisterResponseDTO,
} from "@/types";
import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/auth";

export const AUTH_ROUTES = {
  register: `${BASE_PATH}/register`,
  login: `${BASE_PATH}/login`,
} as const;
export const AuthService = {
  register: (data: RegisterDTO) =>
    serviceRequest<RegisterResponseDTO>(AUTH_ROUTES.register, "POST", {
      body: data,
    }),

  login: (data: LoginDTO) =>
    serviceRequest<LoginResponseDTO>(AUTH_ROUTES.login, "POST", { body: data }),
};
