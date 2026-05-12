import { describe, expect, it } from "vitest";

import { MensagemEnviadaEvent } from "./mensagem-enviada-event.js";

describe("MensagemEnviadaEvent", () => {
  it("deve criar evento de mensagem enviada", () => {
    const enviadaEm = new Date("2026-05-12T03:00:00.000Z");

    const event = MensagemEnviadaEvent.create({
      mensagemId: "mensagem-1",
      salaId: "sala-1",
      remetenteId: "usuario-1",
      conteudo: "Olá",
      enviadaEm,
    });

    expect(event.eventName).toBe("mensagem.enviada");
    expect(event.mensagemId).toBe("mensagem-1");
    expect(event.salaId).toBe("sala-1");
    expect(event.remetenteId).toBe("usuario-1");
    expect(event.conteudo).toBe("Olá");
    expect(event.enviadaEm).toEqual(enviadaEm);
  });

  it("não deve aceitar conteúdo vazio", () => {
    expect(() =>
      MensagemEnviadaEvent.create({
        mensagemId: "mensagem-1",
        salaId: "sala-1",
        remetenteId: "usuario-1",
        conteudo: " ",
        enviadaEm: new Date(),
      }),
    ).toThrow("Evento de mensagem enviada exige conteúdo válido.");
  });
});
