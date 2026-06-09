/**
 * Capa de Configuración
 * ---------------------
 * Centraliza la lectura de variables de entorno en un único objeto tipado.
 * De esta forma, ningún otro módulo accede directamente a `process.env`,
 * lo que facilita mantener y testear la aplicación.
 *
 * Cubre el punto del bonus "Utilizar variables de entorno".
 */

// Carga el archivo .env dentro de process.env (solo afecta a desarrollo local;
// en Docker las variables las inyecta docker-compose). Debe ir antes de leer config.
import "dotenv/config";

export const config = {
  /** Puerto donde escucha la API. */
  port: Number(process.env.PORT) || 3000,

  /** Origen permitido para CORS (la URL del frontend). */
  corsOrigin: process.env.CORS_ORIGIN || "*",

  /** Entorno de ejecución (development / production). */
  nodeEnv: process.env.NODE_ENV || "development",

  /**
   * Configuración de la base de datos MySQL.
   * Igual que con la seguridad, nunca se hardcodean las credenciales: se leen del
   * entorno. Los valores por defecto sirven para desarrollo local.
   */
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mundial",
  },

  /** Configuración de seguridad / autenticación. */
  auth: {
    /**
     * Secreto para firmar los tokens JWT.
     * IMPORTANTE: en producción debe definirse SIEMPRE por variable de entorno
     * y nunca quedar hardcodeado. El valor por defecto es solo para desarrollo.
     */
    jwtSecret: process.env.JWT_SECRET || "cambia-este-secreto-en-produccion",

    /** Tiempo de expiración del token (ej. "1h", "7d"). */
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "2h",

    /** Costo del algoritmo bcrypt (a mayor número, más seguro pero más lento). */
    bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,

    /** Credenciales del usuario administrador inicial (se crea al arrancar). */
    adminUser: process.env.ADMIN_USER || "admin",
    adminPassword: process.env.ADMIN_PASSWORD || "admin1234",
  },
};
