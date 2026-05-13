import express, {
  type ErrorRequestHandler,
  type Express,
  type RequestHandler,
} from "express";

import type { ConectarUsuarioUseCase } from "../../application/use-cases/conectar-usuario/conectar-usuario-use-case.js";
import type { CriarSalaDeChatUseCase } from "../../application/use-cases/criar-sala-de-chat/criar-sala-de-chat-use-case.js";
import type { EnviarMensagemUseCase } from "../../application/use-cases/enviar-mensagem/enviar-mensagem-use-case.js";
import type { ListarMensagensDaSalaUseCase } from "../../application/use-cases/listar-mensagens-da-sala/listar-mensagens-da-sala-use-case.js";
import { mapErrorToHttp } from "./http-error.js";
import {
  getOptionalPositiveInteger,
  getRequiredString,
} from "./http-request.js";

export type HttpAppDependencies = {
  criarSalaDeChatUseCase: CriarSalaDeChatUseCase;
  enviarMensagemUseCase: EnviarMensagemUseCase;
  listarMensagensDaSalaUseCase: ListarMensagensDaSalaUseCase;
  conectarUsuarioUseCase: ConectarUsuarioUseCase;
};

export function createHttpApp(dependencies: HttpAppDependencies): Express {
  const app = express();

  app.use(express.json());

  app.get("/healthcheck", (_request, response) => {
    return response.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  app.post(
    "/salas",
    asyncHandler(async (request, response) => {
      const output = await dependencies.criarSalaDeChatUseCase.execute({
        nome: getRequiredString(request.body.nome, "nome"),
        criadorId: getRequiredString(request.body.criadorId, "criadorId"),
      });

      return response.status(201).json(output);
    }),
  );

  app.post(
    "/salas/:salaId/mensagens",
    asyncHandler(async (request, response) => {
      const output = await dependencies.enviarMensagemUseCase.execute({
        salaId: getRequiredString(request.params.salaId, "salaId"),
        remetenteId: getRequiredString(request.body.remetenteId, "remetenteId"),
        conteudo: getRequiredString(request.body.conteudo, "conteudo"),
      });

      return response.status(201).json(output);
    }),
  );

  app.get(
    "/salas/:salaId/mensagens",
    asyncHandler(async (request, response) => {
      const page = getOptionalPositiveInteger(request.query.page, "page");
      const perPage = getOptionalPositiveInteger(request.query.perPage, "perPage");
      const output = await dependencies.listarMensagensDaSalaUseCase.execute({
        salaId: getRequiredString(request.params.salaId, "salaId"),
        usuarioId: getRequiredString(request.query.usuarioId, "usuarioId"),
        ...(page ? { page } : {}),
        ...(perPage ? { perPage } : {}),
      });

      return response.status(200).json(output);
    }),
  );

  app.post(
    "/usuarios/:usuarioId/conectar",
    asyncHandler(async (request, response) => {
      const output = await dependencies.conectarUsuarioUseCase.execute({
        usuarioId: getRequiredString(request.params.usuarioId, "usuarioId"),
        connectionId: getRequiredString(request.body.connectionId, "connectionId"),
      });

      return response.status(200).json(output);
    }),
  );

  app.use(errorHandler);

  return app;
}

function asyncHandler(handler: RequestHandler): RequestHandler {
  return async (request, response, next) => {
    try {
      await handler(request, response, next);
    } catch (error) {
      next(error);
    }
  };
}

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const httpError = mapErrorToHttp(error);

  return response.status(httpError.statusCode).json({
    error: httpError.message,
  });
};
