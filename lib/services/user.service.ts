import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, User } from "@/types";

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const userService = {
  getAll: (params?: GetUsersParams) =>
    api.get<PaginatedResponse<User>>("/users", { params }),

  getById: (id: string) => api.get<ApiResponse<User>>(`/users/${id}`),

  create: (payload: Omit<User, "id" | "createdAt">) =>
    api.post<ApiResponse<User>>("/users", payload),

  update: (id: string, payload: Partial<User>) =>
    api.patch<ApiResponse<User>>(`/users/${id}`, payload),

  remove: (id: string) => api.delete(`/users/${id}`),
};
