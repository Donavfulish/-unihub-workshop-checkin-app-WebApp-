"use server";

import { RegistrationService } from "@/services/modules/registration/registration.service";
import type { RegistrationRequestBody } from "@/types";

export async function createRegistrationAction(
  payload: RegistrationRequestBody,
  token?: string,
) {
  return RegistrationService.create(payload, { token });
}

export async function registerLegacyAction(
  payload: RegistrationRequestBody,
  token?: string,
) {
  return RegistrationService.registerLegacy(payload, { token });
}

export async function listMyRegistrationsAction(token?: string) {
  return RegistrationService.listMine({ token });
}
