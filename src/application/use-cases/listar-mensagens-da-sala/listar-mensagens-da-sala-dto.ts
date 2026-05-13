export type ListarMensagensDaSalaInputDTO = {
  salaId: string;
  usuarioId: string;
  page?: number;
  perPage?: number;
};

export type MensagemDaSalaOutputDTO = {
  id: string;
  salaId: string;
  remetenteId: string;
  conteudo: string;
  enviadaEm: string;
};

export type ListarMensagensDaSalaOutputDTO = {
  mensagens: MensagemDaSalaOutputDTO[];
  page: number;
  perPage: number;
};
