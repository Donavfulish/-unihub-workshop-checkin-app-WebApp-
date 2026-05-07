import { serviceRequest } from "@/services/modules/shared-request";
import type {
  LoginDTO,
  RegisterDTO,
  LoginResponseDTO,
  RegisterResponseDTO,
  AuthUserDTO,
} from "@/types";
import type { AuthRequestOptions } from "@/types/http";

const BASE_PATH = "/auth";

export const AuthService = {
  register: (data: RegisterDTO) =>
    serviceRequest<RegisterResponseDTO>(`${BASE_PATH}/register`, "POST", {
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    }),

  login: (data: LoginDTO) =>
    serviceRequest<LoginResponseDTO>(`${BASE_PATH}/login`, "POST", {
      body: data,
    }),

  me: (options?: AuthRequestOptions) =>
    serviceRequest<AuthUserDTO>(`${BASE_PATH}/me`, "GET", options),
};
