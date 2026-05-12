export type MensagemEnviadaEventProps = {
  mensagemId: string;
  salaId: string;
  remetenteId: string;
  conteudo: string;
  enviadaEm: Date;
};

export class MensagemEnviadaEvent {
  public readonly eventName = "mensagem.enviada";
  public readonly mensagemId: string;
  public readonly salaId: string;
  public readonly remetenteId: string;
  public readonly conteudo: string;
  public readonly enviadaEm: Date;

  private constructor(props: MensagemEnviadaEventProps) {
    this.mensagemId = props.mensagemId;
    this.salaId = props.salaId;
    this.remetenteId = props.remetenteId;
    this.conteudo = props.conteudo;
    this.enviadaEm = new Date(props.enviadaEm);
  }

  public static create(props: MensagemEnviadaEventProps): MensagemEnviadaEvent {
    if (props.mensagemId.trim().length === 0) {
      throw new Error("Evento de mensagem enviada exige um mensagemId válido.");
    }

    if (props.salaId.trim().length === 0) {
      throw new Error("Evento de mensagem enviada exige um salaId válido.");
    }

    if (props.remetenteId.trim().length === 0) {
      throw new Error("Evento de mensagem enviada exige um remetenteId válido.");
    }

    if (props.conteudo.trim().length === 0) {
      throw new Error("Evento de mensagem enviada exige conteúdo válido.");
    }

    if (Number.isNaN(props.enviadaEm.getTime())) {
      throw new Error("Evento de mensagem enviada exige uma data válida.");
    }

    return new MensagemEnviadaEvent(props);
  }
}
