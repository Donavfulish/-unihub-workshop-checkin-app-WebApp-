import { serviceRequest } from "@/services/modules/shared-request";
import type {
  LoginDTO,
  RegisterDTO,
  LoginResponseDTO,
  RegisterResponseDTO,
} from "@/types";
import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/auth";

export const AuthService = {
  register: (data: RegisterDTO) =>
    serviceRequest<RegisterResponseDTO>(`${BASE_PATH}/register`, "POST", {
      body: data,
    }),

  login: (data: LoginDTO) =>
    serviceRequest<LoginResponseDTO>(`${BASE_PATH}/login`, "POST", { body: data }),
};
