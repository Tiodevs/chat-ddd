export class HttpError extends Error {
  public constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export function mapErrorToHttp(error: unknown): HttpError {
  if (error instanceof HttpError) {
    return error;
  }

  if (!(error instanceof Error)) {
    return new HttpError(500, "Erro interno do servidor.");
  }

  if (error.message.includes("não encontrada") || error.message.includes("não encontrado")) {
    return new HttpError(404, error.message);
  }

  if (error.message.includes("Já existe")) {
    return new HttpError(409, error.message);
  }

  return new HttpError(400, error.message);
}
