/**
 * Cliente de la API
 * -----------------
 * Centraliza todas las llamadas HTTP al backend en un único módulo. Así los
 * componentes no arman URLs ni manejan fetch directamente: solo invocan funciones
 * claras como `getMatches()` o `login()`. La URL base se lee de una variable de
 * entorno (VITE_API_URL), cumpliendo el punto del bonus de variables de entorno.
 */

import { Match } from "./types";

// URL base de la API. En desarrollo apunta a localhost; en producción se inyecta
// vía variable de entorno al construir la imagen.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/** Realiza una petición y maneja errores de forma uniforme. */
async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  // Si hay token, lo enviamos en el header Authorization (esquema Bearer).
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  // 204 No Content: no hay cuerpo que parsear.
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data as T;
}

// --- Endpoints de partidos ---

export const getMatches = (group?: string) =>
  request<Match[]>(`/matches${group ? `?group=${encodeURIComponent(group)}` : ""}`);

export const createMatch = (data: Omit<Match, "id" | "homeScore" | "awayScore" | "played">, token: string) =>
  request<Match>("/matches", { method: "POST", body: JSON.stringify(data) }, token);

export const setResult = (id: number, homeScore: number, awayScore: number, token: string) =>
  request<Match>(`/matches/${id}/result`, { method: "PATCH", body: JSON.stringify({ homeScore, awayScore }) }, token);

export const deleteMatch = (id: number, token: string) =>
  request<void>(`/matches/${id}`, { method: "DELETE" }, token);

// --- Endpoints de autenticación ---

export const login = (username: string, password: string) =>
  request<{ token: string; role: "admin" | "user" }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
