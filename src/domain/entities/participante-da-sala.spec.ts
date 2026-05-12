import { describe, expect, it } from "vitest";

import { ParticipanteDaSala } from "./participante-da-sala.js";

describe("ParticipanteDaSala", () => {
  it("deve criar um participante da sala", () => {
    const entrouEm = new Date("2026-05-12T03:00:00.000Z");

    const participante = ParticipanteDaSala.create({
      usuarioId: "usuario-1",
      salaId: "sala-1",
      entrouEm,
    });

    expect(participante.usuarioId).toBe("usuario-1");
    expect(participante.salaId).toBe("sala-1");
    expect(participante.entrouEm).toEqual(entrouEm);
  });

  it("deve comparar participantes por usuário e sala", () => {
    const primeiroParticipante = ParticipanteDaSala.create({
      usuarioId: "usuario-1",
      salaId: "sala-1",
    });
    const segundoParticipante = ParticipanteDaSala.create({
      usuarioId: "usuario-1",
      salaId: "sala-1",
    });

    expect(primeiroParticipante.equals(segundoParticipante)).toBe(true);
  });

  it("não deve aceitar usuarioId vazio", () => {
    expect(() =>
      ParticipanteDaSala.create({
        usuarioId: " ",
        salaId: "sala-1",
      }),
    ).toThrow("Participante da sala exige um usuarioId válido.");
  });

  it("não deve aceitar salaId vazio", () => {
    expect(() =>
      ParticipanteDaSala.create({
        usuarioId: "usuario-1",
        salaId: " ",
      }),
    ).toThrow("Participante da sala exige um salaId válido.");
  });
});
