export interface PaymentDTO {
  id: string;
  registrationId?: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  method?: string;
  createdAt: string;
}

export interface PaymentRequestBody {
  registrationId?: string;
  amount: number;
  currency: string;
  method: string;
  details?: Record<string, unknown>;
}

export interface ProcessPaymentInput {
  paymentMethod: string;
  amount: number;
  currency: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentIdempotencyRecord<T = unknown> {
  idempotencyKey: string;
  payload: T;
  createdAt: string;
}
