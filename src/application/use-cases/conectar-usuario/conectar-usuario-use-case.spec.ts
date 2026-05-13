import { describe, expect, it } from "vitest";

import { Usuario } from "../../../domain/entities/usuario.js";
import type { PresencaRepository } from "../../../domain/repositories/presenca-repository.js";
import type { UsuarioRepository } from "../../../domain/repositories/usuario-repository.js";
import { NomeUsuario } from "../../../domain/value-objects/nome-usuario.js";
import type { StatusUsuario } from "../../../domain/value-objects/status-usuario.js";
import type {
  DomainEvent,
  DomainEventPublisher,
} from "../../ports/domain-event-publisher.js";
import { ConectarUsuarioUseCase } from "./conectar-usuario-use-case.js";

class InMemoryUsuarioRepository implements UsuarioRepository {
  public updatedStatus: StatusUsuario | null = null;

  public constructor(private readonly usuario: Usuario | null) {}

  public async findById(): Promise<Usuario | null> {
    return this.usuario;
  }

  public async save(): Promise<void> {}

  public async updateStatus(
    _usuarioId: string,
    status: StatusUsuario,
  ): Promise<void> {
    this.updatedStatus = status;
  }
}

class InMemoryPresencaRepository implements PresencaRepository {
  public onlineConnections: string[] = [];

  public async markOnline(
    _usuarioId: string,
    connectionId: string,
  ): Promise<void> {
    this.onlineConnections.push(connectionId);
  }

  public async markOffline(): Promise<void> {}

  public async isOnline(): Promise<boolean> {
    return this.onlineConnections.length > 0;
  }

  public async getConnectionsByUsuarioId(): Promise<string[]> {
    return this.onlineConnections;
  }
}

class InMemoryDomainEventPublisher implements DomainEventPublisher {
  public events: DomainEvent[] = [];

  public async publish(event: DomainEvent): Promise<void> {
    this.events.push(event);
  }
}

describe("ConectarUsuarioUseCase", () => {
  it("deve conectar usuário, registrar presença e publicar evento", async () => {
    const usuarioRepository = new InMemoryUsuarioRepository(
      Usuario.create({
        id: "usuario-1",
        nome: NomeUsuario.create("Fulano"),
      }),
    );
    const presencaRepository = new InMemoryPresencaRepository();
    const domainEventPublisher = new InMemoryDomainEventPublisher();
    const useCase = new ConectarUsuarioUseCase({
      usuarioRepository,
      presencaRepository,
      domainEventPublisher,
    });

    const output = await useCase.execute({
      usuarioId: "usuario-1",
      connectionId: "connection-1",
    });

    expect(output.usuarioId).toBe("usuario-1");
    expect(output.connectionId).toBe("connection-1");
    expect(output.status).toBe("online");
    expect(presencaRepository.onlineConnections).toEqual(["connection-1"]);
    expect(usuarioRepository.updatedStatus).toBe("online");
    expect(domainEventPublisher.events).toHaveLength(1);
  });

  it("não deve conectar usuário inexistente", async () => {
    const useCase = new ConectarUsuarioUseCase({
      usuarioRepository: new InMemoryUsuarioRepository(null),
      presencaRepository: new InMemoryPresencaRepository(),
      domainEventPublisher: new InMemoryDomainEventPublisher(),
    });

    await expect(
      useCase.execute({
        usuarioId: "usuario-inexistente",
        connectionId: "connection-1",
      }),
    ).rejects.toThrow("Usuário não encontrado.");
  });
});
