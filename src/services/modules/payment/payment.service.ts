import { serviceRequest } from "@/services/modules/shared-request";
import type { AuthRequestOptions } from "@/types/http";
import type { PaymentDTO, PaymentListResponse, PaymentRequestBody } from "@/types";

const BASE_PATH = "/payments";

export const PaymentService = {
  listMine: (options?: AuthRequestOptions) =>
    serviceRequest<PaymentListResponse>(`${BASE_PATH}/me`, "GET", options),

  create: (data: PaymentRequestBody, options?: AuthRequestOptions) =>
    serviceRequest<PaymentDTO>(`${BASE_PATH}/`, "POST", {
      ...options,
      body: data,
    }),
};
