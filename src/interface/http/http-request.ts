import { HttpError } from "./http-error.js";

export function getRequiredString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `Campo obrigatório inválido: ${fieldName}.`);
  }

  return value;
}

export function getOptionalPositiveInteger(
  value: unknown,
  fieldName: string,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new HttpError(400, `Campo deve ser um inteiro positivo: ${fieldName}.`);
  }

  return parsedValue;
}
