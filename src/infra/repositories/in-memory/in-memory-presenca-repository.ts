import type { PresencaRepository } from "../../../domain/repositories/presenca-repository.js";

export class InMemoryPresencaRepository implements PresencaRepository {
  private readonly connectionsByUsuarioId = new Map<string, Set<string>>();

  public async markOnline(
    usuarioId: string,
    connectionId: string,
  ): Promise<void> {
    const connections = this.connectionsByUsuarioId.get(usuarioId) ?? new Set();

    connections.add(connectionId);
    this.connectionsByUsuarioId.set(usuarioId, connections);
  }

  public async markOffline(
    usuarioId: string,
    connectionId: string,
  ): Promise<void> {
    const connections = this.connectionsByUsuarioId.get(usuarioId);

    if (!connections) {
      return;
    }

    connections.delete(connectionId);

    if (connections.size === 0) {
      this.connectionsByUsuarioId.delete(usuarioId);
    }
  }

  public async isOnline(usuarioId: string): Promise<boolean> {
    return (this.connectionsByUsuarioId.get(usuarioId)?.size ?? 0) > 0;
  }

  public async getConnectionsByUsuarioId(usuarioId: string): Promise<string[]> {
    return Array.from(this.connectionsByUsuarioId.get(usuarioId) ?? []);
  }

  public clear(): void {
    this.connectionsByUsuarioId.clear();
  }
}
