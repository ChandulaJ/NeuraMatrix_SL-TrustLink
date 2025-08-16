// Common API class for making HTTP requests
// Usage: Api.get(url), Api.post(url, data), etc.

import Cookies from "js-cookie";

function buildHeaders(options: RequestInit = {}): Record<string, string> {
  const result: Record<string, string> = {};

  // Merge any existing headers (object form)
  if (options.headers) {
    try {
      if (options.headers instanceof Headers) {
        options.headers.forEach((v, k) => (result[k] = v));
      } else if (Array.isArray(options.headers)) {
        (options.headers as [string, string][]).forEach(([k, v]) => (result[k] = v));
      } else if (typeof options.headers === "object") {
        Object.assign(result, options.headers as Record<string, string>);
      }
    } catch (e) {
      // ignore header parsing errors and continue
    }
  }

  // Inject Authorization from cookie when not already provided
  if (!result["Authorization"]) {
    const token = Cookies.get("token");
    if (token) result["Authorization"] = `Bearer ${token}`;
  }

  return result;
}

export class Api {
  static async get<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers = buildHeaders(options);
    const res = await fetch(url, { ...options, method: "GET", headers, credentials: "include" });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  static async post<T>(url: string, data?: unknown, options: RequestInit = {}): Promise<T> {
  const optHeaders = (options.headers && typeof options.headers === 'object') ? (options.headers as Record<string, string>) : undefined;
  const headers = buildHeaders({ ...options, headers: optHeaders });
    if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";
    const res = await fetch(url, {
      ...options,
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  static async put<T>(url: string, data?: unknown, options: RequestInit = {}): Promise<T> {
  const optHeaders2 = (options.headers && typeof options.headers === 'object') ? (options.headers as Record<string, string>) : undefined;
  const headers = buildHeaders({ ...options, headers: optHeaders2 });
    if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";
    const res = await fetch(url, {
      ...options,
      method: "PUT",
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  static async delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers = buildHeaders(options);
    const res = await fetch(url, { ...options, method: "DELETE", headers, credentials: "include" });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}
