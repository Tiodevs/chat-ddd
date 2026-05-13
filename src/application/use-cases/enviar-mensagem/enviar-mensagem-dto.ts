export type EnviarMensagemInputDTO = {
  salaId: string;
  remetenteId: string;
  conteudo: string;
};

export type EnviarMensagemOutputDTO = {
  id: string;
  salaId: string;
  remetenteId: string;
  conteudo: string;
  enviadaEm: string;
};
