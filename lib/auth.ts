export interface TokenPayload {
  userId: string;
  role: "admin" | "user";
  email: string;
  exp: number;
}

/** Decode JWT without verifying signature (client-side only) */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload)) as TokenPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;
  return Date.now() >= payload.exp * 1000;
}

export function getTokenPayload(): TokenPayload | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) return null;
  return decodeToken(token);
}
