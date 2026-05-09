export interface RegistrationDTO {
  id: number;
  student_id?: string | null;
  workshop_id?: number | null;
  qr_code_hash?: string | null;
  status?: string | null;
  created_at?: string | null;
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
}

export interface RegistrationListResponse {
  items: RegistrationDTO[];
}

export interface RegistrationRequestBody {
  workshopId: number;
  idempotencyKey?: string;
}

export interface ReservationResponse {
  reservationId: string;
  workshopId: number;
  studentId: string;
  expiresAt: string;
}

export interface RegisterUserInput {
  workshopId: number;
  idempotencyKey?: string;
}

export interface RegistrationIdempotencyRecord<T = unknown> {
  idempotencyKey: string;
  payload: T;
  createdAt: string;
}

export interface LockedWorkshopSlotRow {
  id: number;
  total_slots: number | null;
  remaining_slots: number | null;
}
