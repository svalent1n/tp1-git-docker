/**
 * Componente MatchList
 * --------------------
 * Muestra el fixture en forma de tarjetas. Si hay un admin logueado, habilita
 * acciones extra: cargar el resultado y eliminar el partido.
 */

import { Match, Session } from "../types";
import { deleteMatch, setResult } from "../api";

interface Props {
  matches: Match[];
  session: Session | null;
  onChange: () => void; // se llama tras modificar para refrescar la lista
}

export function MatchList({ matches, session, onChange }: Props) {
  const isAdmin = session?.role === "admin";

  // Pide el resultado por prompt y lo envía a la API (acción de admin).
  async function loadResult(match: Match) {
    const input = window.prompt(
      `Resultado de ${match.homeTeam} vs ${match.awayTeam} (formato: local-visitante, ej. 2-1)`
    );
    if (!input || !session) return;
    const [home, away] = input.split("-").map((n) => Number(n.trim()));
    if (Number.isNaN(home) || Number.isNaN(away)) {
      alert("Formato inválido. Usá por ejemplo: 2-1");
      return;
    }
    await setResult(match.id, home, away, session.token);
    onChange();
  }

  async function remove(match: Match) {
    if (!session) return;
    if (!window.confirm(`¿Eliminar ${match.homeTeam} vs ${match.awayTeam}?`)) return;
    await deleteMatch(match.id, session.token);
    onChange();
  }

  if (matches.length === 0) {
    return <p className="empty">No hay partidos cargados todavía.</p>;
  }

  return (
    <div className="matches">
      {matches.map((m) => (
        <article key={m.id} className="card">
          <span className="group">Grupo {m.group}</span>
          <div className="teams">
            <strong>{m.homeTeam}</strong>
            <span className="score">
              {m.played ? `${m.homeScore} - ${m.awayScore}` : "vs"}
            </span>
            <strong>{m.awayTeam}</strong>
          </div>
          <p className="venue">
            {m.stadium}, {m.city}
          </p>
          <p className="date">{new Date(m.date).toLocaleString("es-AR")}</p>
          {isAdmin && (
            <div className="actions">
              <button onClick={() => loadResult(m)}>Cargar resultado</button>
              <button className="danger" onClick={() => remove(m)}>
                Eliminar
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
