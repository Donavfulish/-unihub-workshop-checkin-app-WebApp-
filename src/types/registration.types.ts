export interface RegistrationDTO {
  id: string;
  studentId: string;
  workshopId: string;
  registeredAt: string;
  status: "active" | "completed" | "cancelled";
}

export interface RegistrationRequestBody {
  studentId: string;
  workshopId: string;
  metadata?: Record<string, unknown>;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  university?: string;
  major?: string;
}

export interface RegistrationIdempotencyRecord<T = unknown> {
  idempotencyKey: string;
  payload: T;
  createdAt: string;
}

export interface LockedWorkshopSlotRow {
  workshopId: string;
  slotAt: string;
  lockedBy: string;
  expiresAt: string;
}
