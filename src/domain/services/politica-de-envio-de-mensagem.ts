import { SalaDeChat } from "../entities/sala-de-chat.js";

// Hoje essa política apenas delega para a sala, mas ela existe como ponto de
// extensão para regras futuras que envolvam mais de um conceito do domínio.
export class PoliticaDeEnvioDeMensagem {
  public static validar(sala: SalaDeChat, usuarioId: string): void {
    if (!sala.podeEnviarMensagem(usuarioId)) {
      throw new Error("Apenas participantes da sala podem enviar mensagens.");
    }
  }
}
