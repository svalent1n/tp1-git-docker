/**
 * Conexión a la base de datos (MySQL)
 * -----------------------------------
 * Crea y exporta un "pool" de conexiones a MySQL. Un pool es un conjunto de
 * conexiones reutilizables: en vez de abrir una conexión nueva por cada consulta
 * (lento), la app toma una libre del pool, la usa y la devuelve. Toda la app
 * comparte este único pool.
 *
 * También expone `initDb()`, que crea las tablas si no existen. Así la API puede
 * arrancar contra una base vacía sin pasos manuales.
 */

import mysql from "mysql2/promise";
import { config } from "./index";

// El pool se configura con las credenciales que vienen del entorno (config.db).
export const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true, // si no hay conexión libre, espera en vez de fallar
  connectionLimit: 10, // máximo de conexiones simultáneas en el pool
});

/**
 * Crea las tablas si todavía no existen (idempotente: se puede correr siempre).
 *
 * Detalles de diseño:
 * - `group` y `date` son palabras reservadas en SQL, por eso las columnas se
 *   llaman `group_name` y `match_date`. El repositorio traduce esos nombres a los
 *   del dominio (`group`, `date`).
 * - `played` se guarda como TINYINT(1): MySQL no tiene un tipo booleano real, usa
 *   0 y 1. El repositorio lo convierte a true/false al leer.
 */
export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS matches (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      group_name VARCHAR(8)   NOT NULL,
      home_team  VARCHAR(100) NOT NULL,
      away_team  VARCHAR(100) NOT NULL,
      stadium    VARCHAR(120) NOT NULL,
      city       VARCHAR(120) NOT NULL,
      match_date VARCHAR(40)  NOT NULL,
      home_score INT          NULL,
      away_score INT          NULL,
      played     TINYINT(1)   NOT NULL DEFAULT 0
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      username      VARCHAR(50)  NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role          VARCHAR(10)  NOT NULL
    )
  `);
}
