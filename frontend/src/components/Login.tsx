/**
 * Componente Login
 * ----------------
 * Formulario de inicio de sesión. Al autenticarse correctamente, entrega la
 * sesión (token + rol) al componente padre mediante la prop `onLogin`.
 */

import { FormEvent, useState } from "react";
import { login } from "../api";
import { Session } from "../types";

interface Props {
  onLogin: (session: Session) => void;
}

export function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, role } = await login(username, password);
      onLogin({ token, role, username });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Iniciar sesión</h3>
      <input
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <button disabled={loading}>{loading ? "Ingresando..." : "Ingresar"}</button>
      {error && <p className="error">{error}</p>}
      <small>Probá con admin / admin1234</small>
    </form>
  );
}
