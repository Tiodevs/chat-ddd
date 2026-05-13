import { describe, expect, it } from "vitest";

import { SalaDeChat } from "../../../domain/entities/sala-de-chat.js";
import { NomeDaSala } from "../../../domain/value-objects/nome-da-sala.js";
import { InMemorySalaDeChatRepository } from "./in-memory-sala-de-chat-repository.js";

describe("InMemorySalaDeChatRepository", () => {
  it("deve salvar e buscar sala por id", async () => {
    const repository = new InMemorySalaDeChatRepository();
    const sala = SalaDeChat.create({
      id: "sala-1",
      nome: NomeDaSala.create("Geral"),
      criadorId: "usuario-1",
    });

    await repository.save(sala);

    await expect(repository.findById("sala-1")).resolves.toBe(sala);
    await expect(repository.findById("sala-inexistente")).resolves.toBeNull();
  });

  it("deve verificar existência por nome", async () => {
    const repository = new InMemorySalaDeChatRepository();
    const sala = SalaDeChat.create({
      id: "sala-1",
      nome: NomeDaSala.create("Geral"),
      criadorId: "usuario-1",
    });

    await repository.save(sala);

    await expect(repository.existsByName(NomeDaSala.create("Geral"))).resolves.toBe(
      true,
    );
    await expect(repository.existsByName(NomeDaSala.create("Outra"))).resolves.toBe(
      false,
    );
  });
});
