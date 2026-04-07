"use client";

import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { startLoading, stopLoading } from "@/lib/loading";
import { API_BASE_URL } from "@/constant";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// ─── Request: attach token + start loader ─────────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (token) config.headers.Authorization = `Bearer ${token}`;
    startLoading();
    return config;
  },
  (error: AxiosError) => {
    stopLoading();
    return Promise.reject(error);
  }
);

// ─── Response: stop loader + handle 401 ──────────────────────────────────────

api.interceptors.response.use(
  (response: AxiosResponse) => {
    stopLoading();
    return response;
  },
  async (error: AxiosError) => {
    stopLoading();
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post<{ data: { accessToken: string } }>(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );
        const newToken = data.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        document.cookie = `token=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 403) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
