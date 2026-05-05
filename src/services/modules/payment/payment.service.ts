import { serviceRequest } from "@/services/modules/shared-request";
import type { AuthRequestOptions } from "@/types/http";
import type { PaymentRequestBody, PaymentDTO } from "@/types";
import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/payments";

export const PaymentService = {
  create: (data: PaymentRequestBody, options?: AuthRequestOptions) =>
    serviceRequest<PaymentDTO>(`${BASE_PATH}/`, "POST", {
      ...options,
      body: data,
    }),
};
