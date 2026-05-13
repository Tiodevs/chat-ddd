import type { PresencaRepository } from "../../../domain/repositories/presenca-repository.js";
import type { UsuarioRepository } from "../../../domain/repositories/usuario-repository.js";
import { STATUS_USUARIO } from "../../../domain/value-objects/status-usuario.js";
import type { DomainEventPublisher } from "../../ports/domain-event-publisher.js";
import type {
  ConectarUsuarioInputDTO,
  ConectarUsuarioOutputDTO,
} from "./conectar-usuario-dto.js";

export type ConectarUsuarioUseCaseDependencies = {
  usuarioRepository: UsuarioRepository;
  presencaRepository: PresencaRepository;
  domainEventPublisher: DomainEventPublisher;
};

export class ConectarUsuarioUseCase {
  public constructor(
    private readonly dependencies: ConectarUsuarioUseCaseDependencies,
  ) {}

  public async execute(
    input: ConectarUsuarioInputDTO,
  ): Promise<ConectarUsuarioOutputDTO> {
    const usuario = await this.dependencies.usuarioRepository.findById(
      input.usuarioId,
    );

    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    const event = usuario.conectar(input.connectionId);

    await this.dependencies.presencaRepository.markOnline(
      usuario.id,
      input.connectionId,
    );
    await this.dependencies.usuarioRepository.updateStatus(
      usuario.id,
      STATUS_USUARIO.ONLINE,
    );
    await this.dependencies.domainEventPublisher.publish(event);

    return {
      usuarioId: usuario.id,
      connectionId: input.connectionId,
      status: STATUS_USUARIO.ONLINE,
      conectadoEm: event.conectadoEm.toISOString(),
    };
  }
}
