export interface PaymentDTO {
  id: number;
  registration_id?: number | null;
  transaction_no?: string | null;
  idempotency_key?: string | null;
  amount?: number | string | null;
  status?: string | null;
  registration?: {
    id: number;
    workshop_id?: number | null;
    qr_code_hash?: string | null;
    status?: string | null;
  } | null;
}

export interface PaymentRequestBody {
  registrationId: number;
  amount: number;
  idempotencyKey?: string;
}

export interface ProcessPaymentInput {
  registrationId: number;
  amount: number;
  idempotencyKey?: string;
}

export interface PaymentIdempotencyRecord<T = unknown> {
  idempotencyKey: string;
  payload: T;
  createdAt: string;
}
