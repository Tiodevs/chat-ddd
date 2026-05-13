import { describe, expect, it } from "vitest";

import type { Mensagem } from "../../../domain/entities/mensagem.js";
import { SalaDeChat } from "../../../domain/entities/sala-de-chat.js";
import type { MensagemRepository } from "../../../domain/repositories/mensagem-repository.js";
import type { SalaDeChatRepository } from "../../../domain/repositories/sala-de-chat-repository.js";
import { NomeDaSala } from "../../../domain/value-objects/nome-da-sala.js";
import type {
  DomainEvent,
  DomainEventPublisher,
} from "../../ports/domain-event-publisher.js";
import type { IdGenerator } from "../../ports/id-generator.js";
import { EnviarMensagemUseCase } from "./enviar-mensagem-use-case.js";

class FixedIdGenerator implements IdGenerator {
  public generate(): string {
    return "mensagem-1";
  }
}

class InMemoryDomainEventPublisher implements DomainEventPublisher {
  public events: DomainEvent[] = [];

  public async publish(event: DomainEvent): Promise<void> {
    this.events.push(event);
  }
}

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
  public mensagens: Mensagem[] = [];

  public async save(mensagem: Mensagem): Promise<void> {
    this.mensagens.push(mensagem);
  }

  public async findBySalaId(): Promise<Mensagem[]> {
    return this.mensagens;
  }

  public async findRecentBySalaId(): Promise<Mensagem[]> {
    return this.mensagens;
  }
}

describe("EnviarMensagemUseCase", () => {
  it("deve enviar, persistir e publicar evento de mensagem", async () => {
    const sala = SalaDeChat.create({
      id: "sala-1",
      nome: NomeDaSala.create("Geral"),
      criadorId: "usuario-1",
    });
    const mensagemRepository = new InMemoryMensagemRepository();
    const domainEventPublisher = new InMemoryDomainEventPublisher();
    const useCase = new EnviarMensagemUseCase({
      salaDeChatRepository: new InMemorySalaDeChatRepository(sala),
      mensagemRepository,
      domainEventPublisher,
      idGenerator: new FixedIdGenerator(),
    });

    const output = await useCase.execute({
      salaId: "sala-1",
      remetenteId: "usuario-1",
      conteudo: "Olá",
    });

    expect(output.id).toBe("mensagem-1");
    expect(output.salaId).toBe("sala-1");
    expect(output.remetenteId).toBe("usuario-1");
    expect(output.conteudo).toBe("Olá");
    expect(mensagemRepository.mensagens).toHaveLength(1);
    expect(domainEventPublisher.events).toHaveLength(1);
  });

  it("não deve enviar mensagem para sala inexistente", async () => {
    const useCase = new EnviarMensagemUseCase({
      salaDeChatRepository: new InMemorySalaDeChatRepository(null),
      mensagemRepository: new InMemoryMensagemRepository(),
      domainEventPublisher: new InMemoryDomainEventPublisher(),
      idGenerator: new FixedIdGenerator(),
    });

    await expect(
      useCase.execute({
        salaId: "sala-inexistente",
        remetenteId: "usuario-1",
        conteudo: "Olá",
      }),
    ).rejects.toThrow("Sala de chat não encontrada.");
  });
});
