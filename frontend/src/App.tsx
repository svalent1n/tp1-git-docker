/**
 * Componente raíz de la aplicación
 * --------------------------------
 * Orquesta el estado general: la sesión del usuario y la lista de partidos.
 * Compone los componentes hijos (Login, MatchForm, MatchList) y coordina la
 * recarga de datos cuando algo cambia.
 */

import { useEffect, useState } from "react";
import { Match, Session } from "./types";
import { getMatches } from "./api";
import { Login } from "./components/Login";
import { MatchForm } from "./components/MatchForm";
import { MatchList } from "./components/MatchList";

export default function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Carga (o recarga) el fixture desde la API.
  async function loadMatches() {
    try {
      setMatches(await getMatches());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo conectar con la API");
    }
  }

  // Al montar el componente, traemos el fixture una vez.
  useEffect(() => {
    loadMatches();
  }, []);

  return (
    <div className="container">
      <header>
        <h1>🏆 Fixture Mundial 2026</h1>
        {session ? (
          <div className="session">
            <span>
              Hola, <strong>{session.username}</strong> ({session.role})
            </span>
            <button onClick={() => setSession(null)}>Cerrar sesión</button>
          </div>
        ) : null}
      </header>

      {error && <p className="error">{error}</p>}

      {/* Si no hay sesión, mostramos el login. Si hay admin, el formulario. */}
      {!session ? (
        <Login onLogin={setSession} />
      ) : session.role === "admin" ? (
        <MatchForm token={session.token} onCreated={loadMatches} />
      ) : null}

      <MatchList matches={matches} session={session} onChange={loadMatches} />

      <footer>TP1 - Git y Docker · API REST + React · Valentín Sánchez</footer>
    </div>
  );
}
