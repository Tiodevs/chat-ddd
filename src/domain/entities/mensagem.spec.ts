import { describe, expect, it } from "vitest";

import { ConteudoDaMensagem } from "../value-objects/conteudo-da-mensagem.js";
import { Mensagem } from "./mensagem.js";

describe("Mensagem", () => {
  it("deve criar uma mensagem válida", () => {
    const enviadaEm = new Date("2026-05-12T03:00:00.000Z");
    const conteudo = ConteudoDaMensagem.create("Olá");

    const mensagem = Mensagem.create({
      id: "mensagem-1",
      salaId: "sala-1",
      remetenteId: "usuario-1",
      conteudo,
      enviadaEm,
    });

    expect(mensagem.id).toBe("mensagem-1");
    expect(mensagem.salaId).toBe("sala-1");
    expect(mensagem.remetenteId).toBe("usuario-1");
    expect(mensagem.conteudo).toBe(conteudo);
    expect(mensagem.enviadaEm).toEqual(enviadaEm);
  });

  it("deve comparar mensagens pelo id", () => {
    const primeiraMensagem = Mensagem.create({
      id: "mensagem-1",
      salaId: "sala-1",
      remetenteId: "usuario-1",
      conteudo: ConteudoDaMensagem.create("Olá"),
    });
    const segundaMensagem = Mensagem.restore({
      id: "mensagem-1",
      salaId: "sala-2",
      remetenteId: "usuario-2",
      conteudo: ConteudoDaMensagem.create("Outro conteúdo"),
      enviadaEm: new Date("2026-05-12T03:00:00.000Z"),
    });

    expect(primeiraMensagem.equals(segundaMensagem)).toBe(true);
  });

  it("não deve aceitar remetenteId vazio", () => {
    expect(() =>
      Mensagem.create({
        id: "mensagem-1",
        salaId: "sala-1",
        remetenteId: " ",
        conteudo: ConteudoDaMensagem.create("Olá"),
      }),
    ).toThrow("Mensagem exige um remetenteId válido.");
  });
});
