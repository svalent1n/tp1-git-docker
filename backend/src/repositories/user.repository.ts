/**
 * Capa de Repositorio (Persistencia) - Usuarios
 * ---------------------------------------------
 * Acceso a la tabla `users` en MySQL. Guarda únicamente el hash de la contraseña,
 * nunca el texto plano. Como en el repo de partidos, traduce las filas de la base
 * (snake_case) al modelo de dominio (camelCase).
 */

import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/db";
import { Role, User } from "../domain/types";

/** Forma de una fila de la tabla `users` tal como la devuelve MySQL. */
interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
  role: Role;
}

class UserRepository {
  /** Traduce una fila de la BD al modelo de dominio. */
  private mapRow(row: UserRow): User {
    return {
      id: row.id,
      username: row.username,
      passwordHash: row.password_hash,
      role: row.role,
    };
  }

  /** Busca un usuario por su nombre (clave de login), o undefined si no existe. */
  async findByUsername(username: string): Promise<User | undefined> {
    const [rows] = await pool.query<UserRow[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    return rows.length ? this.mapRow(rows[0]) : undefined;
  }

  /** Crea un usuario nuevo con su contraseña ya hasheada. */
  async insert(username: string, passwordHash: string, role: Role): Promise<User> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
      [username, passwordHash, role]
    );
    return { id: result.insertId, username, passwordHash, role };
  }
}

// Instancia única (singleton) compartida por toda la aplicación.
export const userRepository = new UserRepository();
