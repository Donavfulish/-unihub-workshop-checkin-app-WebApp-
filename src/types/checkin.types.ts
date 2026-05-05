export interface CheckinDTO {
  id: string;
  registrationId: string;
  checkedAt: string;
  status?: "present" | "absent" | "late";
  location?: string;
}
