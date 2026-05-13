import { describe, expect, it } from "vitest";

import { Mensagem } from "../../../domain/entities/mensagem.js";
import { SalaDeChat } from "../../../domain/entities/sala-de-chat.js";
import type {
  MensagemRepository,
  Pagination,
} from "../../../domain/repositories/mensagem-repository.js";
import type { SalaDeChatRepository } from "../../../domain/repositories/sala-de-chat-repository.js";
import { ConteudoDaMensagem } from "../../../domain/value-objects/conteudo-da-mensagem.js";
import { NomeDaSala } from "../../../domain/value-objects/nome-da-sala.js";
import { ListarMensagensDaSalaUseCase } from "./listar-mensagens-da-sala-use-case.js";

class InMemorySalaDeChatRepository implements SalaDeChatRepository {
  public constructor(private readonly sala: SalaDeChat | null) {}

  public async findById(): Promise<SalaDeChat | null> {
    return this.sala;
  }

  public async save(): Promise<void> {}

  public async existsByName(): Promise<boolean> {
    return false;
  }
}

class InMemoryMensagemRepository implements MensagemRepository {
  public lastPagination: Pagination | null = null;

  public constructor(private readonly mensagens: Mensagem[]) {}

  public async save(): Promise<void> {}

  public async findBySalaId(
    _salaId: string,
    pagination: Pagination,
  ): Promise<Mensagem[]> {
    this.lastPagination = pagination;
    return this.mensagens;
  }

  public async findRecentBySalaId(): Promise<Mensagem[]> {
    return this.mensagens;
  }
}

describe("ListarMensagensDaSalaUseCase", () => {
  it("deve listar mensagens quando usuário participa da sala", async () => {
    const sala = SalaDeChat.create({
      id: "sala-1",
      nome: NomeDaSala.create("Geral"),
      criadorId: "usuario-1",
    });
    const mensagem = Mensagem.create({
      id: "mensagem-1",
      salaId: "sala-1",
      remetenteId: "usuario-1",
      conteudo: ConteudoDaMensagem.create("Olá"),
      enviadaEm: new Date("2026-05-12T03:00:00.000Z"),
    });
    const mensagemRepository = new InMemoryMensagemRepository([mensagem]);
    const useCase = new ListarMensagensDaSalaUseCase({
      salaDeChatRepository: new InMemorySalaDeChatRepository(sala),
      mensagemRepository,
    });

    const output = await useCase.execute({
      salaId: "sala-1",
      usuarioId: "usuario-1",
    });

    expect(output.mensagens).toEqual([
      {
        id: "mensagem-1",
        salaId: "sala-1",
        remetenteId: "usuario-1",
        conteudo: "Olá",
        enviadaEm: "2026-05-12T03:00:00.000Z",
      },
    ]);
    expect(output.page).toBe(1);
    expect(output.perPage).toBe(20);
    expect(mensagemRepository.lastPagination).toEqual({
      page: 1,
      perPage: 20,
    });
  });

  it("não deve listar mensagens para usuário fora da sala", async () => {
    const sala = SalaDeChat.create({
      id: "sala-1",
      nome: NomeDaSala.create("Geral"),
      criadorId: "usuario-1",
    });
    const useCase = new ListarMensagensDaSalaUseCase({
      salaDeChatRepository: new InMemorySalaDeChatRepository(sala),
      mensagemRepository: new InMemoryMensagemRepository([]),
    });

    await expect(
      useCase.execute({
        salaId: "sala-1",
        usuarioId: "usuario-2",
      }),
    ).rejects.toThrow("Apenas participantes da sala podem listar mensagens.");
  });
});
