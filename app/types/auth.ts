export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
  token?: string;
}