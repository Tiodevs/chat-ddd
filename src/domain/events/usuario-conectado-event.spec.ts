import { describe, expect, it } from "vitest";

import { UsuarioConectadoEvent } from "./usuario-conectado-event.js";

describe("UsuarioConectadoEvent", () => {
  it("deve criar um evento de usuário conectado", () => {
    const conectadoEm = new Date("2026-05-12T03:00:00.000Z");

    const event = UsuarioConectadoEvent.create({
      usuarioId: "usuario-1",
      connectionId: "connection-1",
      conectadoEm,
    });

    expect(event.eventName).toBe("usuario.conectado");
    expect(event.usuarioId).toBe("usuario-1");
    expect(event.connectionId).toBe("connection-1");
    expect(event.conectadoEm).toEqual(conectadoEm);
  });

  it("deve proteger a data interna contra mutação externa", () => {
    const conectadoEm = new Date("2026-05-12T03:00:00.000Z");

    const event = UsuarioConectadoEvent.create({
      usuarioId: "usuario-1",
      connectionId: "connection-1",
      conectadoEm,
    });

    conectadoEm.setFullYear(2030);

    expect(event.conectadoEm).toEqual(new Date("2026-05-12T03:00:00.000Z"));
  });

  it("não deve aceitar usuarioId vazio", () => {
    expect(() =>
      UsuarioConectadoEvent.create({
        usuarioId: " ",
        connectionId: "connection-1",
        conectadoEm: new Date(),
      }),
    ).toThrow("Evento de usuário conectado exige um usuarioId válido.");
  });

  it("não deve aceitar connectionId vazio", () => {
    expect(() =>
      UsuarioConectadoEvent.create({
        usuarioId: "usuario-1",
        connectionId: " ",
        conectadoEm: new Date(),
      }),
    ).toThrow("Evento de usuário conectado exige um connectionId válido.");
  });

  it("não deve aceitar data inválida", () => {
    expect(() =>
      UsuarioConectadoEvent.create({
        usuarioId: "usuario-1",
        connectionId: "connection-1",
        conectadoEm: new Date("data-invalida"),
      }),
    ).toThrow("Evento de usuário conectado exige uma data de conexão válida.");
  });
});
