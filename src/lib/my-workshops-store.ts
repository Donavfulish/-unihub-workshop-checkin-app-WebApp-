import type { PaymentDTO, RegistrationDTO, WorkshopResponse } from "@/types";

export interface StoredWorkshopFlow {
  workshop: WorkshopResponse;
  registration: RegistrationDTO;
  payment?: PaymentDTO | null;
  qrCode?: string | null;
}
