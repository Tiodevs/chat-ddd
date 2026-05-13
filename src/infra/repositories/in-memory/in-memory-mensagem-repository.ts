import type { Mensagem } from "../../../domain/entities/mensagem.js";
import type {
  MensagemRepository,
  Pagination,
} from "../../../domain/repositories/mensagem-repository.js";

export class InMemoryMensagemRepository implements MensagemRepository {
  private readonly mensagens = new Map<string, Mensagem>();

  public async save(mensagem: Mensagem): Promise<void> {
    this.mensagens.set(mensagem.id, mensagem);
  }

  public async findBySalaId(
    salaId: string,
    pagination: Pagination,
  ): Promise<Mensagem[]> {
    const start = (pagination.page - 1) * pagination.perPage;
    const end = start + pagination.perPage;

    return this.findMessagesBySalaId(salaId).slice(start, end);
  }

  public async findRecentBySalaId(
    salaId: string,
    limit: number,
  ): Promise<Mensagem[]> {
    return this.findMessagesBySalaId(salaId)
      .sort((left, right) => right.enviadaEm.getTime() - left.enviadaEm.getTime())
      .slice(0, limit);
  }

  public all(): Mensagem[] {
    return Array.from(this.mensagens.values());
  }

  public clear(): void {
    this.mensagens.clear();
  }

  private findMessagesBySalaId(salaId: string): Mensagem[] {
    return Array.from(this.mensagens.values())
      .filter((mensagem) => mensagem.salaId === salaId)
      .sort((left, right) => left.enviadaEm.getTime() - right.enviadaEm.getTime());
  }
}
