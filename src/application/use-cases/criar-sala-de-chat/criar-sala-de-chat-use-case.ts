import type { SalaDeChatRepository } from "../../../domain/repositories/sala-de-chat-repository.js";
import { SalaDeChat } from "../../../domain/entities/sala-de-chat.js";
import { NomeDaSala } from "../../../domain/value-objects/nome-da-sala.js";
import type { IdGenerator } from "../../ports/id-generator.js";
import type {
  CriarSalaDeChatInputDTO,
  CriarSalaDeChatOutputDTO,
} from "./criar-sala-de-chat-dto.js";

export type CriarSalaDeChatUseCaseDependencies = {
  salaDeChatRepository: SalaDeChatRepository;
  idGenerator: IdGenerator;
};

export class CriarSalaDeChatUseCase {
  public constructor(
    private readonly dependencies: CriarSalaDeChatUseCaseDependencies,
  ) {}

  public async execute(
    input: CriarSalaDeChatInputDTO,
  ): Promise<CriarSalaDeChatOutputDTO> {
    const nome = NomeDaSala.create(input.nome);
    const salaJaExiste = await this.dependencies.salaDeChatRepository.existsByName(
      nome,
    );

    if (salaJaExiste) {
      throw new Error("Já existe uma sala com esse nome.");
    }

    const sala = SalaDeChat.create({
      id: this.dependencies.idGenerator.generate(),
      nome,
      criadorId: input.criadorId,
    });

    await this.dependencies.salaDeChatRepository.save(sala);

    return {
      id: sala.id,
      nome: sala.nome.valor,
      participantesIds: sala.participantes.map(
        (participante) => participante.usuarioId,
      ),
      criadaEm: sala.criadaEm.toISOString(),
    };
  }
}
