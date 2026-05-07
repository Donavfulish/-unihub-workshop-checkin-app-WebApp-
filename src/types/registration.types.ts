export interface RegistrationDTO {
  id: number;
  student_id?: string | null;
  workshop_id?: number | null;
  qr_code_hash?: string | null;
  status?: string | null;
  created_at?: string | null;
}

export interface RegistrationRequestBody {
  workshopId: number;
  idempotencyKey?: string;
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
