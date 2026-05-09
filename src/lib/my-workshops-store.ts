import type {
  PaymentDTO,
  RegistrationDTO,
  ReservationResponse,
  WorkshopResponse,
} from "@/types";

const STORAGE_KEY = "unihub_my_workshops_v1";

export interface StoredWorkshopFlow {
  workshop: WorkshopResponse;
  reservation?: ReservationResponse | null;
  registration?: RegistrationDTO | null;
  payment?: PaymentDTO | null;
  qrCode?: string | null;
}

function isActiveReservation(
  reservation?: ReservationResponse | null,
): boolean {
  if (!reservation?.expiresAt) return false;

  const expiresAt = new Date(reservation.expiresAt).getTime();
  if (Number.isNaN(expiresAt)) return false;

  return expiresAt > Date.now();
}

function normalizeWorkshopFlow(
  item: StoredWorkshopFlow,
): StoredWorkshopFlow | null {
  if (!item?.workshop?.id) return null;

  const reservation = isActiveReservation(item.reservation)
    ? item.reservation
    : null;

  return {
    ...item,
    reservation,
    registration: item.registration ?? null,
    payment: item.payment ?? null,
    qrCode: item.qrCode ?? null,
  };
}

export function readStoredWorkshopFlows(): StoredWorkshopFlow[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as StoredWorkshopFlow[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(normalizeWorkshopFlow)
      .filter(Boolean) as StoredWorkshopFlow[];
  } catch {
    return [];
  }
}

export function writeStoredWorkshopFlows(items: StoredWorkshopFlow[]): void {
  if (typeof window === "undefined") return;

  const normalized = items
    .map(normalizeWorkshopFlow)
    .filter(Boolean) as StoredWorkshopFlow[];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}
