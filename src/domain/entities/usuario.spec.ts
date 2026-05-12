import { describe, expect, it } from "vitest";

import { NomeUsuario } from "../value-objects/nome-usuario.js";
import { Usuario } from "./usuario.js";

describe("Usuario", () => {
  it("deve criar um usuário offline por padrão", () => {
    const nome = NomeUsuario.create("Fulano");
    const criadoEm = new Date("2026-05-12T03:00:00.000Z");

    const usuario = Usuario.create({
      id: "usuario-1",
      nome,
      criadoEm,
    });

    expect(usuario.id).toBe("usuario-1");
    expect(usuario.nome).toBe(nome);
    expect(usuario.status).toBe("offline");
    expect(usuario.criadoEm).toEqual(criadoEm);
  });

  it("deve restaurar um usuário existente", () => {
    const usuario = Usuario.restore({
      id: "usuario-1",
      nome: NomeUsuario.create("Fulano"),
      status: "online",
      criadoEm: new Date("2026-05-12T03:00:00.000Z"),
    });

    expect(usuario.status).toBe("online");
  });

  it("deve alterar o nome do usuário", () => {
    const usuario = Usuario.create({
      id: "usuario-1",
      nome: NomeUsuario.create("Fulano"),
    });

    const novoNome = NomeUsuario.create("Ciclano");

    usuario.alterarNome(novoNome);

    expect(usuario.nome).toBe(novoNome);
  });

  it("deve marcar usuário como online e gerar evento ao conectar", () => {
    const usuario = Usuario.create({
      id: "usuario-1",
      nome: NomeUsuario.create("Fulano"),
    });
    const conectadoEm = new Date("2026-05-12T03:00:00.000Z");

    const event = usuario.conectar("connection-1", conectadoEm);

    expect(usuario.status).toBe("online");
    expect(event.eventName).toBe("usuario.conectado");
    expect(event.usuarioId).toBe("usuario-1");
    expect(event.connectionId).toBe("connection-1");
    expect(event.conectadoEm).toEqual(conectadoEm);
  });

  it("deve marcar usuário como offline", () => {
    const usuario = Usuario.restore({
      id: "usuario-1",
      nome: NomeUsuario.create("Fulano"),
      status: "online",
      criadoEm: new Date("2026-05-12T03:00:00.000Z"),
    });

    usuario.marcarComoOffline();

    expect(usuario.status).toBe("offline");
  });

  it("deve comparar usuários pelo id", () => {
    const primeiroUsuario = Usuario.create({
      id: "usuario-1",
      nome: NomeUsuario.create("Fulano"),
    });
    const segundoUsuario = Usuario.restore({
      id: "usuario-1",
      nome: NomeUsuario.create("Outro Nome"),
      status: "online",
      criadoEm: new Date("2026-05-12T03:00:00.000Z"),
    });

    expect(primeiroUsuario.equals(segundoUsuario)).toBe(true);
  });

  it("deve proteger data de criação contra mutação externa", () => {
    const criadoEm = new Date("2026-05-12T03:00:00.000Z");
    const usuario = Usuario.create({
      id: "usuario-1",
      nome: NomeUsuario.create("Fulano"),
      criadoEm,
    });

    criadoEm.setFullYear(2030);

    expect(usuario.criadoEm).toEqual(new Date("2026-05-12T03:00:00.000Z"));
  });

  it("não deve aceitar id vazio", () => {
    expect(() =>
      Usuario.create({
        id: " ",
        nome: NomeUsuario.create("Fulano"),
      }),
    ).toThrow("Usuário exige um id válido.");
  });

  it("não deve aceitar data de criação inválida", () => {
    expect(() =>
      Usuario.create({
        id: "usuario-1",
        nome: NomeUsuario.create("Fulano"),
        criadoEm: new Date("data-invalida"),
      }),
    ).toThrow("Usuário exige uma data de criação válida.");
  });
});
