"use server";

import { CheckinService } from "@/services/modules/checkin/checkin.service";
import type { CheckinDTO } from "@/types";

export async function submitCheckinAction(payload: CheckinDTO, token?: string) {
  return CheckinService.submit(payload, { token });
}
