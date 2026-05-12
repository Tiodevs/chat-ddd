import { UsuarioConectadoEvent } from "../events/usuario-conectado-event.js";
import { NomeUsuario } from "../value-objects/nome-usuario.js";
import { STATUS_USUARIO, type StatusUsuario } from "../value-objects/status-usuario.js";

export type UsuarioStatus = StatusUsuario;

export type UsuarioProps = {
  id: string;
  nome: NomeUsuario;
  status: UsuarioStatus;
  criadoEm: Date;
};

export type CriarUsuarioProps = {
  id: string;
  nome: NomeUsuario;
  criadoEm?: Date;
};

export type RestaurarUsuarioProps = UsuarioProps;

export class Usuario {
  private constructor(private readonly props: UsuarioProps) {
    this.props.criadoEm = new Date(props.criadoEm);
    this.validate();
  }

  public static create(props: CriarUsuarioProps): Usuario {
    return new Usuario({
      id: props.id,
      nome: props.nome,
      status: STATUS_USUARIO.OFFLINE,
      criadoEm: props.criadoEm ?? new Date(),
    });
  }

  public static restore(props: RestaurarUsuarioProps): Usuario {
    return new Usuario(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get nome(): NomeUsuario {
    return this.props.nome;
  }

  public get status(): UsuarioStatus {
    return this.props.status;
  }

  public get criadoEm(): Date {
    return new Date(this.props.criadoEm);
  }

  public alterarNome(nome: NomeUsuario): void {
    this.props.nome = nome;
  }

  public conectar(connectionId: string, conectadoEm = new Date()): UsuarioConectadoEvent {
    this.marcarComoOnline();

    return UsuarioConectadoEvent.create({
      usuarioId: this.id,
      connectionId,
      conectadoEm,
    });
  }

  public marcarComoOnline(): void {
    this.props.status = STATUS_USUARIO.ONLINE;
  }

  public marcarComoOffline(): void {
    this.props.status = STATUS_USUARIO.OFFLINE;
  }

  public equals(usuario: Usuario): boolean {
    return this.id === usuario.id;
  }

  private validate(): void {
    if (this.props.id.trim().length === 0) {
      throw new Error("Usuário exige um id válido.");
    }

    if (Number.isNaN(this.props.criadoEm.getTime())) {
      throw new Error("Usuário exige uma data de criação válida.");
    }
  }
}
