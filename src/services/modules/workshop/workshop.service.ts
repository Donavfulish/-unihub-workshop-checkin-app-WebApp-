import { serviceRequest } from "@/services/modules/shared-request";
import type { AuthRequestOptions } from "@/types/http";
import type {
  WorkshopResponse,
  WorkshopsListResponse,
  CreateWorkshopDTO,
  UpdateWorkshopDTO,
} from "@/types";
import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/workshops";

export const WorkshopService = {
  list: (options?: AuthRequestOptions) =>
    serviceRequest<WorkshopsListResponse>(`${BASE_PATH}/`, "GET", options),

  create: (data: CreateWorkshopDTO, options?: AuthRequestOptions) =>
    serviceRequest<WorkshopResponse>(`${BASE_PATH}/`, "POST", {
      ...options,
      body: data,
    }),

  getById: (id: string, options?: AuthRequestOptions) =>
    serviceRequest<WorkshopResponse>(`${BASE_PATH}/${id}`, "GET", options),

  update: (id: string, data: UpdateWorkshopDTO, options?: AuthRequestOptions) =>
    serviceRequest<WorkshopResponse>(`${BASE_PATH}/${id}`, "PUT", {
      ...options,
      body: data,
    }),

  delete: (id: string, options?: AuthRequestOptions) =>
    serviceRequest<{ success: boolean }>(
      `${BASE_PATH}/${id}`,
      "DELETE",
      options,
    ),
  stats: (options?: AuthRequestOptions) =>
    serviceRequest<any>(`${BASE_PATH}/stats`, "GET", options),
};
