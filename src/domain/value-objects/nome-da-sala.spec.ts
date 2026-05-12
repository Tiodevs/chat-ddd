import { describe, expect, it } from "vitest";

import { NomeDaSala } from "./nome-da-sala.js";

describe("NomeDaSala", () => {
  it("deve criar um nome de sala válido", () => {
    const nome = NomeDaSala.create("Geral");

    expect(nome.valor).toBe("Geral");
    expect(nome.toString()).toBe("Geral");
  });

  it("deve normalizar espaços extras", () => {
    const nome = NomeDaSala.create("  Sala   Geral  ");

    expect(nome.valor).toBe("Sala Geral");
  });

  it("deve comparar nomes pelo valor", () => {
    const primeiroNome = NomeDaSala.create("Geral");
    const segundoNome = NomeDaSala.create("Geral");

    expect(primeiroNome.equals(segundoNome)).toBe(true);
  });

  it("não deve aceitar nome vazio", () => {
    expect(() => NomeDaSala.create("")).toThrow(
      "Nome da sala não pode ser vazio.",
    );
  });

  it("não deve aceitar nome menor que o tamanho mínimo", () => {
    expect(() => NomeDaSala.create("A")).toThrow(
      "Nome da sala deve ter pelo menos 2 caracteres.",
    );
  });

  it("não deve aceitar nome maior que o tamanho máximo", () => {
    const nomeMuitoGrande = "A".repeat(NomeDaSala.MAX_LENGTH + 1);

    expect(() => NomeDaSala.create(nomeMuitoGrande)).toThrow(
      "Nome da sala deve ter no máximo 100 caracteres.",
    );
  });
});
