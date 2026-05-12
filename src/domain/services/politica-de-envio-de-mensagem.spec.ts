import { describe, expect, it } from "vitest";

import { NomeDaSala } from "../value-objects/nome-da-sala.js";
import { PoliticaDeEnvioDeMensagem } from "./politica-de-envio-de-mensagem.js";
import { SalaDeChat } from "../entities/sala-de-chat.js";

describe("PoliticaDeEnvioDeMensagem", () => {
  it("deve permitir participante da sala", () => {
    const sala = SalaDeChat.create({
      id: "sala-1",
      nome: NomeDaSala.create("Geral"),
      criadorId: "usuario-1",
    });

    expect(() =>
      PoliticaDeEnvioDeMensagem.validar(sala, "usuario-1"),
    ).not.toThrow();
  });

  it("não deve permitir usuário que não participa da sala", () => {
    const sala = SalaDeChat.create({
      id: "sala-1",
      nome: NomeDaSala.create("Geral"),
      criadorId: "usuario-1",
    });

    expect(() => PoliticaDeEnvioDeMensagem.validar(sala, "usuario-2")).toThrow(
      "Apenas participantes da sala podem enviar mensagens.",
    );
  });
});
