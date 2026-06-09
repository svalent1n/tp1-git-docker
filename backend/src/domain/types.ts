/**
 * Capa de Dominio
 * ----------------
 * Define los modelos centrales de la aplicación y los contratos de datos (DTOs)
 * que viajan entre el cliente y el servidor. No depende de Express ni de ninguna
 * tecnología concreta: es el corazón del negocio (el fixture del Mundial).
 */

// --- Modelos de dominio ---

/** Un partido del Mundial 2026. */
export interface Match {
  id: number;
  group: string; // Grupo de la fase de grupos (A, B, C, ...)
  homeTeam: string; // Selección local
  awayTeam: string; // Selección visitante
  stadium: string; // Estadio / sede
  city: string; // Ciudad sede
  date: string; // Fecha y hora del partido (ISO 8601)
  homeScore: number | null; // Goles del local (null mientras no se jugó)
  awayScore: number | null; // Goles del visitante (null mientras no se jugó)
  played: boolean; // Indica si el partido ya se disputó
}

/** Rol del usuario: define qué acciones puede realizar. */
export type Role = "admin" | "user";

/** Un usuario del sistema. La contraseña se guarda siempre hasheada. */
export interface User {
  id: number;
  username: string;
  passwordHash: string; // Nunca se almacena la contraseña en texto plano
  role: Role;
}

// --- DTOs (Data Transfer Objects) ---

/** Datos necesarios para crear un partido. */
export interface CreateMatchDTO {
  group: string;
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  city: string;
  date: string;
}

/** Datos para cargar el resultado de un partido ya jugado. */
export interface ResultDTO {
  homeScore: number;
  awayScore: number;
}

/** Credenciales que envía el cliente al iniciar sesión o registrarse. */
export interface CredentialsDTO {
  username: string;
  password: string;
}

/** Información que viaja dentro del token JWT una vez autenticado. */
export interface AuthPayload {
  sub: number; // id del usuario (subject)
  username: string;
  role: Role;
}
