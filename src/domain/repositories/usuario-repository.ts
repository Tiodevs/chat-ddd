import { Usuario } from "../entities/usuario.js";
import type { StatusUsuario } from "../value-objects/status-usuario.js";

export interface UsuarioRepository {
  findById(usuarioId: string): Promise<Usuario | null>;
  save(usuario: Usuario): Promise<void>;
  updateStatus(usuarioId: string, status: StatusUsuario): Promise<void>;
}
