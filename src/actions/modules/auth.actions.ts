"use server";

import { AuthService } from "@/services/modules/auth/auth.service";
import type { LoginDTO, RegisterDTO } from "@/types";

export async function registerAction(payload: RegisterDTO) {
  return AuthService.register(payload);
}

export async function loginAction(payload: LoginDTO) {
  return AuthService.login(payload);
}
