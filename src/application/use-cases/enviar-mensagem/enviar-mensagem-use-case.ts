import { ConteudoDaMensagem } from "../../../domain/value-objects/conteudo-da-mensagem.js";
import type { MensagemRepository } from "../../../domain/repositories/mensagem-repository.js";
import type { SalaDeChatRepository } from "../../../domain/repositories/sala-de-chat-repository.js";
import type { DomainEventPublisher } from "../../ports/domain-event-publisher.js";
import type { IdGenerator } from "../../ports/id-generator.js";
import type {
  EnviarMensagemInputDTO,
  EnviarMensagemOutputDTO,
} from "./enviar-mensagem-dto.js";

export type EnviarMensagemUseCaseDependencies = {
  salaDeChatRepository: SalaDeChatRepository;
  mensagemRepository: MensagemRepository;
  domainEventPublisher: DomainEventPublisher;
  idGenerator: IdGenerator;
};

export class EnviarMensagemUseCase {
  public constructor(
    private readonly dependencies: EnviarMensagemUseCaseDependencies,
  ) {}

  public async execute(
    input: EnviarMensagemInputDTO,
  ): Promise<EnviarMensagemOutputDTO> {
    const sala = await this.dependencies.salaDeChatRepository.findById(
      input.salaId,
    );

    if (!sala) {
      throw new Error("Sala de chat não encontrada.");
    }

    const resultado = sala.enviarMensagem({
      mensagemId: this.dependencies.idGenerator.generate(),
      remetenteId: input.remetenteId,
      conteudo: ConteudoDaMensagem.create(input.conteudo),
    });

    await this.dependencies.mensagemRepository.save(resultado.mensagem);
    await this.dependencies.domainEventPublisher.publish(resultado.event);

    return {
      id: resultado.mensagem.id,
      salaId: resultado.mensagem.salaId,
      remetenteId: resultado.mensagem.remetenteId,
      conteudo: resultado.mensagem.conteudo.valor,
      enviadaEm: resultado.mensagem.enviadaEm.toISOString(),
    };
  }
}
