import type {
  MensagemRepository,
  Pagination,
} from "../../../domain/repositories/mensagem-repository.js";
import type { SalaDeChatRepository } from "../../../domain/repositories/sala-de-chat-repository.js";
import type {
  ListarMensagensDaSalaInputDTO,
  ListarMensagensDaSalaOutputDTO,
} from "./listar-mensagens-da-sala-dto.js";

export type ListarMensagensDaSalaUseCaseDependencies = {
  salaDeChatRepository: SalaDeChatRepository;
  mensagemRepository: MensagemRepository;
};

export class ListarMensagensDaSalaUseCase {
  public constructor(
    private readonly dependencies: ListarMensagensDaSalaUseCaseDependencies,
  ) {}

  public async execute(
    input: ListarMensagensDaSalaInputDTO,
  ): Promise<ListarMensagensDaSalaOutputDTO> {
    const sala = await this.dependencies.salaDeChatRepository.findById(
      input.salaId,
    );

    if (!sala) {
      throw new Error("Sala de chat não encontrada.");
    }

    if (!sala.possuiParticipante(input.usuarioId)) {
      throw new Error("Apenas participantes da sala podem listar mensagens.");
    }

    const pagination = this.normalizePagination(input);
    const mensagens = await this.dependencies.mensagemRepository.findBySalaId(
      input.salaId,
      pagination,
    );

    return {
      mensagens: mensagens.map((mensagem) => ({
        id: mensagem.id,
        salaId: mensagem.salaId,
        remetenteId: mensagem.remetenteId,
        conteudo: mensagem.conteudo.valor,
        enviadaEm: mensagem.enviadaEm.toISOString(),
      })),
      page: pagination.page,
      perPage: pagination.perPage,
    };
  }

  private normalizePagination(
    input: ListarMensagensDaSalaInputDTO,
  ): Pagination {
    const page = input.page ?? 1;
    const perPage = input.perPage ?? 20;

    if (page < 1) {
      throw new Error("Página deve ser maior ou igual a 1.");
    }

    if (perPage < 1 || perPage > 100) {
      throw new Error("Quantidade por página deve estar entre 1 e 100.");
    }

    return { page, perPage };
  }
}
