import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, User, CreateUserPayload, UpdateUserPayload } from "@/types";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: "Y" | "N";
}

export const userService = {
  getAll: (params?: GetUsersParams) =>
    api.get<PaginatedResponse<User>>("/users", { params }),

  getById: (id: string) => api.get<ApiResponse<User>>(`/users/${id}`),

  create: (payload: CreateUserPayload) =>
    api.post<ApiResponse<User>>("/users", payload),

  update: (id: string, payload: UpdateUserPayload) =>
    api.patch<ApiResponse<User>>(`/users/${id}`, payload),

  remove: (id: string) => api.delete<ApiResponse<null>>(`/users/${id}`),
};
