"use server";

import { PaymentService } from "@/services/modules/payment/payment.service";
import type { PaymentRequestBody } from "@/types";

export async function createPaymentAction(
  payload: PaymentRequestBody,
  token?: string,
) {
  return PaymentService.create(payload, { token });
}

export async function listMyPaymentsAction(token?: string) {
  return PaymentService.listMine({ token });
}
