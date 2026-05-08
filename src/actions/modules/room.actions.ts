"use server";

import { RoomService } from "@/services/modules/room/room.service";

export async function getRoomsAction(token?: string) {
  try {
    const result = await RoomService.list({ token });
    console.log("[getRoomsAction] Success:", result);
    return result;
  } catch (error) {
    console.error("[getRoomsAction] Error:", error);
    throw error;
  }
}

export async function getRoomByIdAction(id: number, token?: string) {
  try {
    const result = await RoomService.getById(id, { token });
    console.log("[getRoomByIdAction] Success:", result);
    return result;
  } catch (error) {
    console.error("[getRoomByIdAction] Error:", error);
    throw error;
  }
}
