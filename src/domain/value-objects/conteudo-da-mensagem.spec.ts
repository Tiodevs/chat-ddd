import { describe, expect, it } from "vitest";

import { ConteudoDaMensagem } from "./conteudo-da-mensagem.js";

describe("ConteudoDaMensagem", () => {
  it("deve criar conteúdo válido", () => {
    const conteudo = ConteudoDaMensagem.create("Olá mundo");

    expect(conteudo.valor).toBe("Olá mundo");
    expect(conteudo.toString()).toBe("Olá mundo");
  });

  it("deve remover espaços no início e no fim", () => {
    const conteudo = ConteudoDaMensagem.create("  Olá mundo  ");

    expect(conteudo.valor).toBe("Olá mundo");
  });

  it("deve comparar conteúdos pelo valor", () => {
    const primeiroConteudo = ConteudoDaMensagem.create("Olá");
    const segundoConteudo = ConteudoDaMensagem.create("Olá");

    expect(primeiroConteudo.equals(segundoConteudo)).toBe(true);
  });

  it("não deve aceitar conteúdo vazio", () => {
    expect(() => ConteudoDaMensagem.create("")).toThrow(
      "Conteúdo da mensagem não pode ser vazio.",
    );
  });

  it("não deve aceitar conteúdo com apenas espaços em branco", () => {
    expect(() => ConteudoDaMensagem.create("   ")).toThrow(
      "Conteúdo da mensagem não pode ser vazio.",
    );
  });

  it("não deve aceitar conteúdo maior que o limite", () => {
    const conteudoMuitoGrande = "A".repeat(
      ConteudoDaMensagem.MAX_LENGTH + 1,
    );

    expect(() => ConteudoDaMensagem.create(conteudoMuitoGrande)).toThrow(
      "Conteúdo da mensagem deve ter no máximo 500 caracteres.",
    );
  });
});
