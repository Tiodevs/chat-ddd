import type { SalaDeChat } from "../../../domain/entities/sala-de-chat.js";
import type { SalaDeChatRepository } from "../../../domain/repositories/sala-de-chat-repository.js";
import type { NomeDaSala } from "../../../domain/value-objects/nome-da-sala.js";

export class InMemorySalaDeChatRepository implements SalaDeChatRepository {
  private readonly salas = new Map<string, SalaDeChat>();

  public async findById(salaId: string): Promise<SalaDeChat | null> {
    return this.salas.get(salaId) ?? null;
  }

  public async save(sala: SalaDeChat): Promise<void> {
    this.salas.set(sala.id, sala);
  }

  public async existsByName(nome: NomeDaSala): Promise<boolean> {
    return Array.from(this.salas.values()).some((sala) =>
      sala.nome.equals(nome),
    );
  }

  public all(): SalaDeChat[] {
    return Array.from(this.salas.values());
  }

  public clear(): void {
    this.salas.clear();
  }
}
