/**
 * Capa de Repositorio (Persistencia) - Partidos
 * ---------------------------------------------
 * Encapsula el acceso a los datos de los partidos. Ahora usa MySQL a través del
 * pool de conexiones. Es la ÚNICA capa que sabe SQL: traduce entre las filas de la
 * base (snake_case, 0/1) y el modelo de dominio (camelCase, boolean). Gracias a
 * eso, services y controllers no se enteran de que cambió el almacenamiento.
 */

import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/db";
import { Match } from "../domain/types";

/** Forma de una fila de la tabla `matches` tal como la devuelve MySQL. */
interface MatchRow extends RowDataPacket {
  id: number;
  group_name: string;
  home_team: string;
  away_team: string;
  stadium: string;
  city: string;
  match_date: string;
  home_score: number | null;
  away_score: number | null;
  played: number; // TINYINT(1): MySQL guarda 0 o 1, no true/false
}

class MatchRepository {
  /**
   * Traduce una fila de la BD al modelo de dominio.
   * Acá renombramos columnas (group_name -> group) y convertimos el 0/1 de
   * `played` a un booleano de verdad.
   */
  private mapRow(row: MatchRow): Match {
    return {
      id: row.id,
      group: row.group_name,
      homeTeam: row.home_team,
      awayTeam: row.away_team,
      stadium: row.stadium,
      city: row.city,
      date: row.match_date,
      homeScore: row.home_score,
      awayScore: row.away_score,
      played: Boolean(row.played),
    };
  }

  /** Devuelve todos los partidos ordenados por id. */
  async findAll(): Promise<Match[]> {
    const [rows] = await pool.query<MatchRow[]>(
      "SELECT * FROM matches ORDER BY id"
    );
    return rows.map((r) => this.mapRow(r));
  }

  /** Busca un partido por su id, o undefined si no existe. */
  async findById(id: number): Promise<Match | undefined> {
    const [rows] = await pool.query<MatchRow[]>(
      "SELECT * FROM matches WHERE id = ?",
      [id]
    );
    return rows.length ? this.mapRow(rows[0]) : undefined;
  }

  /** Filtra los partidos de un grupo (insensible a mayúsculas). */
  async findByGroup(group: string): Promise<Match[]> {
    const [rows] = await pool.query<MatchRow[]>(
      "SELECT * FROM matches WHERE LOWER(group_name) = LOWER(?) ORDER BY id",
      [group]
    );
    return rows.map((r) => this.mapRow(r));
  }

  /** Inserta un partido nuevo. MySQL asigna el id autoincremental (insertId). */
  async insert(data: Omit<Match, "id">): Promise<Match> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO matches
         (group_name, home_team, away_team, stadium, city, match_date, home_score, away_score, played)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.group,
        data.homeTeam,
        data.awayTeam,
        data.stadium,
        data.city,
        data.date,
        data.homeScore,
        data.awayScore,
        data.played,
      ]
    );
    return { id: result.insertId, ...data };
  }

  /** Actualiza el resultado de un partido. Devuelve el actualizado o undefined. */
  async update(id: number, changes: Partial<Match>): Promise<Match | undefined> {
    const existing = await this.findById(id);
    if (!existing) return undefined;

    const updated: Match = { ...existing, ...changes };
    await pool.query(
      "UPDATE matches SET home_score = ?, away_score = ?, played = ? WHERE id = ?",
      [updated.homeScore, updated.awayScore, updated.played, id]
    );
    return updated;
  }

  /** Elimina un partido. Devuelve true si existía y se borró. */
  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM matches WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  /** Cuenta los partidos. Se usa para sembrar solo si la tabla está vacía. */
  async count(): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS n FROM matches"
    );
    return Number(rows[0].n);
  }
}

// Instancia única (singleton) compartida por toda la aplicación.
export const matchRepository = new MatchRepository();
