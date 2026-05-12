export interface PresencaRepository {
  markOnline(usuarioId: string, connectionId: string): Promise<void>;
  markOffline(usuarioId: string, connectionId: string): Promise<void>;
  isOnline(usuarioId: string): Promise<boolean>;
  getConnectionsByUsuarioId(usuarioId: string): Promise<string[]>;
}
