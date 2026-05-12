export const STATUS_USUARIO = {
  ONLINE: "online",
  OFFLINE: "offline",
} as const;

export type StatusUsuario =
  (typeof STATUS_USUARIO)[keyof typeof STATUS_USUARIO];
