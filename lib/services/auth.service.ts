import api from "@/lib/axios";
import type { ApiResponse, LoginPayload, LoginResponse } from "@/types";

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<ApiResponse<LoginResponse>>("/auth/login", payload),

  logout: () => api.post("/auth/logout"),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string }>>("/auth/refresh-token", {
      refreshToken,
    }),
};
