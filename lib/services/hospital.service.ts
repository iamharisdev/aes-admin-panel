import api from "@/lib/axios";
import type {
  ApiResponse,
  CreateHospitalPayload,
  Hospital,
  PaginatedResponse,
  UpdateHospitalPayload,
} from "@/types";

export const hospitalService = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    state?: string;
    isActive?: "Y" | "N";
  }) => api.get<PaginatedResponse<Hospital>>("/hospitals", { params }),

  getById: (id: string) => api.get<ApiResponse<Hospital>>(`/hospitals/${id}`),

  create: (payload: CreateHospitalPayload) =>
    api.post<ApiResponse<Hospital>>("/hospitals", payload),

  update: (id: string, payload: UpdateHospitalPayload) =>
    api.patch<ApiResponse<Hospital>>(`/hospitals/${id}`, payload),

  remove: (id: string) => api.delete<ApiResponse<null>>(`/hospitals/${id}`),

  activate: (id: string) =>
    api.post<ApiResponse<Hospital>>(`/hospitals/${id}/activate`),

  deactivate: (id: string) =>
    api.post<ApiResponse<Hospital>>(`/hospitals/${id}/deactivate`),
};
