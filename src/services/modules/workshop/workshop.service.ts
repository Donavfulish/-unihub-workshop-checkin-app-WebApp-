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

export const WORKSHOP_ROUTES = {
  list: `${BASE_PATH}/`,
  create: `${BASE_PATH}/`,
  detail: (id: string) => `${BASE_PATH}/${id}`,
  update: (id: string) => `${BASE_PATH}/${id}`,
  remove: (id: string) => `${BASE_PATH}/${id}`,
} as const;

export const WorkshopService = {
  list: (options?: AuthRequestOptions) =>
    serviceRequest<WorkshopsListResponse>(WORKSHOP_ROUTES.list, "GET", options),

  create: (data: CreateWorkshopDTO, options?: AuthRequestOptions) =>
    serviceRequest<WorkshopResponse>(WORKSHOP_ROUTES.create, "POST", {
      ...options,
      body: data,
    }),

  getById: (id: string, options?: AuthRequestOptions) =>
    serviceRequest<WorkshopResponse>(
      WORKSHOP_ROUTES.detail(id),
      "GET",
      options,
    ),

  update: (id: string, data: UpdateWorkshopDTO, options?: AuthRequestOptions) =>
    serviceRequest<WorkshopResponse>(WORKSHOP_ROUTES.update(id), "PUT", {
      ...options,
      body: data,
    }),

  delete: (id: string, options?: AuthRequestOptions) =>
    serviceRequest<{ success: boolean }>(
      WORKSHOP_ROUTES.remove(id),
      "DELETE",
      options,
    ),
};
