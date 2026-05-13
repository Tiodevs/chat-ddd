import { describe, expect, it } from "vitest";

import { InMemoryPresencaRepository } from "./in-memory-presenca-repository.js";

describe("InMemoryPresencaRepository", () => {
  it("deve registrar conexões online por usuário", async () => {
    const repository = new InMemoryPresencaRepository();

    await repository.markOnline("usuario-1", "connection-1");
    await repository.markOnline("usuario-1", "connection-2");

    await expect(repository.isOnline("usuario-1")).resolves.toBe(true);
    await expect(repository.getConnectionsByUsuarioId("usuario-1")).resolves.toEqual(
      ["connection-1", "connection-2"],
    );
  });

  it("deve remover conexão e marcar offline quando não houver conexões", async () => {
    const repository = new InMemoryPresencaRepository();

    await repository.markOnline("usuario-1", "connection-1");
    await repository.markOffline("usuario-1", "connection-1");

    await expect(repository.isOnline("usuario-1")).resolves.toBe(false);
    await expect(repository.getConnectionsByUsuarioId("usuario-1")).resolves.toEqual(
      [],
    );
  });
});
