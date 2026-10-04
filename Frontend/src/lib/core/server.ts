"use server";

import { getUserToken } from "./session";

const getBaseUrl = (): string => {
  const url = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  return url.replace(/\/+$/, "");
};

const resolveUrl = (path: string): string => {
  const base = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

// user token auth headers
export const authHeaders = async (): Promise<Record<string, string>> => {
  try {
    const token = await getUserToken();
    const headers: Record<string, string> = token
      ? {
          authorization: `Bearer ${token}`,
        }
      : {};
    return headers;
  } catch {
    return {};
  }
};

// all server fetch
export const serverFetch = async <T = any>(path: string, options: RequestInit = {}): Promise<T> => {
  try {
    const url = resolveUrl(path);
    const res = await fetch(url, {
      ...options,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, message: errData?.message || errData?.error || `HTTP ${res.status}`, data: [] } as T;
    }
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || "Fetch failed", data: [] } as T;
  }
};

// verify token protected fetch
export const protectedFetch = async <T = any>(path: string, options: RequestInit = {}): Promise<T> => {
  try {
    const headers = await authHeaders();
    const url = resolveUrl(path);
    const res = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, message: errData?.message || errData?.error || `HTTP ${res.status}`, data: [] } as T;
    }
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || "Protected fetch failed", data: [] } as T;
  }
};

export const serverMutation = async <T = any>(
  path: string,
  data: any = {},
  method: string = "POST"
): Promise<T> => {
  try {
    const headers = await authHeaders();
    const url = resolveUrl(path);
    const res = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, message: errData?.message || errData?.error || `HTTP ${res.status}` } as T;
    }
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || "Mutation failed" } as T;
  }
};
