import { describe, expect, it } from "vitest";

import { ConteudoDaMensagem } from "../value-objects/conteudo-da-mensagem.js";
import { NomeDaSala } from "../value-objects/nome-da-sala.js";
import { ParticipanteDaSala } from "./participante-da-sala.js";
import { SalaDeChat } from "./sala-de-chat.js";

describe("SalaDeChat", () => {
  it("deve criar uma sala com o criador como primeiro participante", () => {
    const criadaEm = new Date("2026-05-12T03:00:00.000Z");

    const sala = SalaDeChat.create({
      id: "sala-1",
      nome: NomeDaSala.create("Geral"),
      criadorId: "usuario-1",
      criadaEm,
    });

    expect(sala.id).toBe("sala-1");
    expect(sala.nome.valor).toBe("Geral");
    expect(sala.criadaEm).toEqual(criadaEm);
    expect(sala.participantes).toHaveLength(1);
    expect(sala.possuiParticipante("usuario-1")).toBe(true);
  });

  it("deve adicionar participante", () => {
    const sala = SalaDeChat.create({
      id: "sala-1",
      nome: NomeDaSala.create("Geral"),
      criadorId: "usuario-1",
    });

    sala.adicionarParticipante("usuario-2");

    expect(sala.possuiParticipante("usuario-2")).toBe(true);
    expect(sala.participantes).toHaveLength(2);
  });

  it("não deve aceitar participante duplicado", () => {
    const sala = SalaDeChat.create({
      id: "sala-1",
      nome: NomeDaSala.create("Geral"),
      criadorId: "usuario-1",
    });

    expect(() => sala.adicionarParticipante("usuario-1")).toThrow(
      "Usuário já participa da sala.",
    );
  });

  it("deve enviar mensagem quando o remetente participa da sala", () => {
    const enviadaEm = new Date("2026-05-12T03:00:00.000Z");
    const sala = SalaDeChat.create({
      id: "sala-1",
      nome: NomeDaSala.create("Geral"),
      criadorId: "usuario-1",
    });

    const resultado = sala.enviarMensagem({
      mensagemId: "mensagem-1",
      remetenteId: "usuario-1",
      conteudo: ConteudoDaMensagem.create("Olá"),
      enviadaEm,
    });

    expect(resultado.mensagem.id).toBe("mensagem-1");
    expect(resultado.mensagem.salaId).toBe("sala-1");
    expect(resultado.event.eventName).toBe("mensagem.enviada");
    expect(resultado.event.conteudo).toBe("Olá");
    expect(resultado.event.enviadaEm).toEqual(enviadaEm);
  });

  it("não deve enviar mensagem quando o remetente não participa da sala", () => {
    const sala = SalaDeChat.create({
      id: "sala-1",
      nome: NomeDaSala.create("Geral"),
      criadorId: "usuario-1",
    });

    expect(() =>
      sala.enviarMensagem({
        mensagemId: "mensagem-1",
        remetenteId: "usuario-2",
        conteudo: ConteudoDaMensagem.create("Olá"),
      }),
    ).toThrow("Apenas participantes da sala podem enviar mensagens.");
  });

  it("não deve restaurar sala com participante de outra sala", () => {
    expect(() =>
      SalaDeChat.restore({
        id: "sala-1",
        nome: NomeDaSala.create("Geral"),
        participantes: [
          ParticipanteDaSala.create({
            usuarioId: "usuario-1",
            salaId: "outra-sala",
          }),
        ],
        criadaEm: new Date("2026-05-12T03:00:00.000Z"),
      }),
    ).toThrow("Todos os participantes devem pertencer à sala.");
  });
});
