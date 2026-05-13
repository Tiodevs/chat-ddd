import type { MensagemEnviadaEvent } from "../../domain/events/mensagem-enviada-event.js";
import type { UsuarioConectadoEvent } from "../../domain/events/usuario-conectado-event.js";

export type DomainEvent = MensagemEnviadaEvent | UsuarioConectadoEvent;

export interface DomainEventPublisher {
  publish(event: DomainEvent): Promise<void>;
}
