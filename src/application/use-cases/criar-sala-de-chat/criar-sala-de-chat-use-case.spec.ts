import { describe, expect, it } from "vitest";

import type { SalaDeChat } from "../../../domain/entities/sala-de-chat.js";
import type { SalaDeChatRepository } from "../../../domain/repositories/sala-de-chat-repository.js";
import type { NomeDaSala } from "../../../domain/value-objects/nome-da-sala.js";
import type { IdGenerator } from "../../ports/id-generator.js";
import { CriarSalaDeChatUseCase } from "./criar-sala-de-chat-use-case.js";

class FixedIdGenerator implements IdGenerator {
  public generate(): string {
    return "sala-1";
  }
}

class InMemorySalaDeChatRepository implements SalaDeChatRepository {
  public salas: SalaDeChat[] = [];

  public async findById(salaId: string): Promise<SalaDeChat | null> {
    return this.salas.find((sala) => sala.id === salaId) ?? null;
  }

  public async save(sala: SalaDeChat): Promise<void> {
    this.salas.push(sala);
  }

  public async existsByName(nome: NomeDaSala): Promise<boolean> {
    return this.salas.some((sala) => sala.nome.equals(nome));
  }
}

describe("CriarSalaDeChatUseCase", () => {
  it("deve criar e persistir uma sala", async () => {
    const salaDeChatRepository = new InMemorySalaDeChatRepository();
    const useCase = new CriarSalaDeChatUseCase({
      salaDeChatRepository,
      idGenerator: new FixedIdGenerator(),
    });

    const output = await useCase.execute({
      nome: "Geral",
      criadorId: "usuario-1",
    });

    expect(output.id).toBe("sala-1");
    expect(output.nome).toBe("Geral");
    expect(output.participantesIds).toEqual(["usuario-1"]);
    expect(salaDeChatRepository.salas).toHaveLength(1);
  });

  it("não deve criar sala com nome duplicado", async () => {
    const salaDeChatRepository = new InMemorySalaDeChatRepository();
    const useCase = new CriarSalaDeChatUseCase({
      salaDeChatRepository,
      idGenerator: new FixedIdGenerator(),
    });

    await useCase.execute({
      nome: "Geral",
      criadorId: "usuario-1",
    });

    await expect(
      useCase.execute({
        nome: "Geral",
        criadorId: "usuario-2",
      }),
    ).rejects.toThrow("Já existe uma sala com esse nome.");
  });
});
