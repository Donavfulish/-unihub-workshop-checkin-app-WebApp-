import { serviceRequest } from "@/services/modules/shared-request";
import type { AuthRequestOptions } from "@/types/http";
import type { PaymentRequestBody, PaymentDTO } from "@/types";
import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/payments";

export const PAYMENT_ROUTES = {
  create: `${BASE_PATH}/`,
} as const;
export const PaymentService = {
  create: (data: PaymentRequestBody, options?: AuthRequestOptions) =>
    serviceRequest<PaymentDTO>(PAYMENT_ROUTES.create, "POST", {
      ...options,
      body: data,
    }),
};
