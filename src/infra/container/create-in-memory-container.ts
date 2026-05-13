import { ConectarUsuarioUseCase } from "../../application/use-cases/conectar-usuario/conectar-usuario-use-case.js";
import { CriarSalaDeChatUseCase } from "../../application/use-cases/criar-sala-de-chat/criar-sala-de-chat-use-case.js";
import { EnviarMensagemUseCase } from "../../application/use-cases/enviar-mensagem/enviar-mensagem-use-case.js";
import { ListarMensagensDaSalaUseCase } from "../../application/use-cases/listar-mensagens-da-sala/listar-mensagens-da-sala-use-case.js";
import { InMemoryDomainEventPublisher } from "../events/in-memory-domain-event-publisher.js";
import { NodeCryptoIdGenerator } from "../id/node-crypto-id-generator.js";
import { InMemoryMensagemRepository } from "../repositories/in-memory/in-memory-mensagem-repository.js";
import { InMemoryPresencaRepository } from "../repositories/in-memory/in-memory-presenca-repository.js";
import { InMemorySalaDeChatRepository } from "../repositories/in-memory/in-memory-sala-de-chat-repository.js";
import { InMemoryUsuarioRepository } from "../repositories/in-memory/in-memory-usuario-repository.js";

export type InMemoryContainer = ReturnType<typeof createInMemoryContainer>;

export function createInMemoryContainer() {
  const salaDeChatRepository = new InMemorySalaDeChatRepository();
  const mensagemRepository = new InMemoryMensagemRepository();
  const usuarioRepository = new InMemoryUsuarioRepository();
  const presencaRepository = new InMemoryPresencaRepository();
  const domainEventPublisher = new InMemoryDomainEventPublisher();
  const idGenerator = new NodeCryptoIdGenerator();

  return {
    repositories: {
      salaDeChatRepository,
      mensagemRepository,
      usuarioRepository,
      presencaRepository,
    },
    adapters: {
      domainEventPublisher,
      idGenerator,
    },
    useCases: {
      criarSalaDeChatUseCase: new CriarSalaDeChatUseCase({
        salaDeChatRepository,
        idGenerator,
      }),
      enviarMensagemUseCase: new EnviarMensagemUseCase({
        salaDeChatRepository,
        mensagemRepository,
        domainEventPublisher,
        idGenerator,
      }),
      listarMensagensDaSalaUseCase: new ListarMensagensDaSalaUseCase({
        salaDeChatRepository,
        mensagemRepository,
      }),
      conectarUsuarioUseCase: new ConectarUsuarioUseCase({
        usuarioRepository,
        presencaRepository,
        domainEventPublisher,
      }),
    },
  };
}
