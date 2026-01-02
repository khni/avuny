import { AuthService } from "./AuthService.js";

export * from "./AuthService.js";
let authService: AuthService | null = null;

export function getAuthService() {
  if (!authService) {
    authService = new AuthService();
  }
  return authService;
}
