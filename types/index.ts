// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string; // role name e.g. "super admin"
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// ─── Permission ───────────────────────────────────────────────────────────────

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Role ─────────────────────────────────────────────────────────────────────

export interface RolePermission {
  permission: Permission;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
  permissions?: RolePermission[];
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  roleId: string;
  hospitalId?: string;
  isActive: "Y" | "N";
  role?: Role;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
  roleId: string;
  isActive?: "Y" | "N";
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phoneNumber?: string;
  roleId?: string;
  isActive?: "Y" | "N";
}

// ─── API Wrappers ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
