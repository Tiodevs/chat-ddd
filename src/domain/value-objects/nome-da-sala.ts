export type NomeDaSalaProps = {
  valor: string;
};

export class NomeDaSala {
  public static readonly MIN_LENGTH = 2;
  public static readonly MAX_LENGTH = 100;

  private constructor(private readonly props: NomeDaSalaProps) {}

  public static create(valor: string): NomeDaSala {
    const nomeNormalizado = this.normalize(valor);

    this.validate(nomeNormalizado);

    return new NomeDaSala({ valor: nomeNormalizado });
  }

  public get valor(): string {
    return this.props.valor;
  }

  public equals(nomeDaSala: NomeDaSala): boolean {
    return this.valor === nomeDaSala.valor;
  }

  public toString(): string {
    return this.valor;
  }

  private static normalize(valor: string): string {
    return valor.trim().replace(/\s+/g, " ");
  }

  private static validate(valor: string): void {
    if (valor.length === 0) {
      throw new Error("Nome da sala não pode ser vazio.");
    }

    if (valor.length < this.MIN_LENGTH) {
      throw new Error(
        `Nome da sala deve ter pelo menos ${this.MIN_LENGTH} caracteres.`,
      );
    }

    if (valor.length > this.MAX_LENGTH) {
      throw new Error(
        `Nome da sala deve ter no máximo ${this.MAX_LENGTH} caracteres.`,
      );
    }
  }
}
