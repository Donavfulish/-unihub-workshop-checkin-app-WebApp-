import { serviceRequest } from "@/services/modules/shared-request";
import type { AuthRequestOptions } from "@/types/http";
import type { RoomResponse, RoomsListResponse } from "@/types";
import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/rooms";

export const RoomService = {
  list: (options?: AuthRequestOptions) =>
    serviceRequest<RoomsListResponse>(`${BASE_PATH}/`, "GET", options),

  getById: (id: number, options?: AuthRequestOptions) =>
    serviceRequest<RoomResponse>(`${BASE_PATH}/${id}`, "GET", options),
};
