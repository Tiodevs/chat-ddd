export type CriarSalaDeChatInputDTO = {
  nome: string;
  criadorId: string;
};

export type CriarSalaDeChatOutputDTO = {
  id: string;
  nome: string;
  participantesIds: string[];
  criadaEm: string;
};
