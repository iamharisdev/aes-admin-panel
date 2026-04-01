import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, Role } from "@/types";

export interface GetRolesParams {
  page?: number;
  limit?: number;
  search?: string;
  includePermissions?: boolean;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  isSystemRole?: boolean;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
}

export interface AssignPermissionsPayload {
  permissionIds: string[];
}

export const roleService = {
  getAll: (params?: GetRolesParams) =>
    api.get<PaginatedResponse<Role>>("/roles", { params }),

  getById: (id: string, includePermissions = true) =>
    api.get<ApiResponse<Role>>(`/roles/${id}`, {
      params: { includePermissions },
    }),

  create: (payload: CreateRolePayload) =>
    api.post<ApiResponse<Role>>("/roles", payload),

  update: (id: string, payload: UpdateRolePayload) =>
    api.patch<ApiResponse<Role>>(`/roles/${id}`, payload),

  remove: (id: string) => api.delete<ApiResponse<null>>(`/roles/${id}`),

  assignPermissions: (id: string, payload: AssignPermissionsPayload) =>
    api.post<ApiResponse<Role>>(`/roles/${id}/permissions`, payload),

  removePermissions: (id: string, payload: AssignPermissionsPayload) =>
    api.delete<ApiResponse<Role>>(`/roles/${id}/permissions`, {
      data: payload,
    }),
};
