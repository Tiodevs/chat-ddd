import { describe, expect, it } from "vitest";

import { Usuario } from "../../../domain/entities/usuario.js";
import { NomeUsuario } from "../../../domain/value-objects/nome-usuario.js";
import { STATUS_USUARIO } from "../../../domain/value-objects/status-usuario.js";
import { InMemoryUsuarioRepository } from "./in-memory-usuario-repository.js";

describe("InMemoryUsuarioRepository", () => {
  it("deve salvar e buscar usuário por id", async () => {
    const repository = new InMemoryUsuarioRepository();
    const usuario = Usuario.create({
      id: "usuario-1",
      nome: NomeUsuario.create("Fulano"),
    });

    await repository.save(usuario);

    await expect(repository.findById("usuario-1")).resolves.toBe(usuario);
    await expect(repository.findById("usuario-inexistente")).resolves.toBeNull();
  });

  it("deve atualizar status do usuário", async () => {
    const repository = new InMemoryUsuarioRepository();
    const usuario = Usuario.create({
      id: "usuario-1",
      nome: NomeUsuario.create("Fulano"),
    });

    await repository.save(usuario);
    await repository.updateStatus("usuario-1", STATUS_USUARIO.ONLINE);

    expect(usuario.status).toBe("online");
  });
});
