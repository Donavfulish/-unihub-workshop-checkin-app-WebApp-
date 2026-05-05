export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  university?: string;
  major?: string;
}

export interface AuthUserDTO {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export interface LoginResponseDTO {
  user: AuthUserDTO;
  accessToken: string;
  refreshToken?: string;
}

export interface RegisterResponseDTO {
  user: AuthUserDTO;
  message?: string;
}
