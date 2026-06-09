/**
 * Componente MatchForm
 * --------------------
 * Formulario para que un administrador cargue un partido nuevo. Solo se muestra
 * cuando hay un admin logueado. Al crear, avisa al padre con `onCreated`.
 */

import { FormEvent, useState } from "react";
import { createMatch } from "../api";

interface Props {
  token: string;
  onCreated: () => void;
}

const EMPTY = { group: "", homeTeam: "", awayTeam: "", stadium: "", city: "", date: "" };

export function MatchForm({ token, onCreated }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);

  // Actualiza un campo del formulario de forma genérica.
  function update(field: keyof typeof EMPTY, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      // El input datetime-local entrega "YYYY-MM-DDTHH:mm"; lo pasamos a ISO.
      await createMatch({ ...form, date: new Date(form.date).toISOString() }, token);
      setForm(EMPTY);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el partido");
    }
  }

  return (
    <form className="match-form" onSubmit={handleSubmit}>
      <h3>Agregar partido (admin)</h3>
      <div className="grid">
        <input placeholder="Grupo (ej. A)" value={form.group} onChange={(e) => update("group", e.target.value)} />
        <input placeholder="Local" value={form.homeTeam} onChange={(e) => update("homeTeam", e.target.value)} />
        <input placeholder="Visitante" value={form.awayTeam} onChange={(e) => update("awayTeam", e.target.value)} />
        <input placeholder="Estadio" value={form.stadium} onChange={(e) => update("stadium", e.target.value)} />
        <input placeholder="Ciudad" value={form.city} onChange={(e) => update("city", e.target.value)} />
        <input type="datetime-local" value={form.date} onChange={(e) => update("date", e.target.value)} />
      </div>
      <button>Crear partido</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
