export type NomeUsuarioProps = {
  valor: string;
};

export class NomeUsuario {
  public static readonly MIN_LENGTH = 2;
  public static readonly MAX_LENGTH = 80;

  private constructor(private readonly props: NomeUsuarioProps) {}

  public static create(valor: string): NomeUsuario {
    const nomeNormalizado = this.normalize(valor);

    this.validate(nomeNormalizado);

    return new NomeUsuario({ valor: nomeNormalizado });
  }

  public get valor(): string {
    return this.props.valor;
  }

  public equals(nomeUsuario: NomeUsuario): boolean {
    return this.valor === nomeUsuario.valor;
  }

  public toString(): string {
    return this.valor;
  }

  private static normalize(valor: string): string {
    return valor.trim().replace(/\s+/g, " ");
  }

  private static validate(valor: string): void {
    if (valor.length === 0) {
      throw new Error("Nome do usuário não pode ser vazio.");
    }

    if (valor.length < this.MIN_LENGTH) {
      throw new Error(
        `Nome do usuário deve ter pelo menos ${this.MIN_LENGTH} caracteres.`,
      );
    }

    if (valor.length > this.MAX_LENGTH) {
      throw new Error(
        `Nome do usuário deve ter no máximo ${this.MAX_LENGTH} caracteres.`,
      );
    }
  }
}
