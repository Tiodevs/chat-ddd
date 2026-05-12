import { ConteudoDaMensagem } from "../value-objects/conteudo-da-mensagem.js";

export type MensagemProps = {
  id: string;
  salaId: string;
  remetenteId: string;
  conteudo: ConteudoDaMensagem;
  enviadaEm: Date;
};

export type CriarMensagemProps = {
  id: string;
  salaId: string;
  remetenteId: string;
  conteudo: ConteudoDaMensagem;
  enviadaEm?: Date;
};

export type RestaurarMensagemProps = MensagemProps;

export class Mensagem {
  private constructor(private readonly props: MensagemProps) {
    this.props.enviadaEm = new Date(props.enviadaEm);
    this.validate();
  }

  public static create(props: CriarMensagemProps): Mensagem {
    return new Mensagem({
      id: props.id,
      salaId: props.salaId,
      remetenteId: props.remetenteId,
      conteudo: props.conteudo,
      enviadaEm: props.enviadaEm ?? new Date(),
    });
  }

  public static restore(props: RestaurarMensagemProps): Mensagem {
    return new Mensagem(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get salaId(): string {
    return this.props.salaId;
  }

  public get remetenteId(): string {
    return this.props.remetenteId;
  }

  public get conteudo(): ConteudoDaMensagem {
    return this.props.conteudo;
  }

  public get enviadaEm(): Date {
    return new Date(this.props.enviadaEm);
  }

  public equals(mensagem: Mensagem): boolean {
    return this.id === mensagem.id;
  }

  private validate(): void {
    if (this.props.id.trim().length === 0) {
      throw new Error("Mensagem exige um id válido.");
    }

    if (this.props.salaId.trim().length === 0) {
      throw new Error("Mensagem exige um salaId válido.");
    }

    if (this.props.remetenteId.trim().length === 0) {
      throw new Error("Mensagem exige um remetenteId válido.");
    }

    if (Number.isNaN(this.props.enviadaEm.getTime())) {
      throw new Error("Mensagem exige uma data de envio válida.");
    }
  }
}
