import { describe, expect, it } from "vitest";

import { MensagemEnviadaEvent } from "../../domain/events/mensagem-enviada-event.js";
import { InMemoryDomainEventPublisher } from "./in-memory-domain-event-publisher.js";

describe("InMemoryDomainEventPublisher", () => {
  it("deve armazenar eventos publicados", async () => {
    const publisher = new InMemoryDomainEventPublisher();
    const event = MensagemEnviadaEvent.create({
      mensagemId: "mensagem-1",
      salaId: "sala-1",
      remetenteId: "usuario-1",
      conteudo: "Olá",
      enviadaEm: new Date("2026-05-12T03:00:00.000Z"),
    });

    await publisher.publish(event);

    expect(publisher.all()).toEqual([event]);
  });

  it("deve limpar eventos publicados", async () => {
    const publisher = new InMemoryDomainEventPublisher();
    const event = MensagemEnviadaEvent.create({
      mensagemId: "mensagem-1",
      salaId: "sala-1",
      remetenteId: "usuario-1",
      conteudo: "Olá",
      enviadaEm: new Date("2026-05-12T03:00:00.000Z"),
    });

    await publisher.publish(event);
    publisher.clear();

    expect(publisher.all()).toEqual([]);
  });
});
