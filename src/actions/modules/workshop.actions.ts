"use server";

import { WorkshopService } from "@/services/modules/workshop/workshop.service";
import type { CreateWorkshopDTO, UpdateWorkshopDTO } from "@/types";

export async function getWorkshopsAction(token?: string) {
  return WorkshopService.list({ token });
}

export async function createWorkshopAction(
  payload: CreateWorkshopDTO,
  token?: string,
) {
  try {
    const result = await WorkshopService.create(payload, { token });
    console.log("[createWorkshopAction] Success:", result);
    return result;
  } catch (error) {
    console.error("[createWorkshopAction] Error:", error);
    throw error;
  }
}

export async function getWorkshopByIdAction(id: string, token?: string) {
  return WorkshopService.getById(id, { token });
}

export async function getWorkshopStatsAction(token?: string) {
  return WorkshopService.stats({ token });
}

export async function updateWorkshopAction(
  id: string,
  payload: UpdateWorkshopDTO,
  token?: string,
) {
  return WorkshopService.update(id, payload, { token });
}

export async function deleteWorkshopAction(id: string, token?: string) {
  return WorkshopService.delete(id, { token });
}
