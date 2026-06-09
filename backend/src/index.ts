/**
 * Punto de entrada (bootstrap)
 * ----------------------------
 * Prepara la base de datos, siembra los datos iniciales (usuario admin y
 * partidos de ejemplo), construye la app y la pone a escuchar. Es lo único que
 * ejecuta efectos secundarios al arrancar el proceso.
 *
 * El orden importa: primero la BD (crear tablas), después el seeding (que
 * escribe en esas tablas) y recién al final aceptamos peticiones.
 */

import { createApp } from "./app";
import { config } from "./config";
import { initDb } from "./config/db";
import { authService } from "./services/auth.service";
import { matchRepository } from "./repositories/match.repository";

/**
 * Carga 4 partidos de ejemplo SOLO si la tabla está vacía. Así el seeding es
 * idempotente: por más que reinicies el proceso, no se duplican los datos.
 */
async function seedMatches(): Promise<void> {
  if ((await matchRepository.count()) > 0) return;

  const seed = [
    {
      group: "A",
      homeTeam: "México",
      awayTeam: "Por definir",
      stadium: "Estadio Azteca",
      city: "Ciudad de México",
      date: "2026-06-11T20:00:00Z",
    },
    {
      group: "B",
      homeTeam: "Canadá",
      awayTeam: "Por definir",
      stadium: "BC Place",
      city: "Vancouver",
      date: "2026-06-12T23:00:00Z",
    },
    {
      group: "D",
      homeTeam: "Estados Unidos",
      awayTeam: "Por definir",
      stadium: "SoFi Stadium",
      city: "Los Ángeles",
      date: "2026-06-12T20:00:00Z",
    },
    {
      group: "C",
      homeTeam: "Argentina",
      awayTeam: "Por definir",
      stadium: "MetLife Stadium",
      city: "Nueva Jersey",
      date: "2026-06-13T19:00:00Z",
    },
  ];

  for (const m of seed) {
    await matchRepository.insert({
      ...m,
      homeScore: null,
      awayScore: null,
      played: false,
    });
  }
  console.log(`Sembrados ${seed.length} partidos de ejemplo.`);
}

async function bootstrap() {
  // 1) Aseguramos que existan las tablas antes de tocar datos.
  await initDb();
  // 2) Sembramos el usuario admin y los partidos de ejemplo (si hace falta).
  await authService.seedAdmin();
  await seedMatches();

  // 3) Recién ahora levantamos el servidor HTTP.
  const app = createApp();
  app.listen(config.port, () => {
    console.log(
      `API del Mundial 2026 escuchando en http://localhost:${config.port} (${config.nodeEnv})`
    );
  });
}

bootstrap().catch((err) => {
  console.error("No se pudo iniciar la aplicación:", err);
  process.exit(1);
});
