export type ConectarUsuarioInputDTO = {
  usuarioId: string;
  connectionId: string;
};

export type ConectarUsuarioOutputDTO = {
  usuarioId: string;
  connectionId: string;
  status: "online";
  conectadoEm: string;
};
