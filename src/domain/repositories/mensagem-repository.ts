import { Mensagem } from "../entities/mensagem.js";

export type Pagination = {
  page: number;
  perPage: number;
};

export interface MensagemRepository {
  save(mensagem: Mensagem): Promise<void>;
  findBySalaId(salaId: string, pagination: Pagination): Promise<Mensagem[]>;
  findRecentBySalaId(salaId: string, limit: number): Promise<Mensagem[]>;
}
