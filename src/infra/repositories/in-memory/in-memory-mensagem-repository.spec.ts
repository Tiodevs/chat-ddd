import { describe, expect, it } from "vitest";

import { Mensagem } from "../../../domain/entities/mensagem.js";
import { ConteudoDaMensagem } from "../../../domain/value-objects/conteudo-da-mensagem.js";
import { InMemoryMensagemRepository } from "./in-memory-mensagem-repository.js";

function createMensagem(id: string, salaId: string, enviadaEm: string): Mensagem {
  return Mensagem.create({
    id,
    salaId,
    remetenteId: "usuario-1",
    conteudo: ConteudoDaMensagem.create(`Mensagem ${id}`),
    enviadaEm: new Date(enviadaEm),
  });
}

describe("InMemoryMensagemRepository", () => {
  it("deve salvar e listar mensagens paginadas por sala", async () => {
    const repository = new InMemoryMensagemRepository();

    await repository.save(
      createMensagem("mensagem-1", "sala-1", "2026-05-12T03:00:00.000Z"),
    );
    await repository.save(
      createMensagem("mensagem-2", "sala-1", "2026-05-12T03:01:00.000Z"),
    );
    await repository.save(
      createMensagem("mensagem-3", "sala-2", "2026-05-12T03:02:00.000Z"),
    );

    const mensagens = await repository.findBySalaId("sala-1", {
      page: 1,
      perPage: 1,
    });

    expect(mensagens.map((mensagem) => mensagem.id)).toEqual(["mensagem-1"]);
  });

  it("deve buscar mensagens recentes de uma sala", async () => {
    const repository = new InMemoryMensagemRepository();

    await repository.save(
      createMensagem("mensagem-1", "sala-1", "2026-05-12T03:00:00.000Z"),
    );
    await repository.save(
      createMensagem("mensagem-2", "sala-1", "2026-05-12T03:01:00.000Z"),
    );
    await repository.save(
      createMensagem("mensagem-3", "sala-1", "2026-05-12T03:02:00.000Z"),
    );

    const mensagens = await repository.findRecentBySalaId("sala-1", 2);

    expect(mensagens.map((mensagem) => mensagem.id)).toEqual([
      "mensagem-3",
      "mensagem-2",
    ]);
  });
});
