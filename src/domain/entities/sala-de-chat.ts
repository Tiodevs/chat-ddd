import { MensagemEnviadaEvent } from "../events/mensagem-enviada-event.js";
import { ConteudoDaMensagem } from "../value-objects/conteudo-da-mensagem.js";
import { NomeDaSala } from "../value-objects/nome-da-sala.js";
import { Mensagem } from "./mensagem.js";
import { ParticipanteDaSala } from "./participante-da-sala.js";

export type SalaDeChatProps = {
  id: string;
  nome: NomeDaSala;
  participantes: ParticipanteDaSala[];
  criadaEm: Date;
};

export type CriarSalaDeChatProps = {
  id: string;
  nome: NomeDaSala;
  criadorId: string;
  criadaEm?: Date;
};

export type RestaurarSalaDeChatProps = SalaDeChatProps;

export type EnviarMensagemProps = {
  mensagemId: string;
  remetenteId: string;
  conteudo: ConteudoDaMensagem;
  enviadaEm?: Date;
};

export type MensagemCriadaNaSala = {
  mensagem: Mensagem;
  event: MensagemEnviadaEvent;
};

export class SalaDeChat {
  private constructor(private readonly props: SalaDeChatProps) {
    this.props.criadaEm = new Date(props.criadaEm);
    this.validate();
  }

  public static create(props: CriarSalaDeChatProps): SalaDeChat {
    const criadaEm = props.criadaEm ?? new Date();

    return new SalaDeChat({
      id: props.id,
      nome: props.nome,
      participantes: [
        ParticipanteDaSala.create({
          usuarioId: props.criadorId,
          salaId: props.id,
          entrouEm: criadaEm,
        }),
      ],
      criadaEm,
    });
  }

  public static restore(props: RestaurarSalaDeChatProps): SalaDeChat {
    return new SalaDeChat(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get nome(): NomeDaSala {
    return this.props.nome;
  }

  public get participantes(): ParticipanteDaSala[] {
    return [...this.props.participantes];
  }

  public get criadaEm(): Date {
    return new Date(this.props.criadaEm);
  }

  public adicionarParticipante(usuarioId: string, entrouEm = new Date()): void {
    if (this.possuiParticipante(usuarioId)) {
      throw new Error("Usuário já participa da sala.");
    }

    this.props.participantes.push(
      ParticipanteDaSala.create({
        usuarioId,
        salaId: this.id,
        entrouEm,
      }),
    );
  }

  public possuiParticipante(usuarioId: string): boolean {
    return this.props.participantes.some(
      (participante) => participante.usuarioId === usuarioId,
    );
  }

  public podeEnviarMensagem(usuarioId: string): boolean {
    return this.possuiParticipante(usuarioId);
  }

  public enviarMensagem(props: EnviarMensagemProps): MensagemCriadaNaSala {
    if (!this.podeEnviarMensagem(props.remetenteId)) {
      throw new Error("Apenas participantes da sala podem enviar mensagens.");
    }

    const mensagemProps = {
      id: props.mensagemId,
      salaId: this.id,
      remetenteId: props.remetenteId,
      conteudo: props.conteudo,
      ...(props.enviadaEm ? { enviadaEm: props.enviadaEm } : {}),
    };

    const mensagem = Mensagem.create(mensagemProps);

    // O evento carrega um payload simples para infraestrutura publicar sem conhecer o modelo rico.
    const event = MensagemEnviadaEvent.create({
      mensagemId: mensagem.id,
      salaId: mensagem.salaId,
      remetenteId: mensagem.remetenteId,
      conteudo: mensagem.conteudo.valor,
      enviadaEm: mensagem.enviadaEm,
    });

    return { mensagem, event };
  }

  public equals(sala: SalaDeChat): boolean {
    return this.id === sala.id;
  }

  private validate(): void {
    if (this.props.id.trim().length === 0) {
      throw new Error("Sala de chat exige um id válido.");
    }

    if (Number.isNaN(this.props.criadaEm.getTime())) {
      throw new Error("Sala de chat exige uma data de criação válida.");
    }

    if (this.props.participantes.length === 0) {
      throw new Error("Sala de chat exige pelo menos um participante.");
    }

    this.ensureParticipantesPertencemASala();
    this.ensureParticipantesUnicos();
  }

  private ensureParticipantesPertencemASala(): void {
    const participanteDeOutraSala = this.props.participantes.some(
      (participante) => participante.salaId !== this.id,
    );

    if (participanteDeOutraSala) {
      throw new Error("Todos os participantes devem pertencer à sala.");
    }
  }

  private ensureParticipantesUnicos(): void {
    const participantesIds = this.props.participantes.map(
      (participante) => participante.usuarioId,
    );
    const participantesUnicos = new Set(participantesIds);

    if (participantesUnicos.size !== participantesIds.length) {
      throw new Error("Sala de chat não aceita participantes duplicados.");
    }
  }
}