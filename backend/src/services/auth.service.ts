/**
 * Capa de Servicio - Autenticación
 * --------------------------------
 * Concentra toda la lógica de seguridad: registro de usuarios, hasheo de
 * contraseñas con bcrypt, verificación de credenciales y emisión/validación de
 * tokens JWT. Ninguna contraseña se guarda ni se compara en texto plano.
 *
 * El repositorio de usuarios ahora consulta MySQL, así que las búsquedas se
 * esperan con await.
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { userRepository } from "../repositories/user.repository";
import { AuthPayload, CredentialsDTO, Role, User } from "../domain/types";
import { Errors } from "../domain/errors";

class AuthService {
  /**
   * Registra un usuario nuevo. Hashea la contraseña antes de guardarla.
   * Lanza 409 si el nombre de usuario ya está tomado.
   */
  async register(creds: CredentialsDTO, role: Role = "user"): Promise<User> {
    this.validateCredentials(creds);
    if (await userRepository.findByUsername(creds.username)) {
      throw Errors.conflict("El nombre de usuario ya está en uso");
    }
    const passwordHash = await bcrypt.hash(creds.password, config.auth.bcryptRounds);
    return userRepository.insert(creds.username.trim(), passwordHash, role);
  }

  /**
   * Verifica las credenciales y, si son correctas, devuelve un token JWT.
   * Usa un mensaje de error genérico para no revelar si el usuario existe.
   */
  async login(creds: CredentialsDTO): Promise<{ token: string; role: Role }> {
    this.validateCredentials(creds);
    const user = await userRepository.findByUsername(creds.username);
    if (!user) throw Errors.unauthorized("Usuario o contraseña incorrectos");

    const ok = await bcrypt.compare(creds.password, user.passwordHash);
    if (!ok) throw Errors.unauthorized("Usuario o contraseña incorrectos");

    return { token: this.signToken(user), role: user.role };
  }

  /** Firma un token JWT con los datos del usuario. */
  private signToken(user: User): string {
    const payload: AuthPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };
    // Casteamos las opciones a `any` porque @types/jsonwebtoken tipa `expiresIn`
    // con un tipo de plantilla estricto, incompatible con un string genérico.
    const options = { expiresIn: config.auth.jwtExpiresIn } as any;
    return jwt.sign(payload, config.auth.jwtSecret, options);
  }

  /** Verifica un token y devuelve su contenido, o lanza 401 si es inválido. */
  verifyToken(token: string): AuthPayload {
    try {
      return jwt.verify(token, config.auth.jwtSecret) as unknown as AuthPayload;
    } catch {
      throw Errors.unauthorized("Token inválido o expirado");
    }
  }

  /** Valida que las credenciales tengan un mínimo de calidad. */
  private validateCredentials(creds: CredentialsDTO): void {
    if (!creds.username || creds.username.trim().length < 3) {
      throw Errors.badRequest("El usuario debe tener al menos 3 caracteres");
    }
    if (!creds.password || creds.password.length < 6) {
      throw Errors.badRequest("La contraseña debe tener al menos 6 caracteres");
    }
  }

  /**
   * Crea el usuario administrador inicial al arrancar la app (si no existe).
   * Sus credenciales se definen por variables de entorno.
   */
  async seedAdmin(): Promise<void> {
    const { adminUser, adminPassword } = config.auth;
    if (!(await userRepository.findByUsername(adminUser))) {
      await this.register({ username: adminUser, password: adminPassword }, "admin");
      console.log(`Usuario admin "${adminUser}" creado por defecto.`);
    }
  }
}

// Instancia única (singleton) del servicio.
export const authService = new AuthService();
