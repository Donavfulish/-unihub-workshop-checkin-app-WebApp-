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
    workshop?: {
      id: number;
      title: string;
      description?: string | null;
      fee?: number | string | null;
      total_slots?: number | null;
      remaining_slots?: number | null;
      start_time?: string | null;
      end_time?: string | null;
    } | null;
  } | null;
}

export interface PaymentListResponse {
  items: PaymentDTO[];
}

export interface PaymentRequestBody {
  registrationId?: number;
  reservationId?: string;
  amount: number;
  idempotencyKey?: string;
}

export interface ProcessPaymentInput {
  registrationId?: number;
  reservationId?: string;
  amount: number;
  idempotencyKey?: string;
}

export interface PaymentIdempotencyRecord<T = unknown> {
  idempotencyKey: string;
  payload: T;
  createdAt: string;
}
