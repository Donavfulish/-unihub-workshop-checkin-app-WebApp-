import type { PaymentDTO, RegistrationDTO, WorkshopResponse } from "@/types";

const STORAGE_KEY = "unihub-my-workshops";

export interface StoredWorkshopFlow {
  workshop: WorkshopResponse;
  registration: RegistrationDTO;
  payment?: PaymentDTO | null;
  qrCode?: string | null;
}

function canUseStorage() {
  return typeof window !== "undefined";
}

export function loadStoredWorkshopFlows(): StoredWorkshopFlow[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as StoredWorkshopFlow[];
  } catch {
    return [];
  }
}

function saveStoredWorkshopFlows(items: StoredWorkshopFlow[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function upsertStoredWorkshopFlow(item: StoredWorkshopFlow) {
  const current = loadStoredWorkshopFlows();
  const next = current.filter(
    (existing) => existing.workshop.id !== item.workshop.id,
  );

  next.unshift(item);
  saveStoredWorkshopFlows(next);
}

export function getStoredWorkshopFlowByWorkshopId(workshopId: number) {
  return loadStoredWorkshopFlows().find((item) => item.workshop.id === workshopId);
}
