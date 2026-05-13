import type { Usuario } from "../../../domain/entities/usuario.js";
import type { UsuarioRepository } from "../../../domain/repositories/usuario-repository.js";
import { STATUS_USUARIO, type StatusUsuario } from "../../../domain/value-objects/status-usuario.js";

export class InMemoryUsuarioRepository implements UsuarioRepository {
  private readonly usuarios = new Map<string, Usuario>();

  public async findById(usuarioId: string): Promise<Usuario | null> {
    return this.usuarios.get(usuarioId) ?? null;
  }

  public async save(usuario: Usuario): Promise<void> {
    this.usuarios.set(usuario.id, usuario);
  }

  public async updateStatus(
    usuarioId: string,
    status: StatusUsuario,
  ): Promise<void> {
    const usuario = this.usuarios.get(usuarioId);

    if (!usuario) {
      return;
    }

    if (status === STATUS_USUARIO.ONLINE) {
      usuario.marcarComoOnline();
      return;
    }

    usuario.marcarComoOffline();
  }

  public all(): Usuario[] {
    return Array.from(this.usuarios.values());
  }

  public clear(): void {
    this.usuarios.clear();
  }
}
