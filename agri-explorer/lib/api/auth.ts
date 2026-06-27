import { apiFetch, clearToken, getToken, setToken } from "./client";

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export async function login(username: string, password: string) {
  const res = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: { username, password },
    skipAuth: true,
  });
  setToken(res.token);
  // Lưu kèm username/role để hiển thị mà không cần decode JWT ở client.
  if (typeof window !== "undefined") {
    localStorage.setItem("agri-admin-user", JSON.stringify({ username: res.username, role: res.role }));
  }
  return res;
}

export function logout() {
  clearToken();
  if (typeof window !== "undefined") {
    localStorage.removeItem("agri-admin-user");
  }
}

export function getCurrentUser(): { username: string; role: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("agri-admin-user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken() && !!getCurrentUser();
}
