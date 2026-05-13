import request from "supertest";
import { describe, expect, it } from "vitest";

import { Usuario } from "../../domain/entities/usuario.js";
import { NomeUsuario } from "../../domain/value-objects/nome-usuario.js";
import { createInMemoryContainer } from "../../infra/container/create-in-memory-container.js";
import { createHttpApp } from "./http-app.js";

describe("HTTP App", () => {
  it("deve responder healthcheck", async () => {
    const container = createInMemoryContainer();
    const app = createHttpApp(container.useCases);

    const response = await request(app).get("/healthcheck");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("deve criar sala, enviar mensagem e listar mensagens", async () => {
    const container = createInMemoryContainer();
    const app = createHttpApp(container.useCases);

    const criarSalaResponse = await request(app).post("/salas").send({
      nome: "Geral",
      criadorId: "usuario-1",
    });

    expect(criarSalaResponse.status).toBe(201);
    expect(criarSalaResponse.body.nome).toBe("Geral");

    const salaId = criarSalaResponse.body.id as string;

    const enviarMensagemResponse = await request(app)
      .post(`/salas/${salaId}/mensagens`)
      .send({
        remetenteId: "usuario-1",
        conteudo: "Olá mundo",
      });

    expect(enviarMensagemResponse.status).toBe(201);
    expect(enviarMensagemResponse.body.conteudo).toBe("Olá mundo");

    const listarMensagensResponse = await request(app)
      .get(`/salas/${salaId}/mensagens`)
      .query({ usuarioId: "usuario-1" });

    expect(listarMensagensResponse.status).toBe(200);
    expect(listarMensagensResponse.body.mensagens).toHaveLength(1);
    expect(listarMensagensResponse.body.mensagens[0].conteudo).toBe("Olá mundo");
  });

  it("deve conectar usuário existente", async () => {
    const container = createInMemoryContainer();
    const app = createHttpApp(container.useCases);

    await container.repositories.usuarioRepository.save(
      Usuario.create({
        id: "usuario-1",
        nome: NomeUsuario.create("Fulano"),
      }),
    );

    const response = await request(app)
      .post("/usuarios/usuario-1/conectar")
      .send({ connectionId: "connection-1" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      usuarioId: "usuario-1",
      connectionId: "connection-1",
      status: "online",
    });
  });

  it("deve retornar erro formatado quando campo obrigatório não for enviado", async () => {
    const container = createInMemoryContainer();
    const app = createHttpApp(container.useCases);

    const response = await request(app).post("/salas").send({
      criadorId: "usuario-1",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Campo obrigatório inválido: nome.");
  });
});
