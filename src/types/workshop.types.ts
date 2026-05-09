import type { RoomResponse } from "./room.types";

export interface WorkshopResponse {
  id: number;
  title: string;
  description?: string | null;
  fee?: number | string | null;
  total_slots?: number | null;
  remaining_slots?: number | null;
  start_time?: Date | null;
  end_time?: Date | null;
  room_id?: number | null;
  created_by?: string | null;
  room?: RoomResponse | null;
}

export interface WorkshopsListResponse {
  workshops: WorkshopResponse[];
  total: number;
}

export interface WorkshopStatsResponse {
  ongoing_workshops: Array<{
    id: number;
    title: string;
    registered: number;
    total_slots?: number | null;
  }>;
  total_registrations: number;
}

export interface CreateWorkshopDTO {
  title: string;
  description?: string | null;
  fee?: number | null;
  total_slots?: number | null;
  remaining_slots?: number | null;
  start_time?: string | null;
  end_time?: string | null;
  room_id?: number | null;
}

export type UpdateWorkshopDTO = Partial<CreateWorkshopDTO>;
