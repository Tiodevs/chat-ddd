export type ParticipanteDaSalaProps = {
  usuarioId: string;
  salaId: string;
  entrouEm: Date;
};

export type CriarParticipanteDaSalaProps = {
  usuarioId: string;
  salaId: string;
  entrouEm?: Date;
};

export type RestaurarParticipanteDaSalaProps = ParticipanteDaSalaProps;

export class ParticipanteDaSala {
  private constructor(private readonly props: ParticipanteDaSalaProps) {
    this.props.entrouEm = new Date(props.entrouEm);
    this.validate();
  }

  public static create(
    props: CriarParticipanteDaSalaProps,
  ): ParticipanteDaSala {
    return new ParticipanteDaSala({
      usuarioId: props.usuarioId,
      salaId: props.salaId,
      entrouEm: props.entrouEm ?? new Date(),
    });
  }

  public static restore(
    props: RestaurarParticipanteDaSalaProps,
  ): ParticipanteDaSala {
    return new ParticipanteDaSala(props);
  }

  public get usuarioId(): string {
    return this.props.usuarioId;
  }

  public get salaId(): string {
    return this.props.salaId;
  }

  public get entrouEm(): Date {
    return new Date(this.props.entrouEm);
  }

  public equals(participante: ParticipanteDaSala): boolean {
    return (
      this.usuarioId === participante.usuarioId &&
      this.salaId === participante.salaId
    );
  }

  private validate(): void {
    if (this.props.usuarioId.trim().length === 0) {
      throw new Error("Participante da sala exige um usuarioId válido.");
    }

    if (this.props.salaId.trim().length === 0) {
      throw new Error("Participante da sala exige um salaId válido.");
    }

    if (Number.isNaN(this.props.entrouEm.getTime())) {
      throw new Error("Participante da sala exige uma data de entrada válida.");
    }
  }
}
