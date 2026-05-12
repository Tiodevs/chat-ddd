export type UsuarioConectadoEventProps = {
  usuarioId: string;
  connectionId: string;
  conectadoEm: Date;
};

export class UsuarioConectadoEvent {
  public readonly eventName = "usuario.conectado";
  public readonly usuarioId: string;
  public readonly connectionId: string;
  public readonly conectadoEm: Date;

  private constructor(props: UsuarioConectadoEventProps) {
    this.usuarioId = props.usuarioId;
    this.connectionId = props.connectionId;
    this.conectadoEm = new Date(props.conectadoEm);
  }

  public static create(props: UsuarioConectadoEventProps): UsuarioConectadoEvent {
    if (props.usuarioId.trim().length === 0) {
      throw new Error("Evento de usuário conectado exige um usuarioId válido.");
    }

    if (props.connectionId.trim().length === 0) {
      throw new Error(
        "Evento de usuário conectado exige um connectionId válido.",
      );
    }

    if (Number.isNaN(props.conectadoEm.getTime())) {
      throw new Error(
        "Evento de usuário conectado exige uma data de conexão válida.",
      );
    }

    return new UsuarioConectadoEvent({
      usuarioId: props.usuarioId,
      connectionId: props.connectionId,
      conectadoEm: props.conectadoEm,
    });
  }
}
