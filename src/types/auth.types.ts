export type AppRole = "admin" | "staff" | "student";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  /** Required by API — UI may build from firstName + lastName. */
  name: string;
  firstName?: string;
  lastName?: string;
  university?: string;
  major?: string;
}

export interface AuthUserDTO {
  id: string;
  email: string;
  username?: string;
  full_name?: string | null;
  role_id?: number | null;
  role?: string | null;
}

export interface LoginResponseDTO {
  message?: string;
  user: AuthUserDTO;
  accessToken: string;
  refreshToken?: string;
}

export interface RegisterResponseDTO {
  message?: string;
  user: AuthUserDTO;
}
