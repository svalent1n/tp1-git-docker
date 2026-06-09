/**
 * Capa de Servicio - Partidos
 * ---------------------------
 * Contiene la lógica de negocio del fixture: validaciones, reglas y coordinación
 * con el repositorio. Los controladores no tocan datos directamente; siempre
 * pasan por aquí. Así la regla de negocio queda en un solo lugar y es testeable.
 *
 * Como el repositorio ahora habla con MySQL (operación de I/O), sus métodos
 * devuelven Promesas: por eso este servicio pasó a ser async/await.
 */

import { matchRepository } from "../repositories/match.repository";
import { CreateMatchDTO, Match, ResultDTO } from "../domain/types";
import { Errors } from "../domain/errors";

class MatchService {
  /** Lista todos los partidos, o solo los de un grupo si se indica. */
  async list(group?: string): Promise<Match[]> {
    if (group) return matchRepository.findByGroup(group);
    return matchRepository.findAll();
  }

  /** Obtiene un partido por id o lanza 404 si no existe. */
  async getById(id: number): Promise<Match> {
    const match = await matchRepository.findById(id);
    if (!match) throw Errors.notFound("Partido no encontrado");
    return match;
  }

  /** Crea un partido validando que los campos obligatorios estén presentes. */
  async create(data: CreateMatchDTO): Promise<Match> {
    this.validateCreate(data);
    return matchRepository.insert({
      group: data.group.trim(),
      homeTeam: data.homeTeam.trim(),
      awayTeam: data.awayTeam.trim(),
      stadium: data.stadium.trim(),
      city: data.city.trim(),
      date: data.date,
      homeScore: null,
      awayScore: null,
      played: false,
    });
  }

  /** Carga el resultado de un partido y lo marca como jugado. */
  async setResult(id: number, result: ResultDTO): Promise<Match> {
    if (
      !Number.isInteger(result.homeScore) ||
      !Number.isInteger(result.awayScore) ||
      result.homeScore < 0 ||
      result.awayScore < 0
    ) {
      throw Errors.badRequest("Los goles deben ser números enteros no negativos");
    }
    const updated = await matchRepository.update(id, {
      homeScore: result.homeScore,
      awayScore: result.awayScore,
      played: true,
    });
    if (!updated) throw Errors.notFound("Partido no encontrado");
    return updated;
  }

  /** Elimina un partido o lanza 404 si no existe. */
  async remove(id: number): Promise<void> {
    const ok = await matchRepository.delete(id);
    if (!ok) throw Errors.notFound("Partido no encontrado");
  }

  /** Valida los campos obligatorios al crear un partido. */
  private validateCreate(data: CreateMatchDTO): void {
    const { group, homeTeam, awayTeam, stadium, city, date } = data;
    if (!group || !homeTeam || !awayTeam || !stadium || !city || !date) {
      throw Errors.badRequest("Faltan campos obligatorios del partido");
    }
    if (homeTeam.trim() === awayTeam.trim()) {
      throw Errors.badRequest("Un equipo no puede jugar contra sí mismo");
    }
    if (isNaN(Date.parse(date))) {
      throw Errors.badRequest("La fecha no tiene un formato válido (ISO 8601)");
    }
  }
}

// Instancia única (singleton) del servicio.
export const matchService = new MatchService();
