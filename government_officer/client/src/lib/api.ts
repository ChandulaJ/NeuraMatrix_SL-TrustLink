// Common API class for making HTTP requests
// Usage: Api.get(url), Api.post(url, data), etc.

export class Api {
  static async get<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, { ...options, method: 'GET', credentials: 'include' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  static async post<T>(url: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  static async put<T>(url: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  static async delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, { ...options, method: 'DELETE', credentials: 'include' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}
