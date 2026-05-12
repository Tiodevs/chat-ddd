import { SalaDeChat } from "../entities/sala-de-chat.js";

export class PoliticaDeEnvioDeMensagem {
  public static validar(sala: SalaDeChat, usuarioId: string): void {
    if (!sala.podeEnviarMensagem(usuarioId)) {
      throw new Error("Apenas participantes da sala podem enviar mensagens.");
    }
  }
}
