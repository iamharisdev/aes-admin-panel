import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, Permission } from "@/types";

export interface GetPermissionsParams {
  page?: number;
  limit?: number;
  search?: string;
  resource?: string;
  action?: string;
}

export interface CreatePermissionPayload {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export const permissionService = {
  getAll: (params?: GetPermissionsParams) =>
    api.get<PaginatedResponse<Permission>>("/permissions", { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Permission>>(`/permissions/${id}`),

  create: (payload: CreatePermissionPayload) =>
    api.post<ApiResponse<Permission>>("/permissions", payload),

  update: (id: string, payload: Partial<CreatePermissionPayload>) =>
    api.patch<ApiResponse<Permission>>(`/permissions/${id}`, payload),

  remove: (id: string) =>
    api.delete<ApiResponse<null>>(`/permissions/${id}`),
};
