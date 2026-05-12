import { SalaDeChat } from "../entities/sala-de-chat.js";
import { NomeDaSala } from "../value-objects/nome-da-sala.js";

export interface SalaDeChatRepository {
  findById(salaId: string): Promise<SalaDeChat | null>;
  save(sala: SalaDeChat): Promise<void>;
  existsByName(nome: NomeDaSala): Promise<boolean>;
}
