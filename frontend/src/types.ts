// Tipos compartidos con la API. Reflejan el modelo de dominio del backend
// para que el frontend tenga autocompletado y chequeo de tipos.

export interface Match {
  id: number;
  group: string;
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  city: string;
  date: string;
  homeScore: number | null;
  awayScore: number | null;
  played: boolean;
}

export type Role = "admin" | "user";

// Sesión del usuario logueado, guardada en memoria por la app.
export interface Session {
  token: string;
  role: Role;
  username: string;
}
