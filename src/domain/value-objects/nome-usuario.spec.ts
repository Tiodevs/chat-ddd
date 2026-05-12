import { describe, expect, it } from "vitest";

import { NomeUsuario } from "./nome-usuario.js";

describe("NomeUsuario", () => {
  it("deve criar um nome de usuário válido", () => {
    const nome = NomeUsuario.create("Fulano");

    expect(nome.valor).toBe("Fulano");
    expect(nome.toString()).toBe("Fulano");
  });

  it("deve normalizar espaços extras", () => {
    const nome = NomeUsuario.create("  Fulano   de   Tal  ");

    expect(nome.valor).toBe("Fulano de Tal");
  });

  it("deve comparar nomes pelo valor", () => {
    const primeiroNome = NomeUsuario.create("Fulano");
    const segundoNome = NomeUsuario.create("Fulano");

    expect(primeiroNome.equals(segundoNome)).toBe(true);
  });

  it("não deve aceitar nome vazio", () => {
    expect(() => NomeUsuario.create("")).toThrow(
      "Nome do usuário não pode ser vazio.",
    );
  });

  it("não deve aceitar nome com apenas espaços em branco", () => {
    expect(() => NomeUsuario.create("   ")).toThrow(
      "Nome do usuário não pode ser vazio.",
    );
  });

  it("não deve aceitar nome menor que o tamanho mínimo", () => {
    expect(() => NomeUsuario.create("A")).toThrow(
      "Nome do usuário deve ter pelo menos 2 caracteres.",
    );
  });

  it("não deve aceitar nome maior que o tamanho máximo", () => {
    const nomeMuitoGrande = "A".repeat(NomeUsuario.MAX_LENGTH + 1);

    expect(() => NomeUsuario.create(nomeMuitoGrande)).toThrow(
      "Nome do usuário deve ter no máximo 80 caracteres.",
    );
  });
});
