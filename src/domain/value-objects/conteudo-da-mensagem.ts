export type ConteudoDaMensagemProps = {
  valor: string;
};

export class ConteudoDaMensagem {
  public static readonly MAX_LENGTH = 500;

  private constructor(private readonly props: ConteudoDaMensagemProps) {}

  public static create(valor: string): ConteudoDaMensagem {
    const conteudoNormalizado = this.normalize(valor);

    this.validate(conteudoNormalizado);

    return new ConteudoDaMensagem({ valor: conteudoNormalizado });
  }

  public get valor(): string {
    return this.props.valor;
  }

  public equals(conteudo: ConteudoDaMensagem): boolean {
    return this.valor === conteudo.valor;
  }

  public toString(): string {
    return this.valor;
  }

  private static normalize(valor: string): string {
    return valor.trim();
  }

  private static validate(valor: string): void {
    if (valor.length === 0) {
      throw new Error("Conteúdo da mensagem não pode ser vazio.");
    }

    if (valor.length > this.MAX_LENGTH) {
      throw new Error(
        `Conteúdo da mensagem deve ter no máximo ${this.MAX_LENGTH} caracteres.`,
      );
    }
  }
}
