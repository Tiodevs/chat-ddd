# Documentação Inicial: Projeto Chat Real-time (DDD)

## 1. Visão Geral do Projeto

Um sistema de chat de mensagens simples que permite comunicação em tempo real entre usuários. O projeto servirá como prova de conceito para arquiteturas escaláveis, utilizando mensageria assíncrona e design orientado ao domínio.

### Stack Tecnológica

- Core: Node.js, Express e TypeScript
- Arquitetura: Domain-Driven Design (DDD) + Clean Architecture/Ports and Adapters
- Mensageria: RabbitMQ
- Tempo real: WebSockets
- Banco de dados: PostgreSQL
- Cache e presença online: Redis
- Testes: Vitest

## 2. Modelagem de Domínio

O domínio principal do sistema é o contexto de chat. Ele representa salas, usuários, mensagens e as regras que garantem que apenas participantes autorizados possam interagir dentro de uma conversa.

### 2.1. Entidades

Entidades possuem identidade própria e continuam sendo as mesmas ao longo do tempo, mesmo que seus atributos mudem.

#### SalaDeChat

Representa uma sala onde usuários podem trocar mensagens em tempo real.

No DDD, `SalaDeChat` aparece em dois lugares importantes:

- Como entidade, porque possui identidade própria (`id`) e ciclo de vida.
- Como raiz do agregado, porque protege as regras de participação e envio de mensagens.

**Atributos principais:**

- `id`: identificador único da sala.
- `nome`: nome da sala, modelado como `NomeDaSala`.
- `participantes`: lista de participantes vinculados à sala.
- `criadaEm`: data em que a sala foi criada.

**Responsabilidades:**

- Representar uma conversa entre usuários.
- Controlar quais usuários fazem parte da sala.
- Garantir que apenas participantes possam enviar mensagens.
- Criar mensagens válidas dentro do contexto da sala.

**Regras importantes:**

- Uma sala precisa ter um nome válido.
- Uma sala pode ter um ou mais participantes.
- Um usuário não deve ser adicionado duas vezes na mesma sala.
- O escopo inicial não terá exclusão de sala.

#### Usuario

Representa uma pessoa que pode participar de salas de chat, enviar mensagens e receber notificações em tempo real.

**Atributos principais:**

- `id`: identificador único do usuário.
- `nome`: nome visível do usuário, modelado como `NomeUsuario`.
- `status`: estado atual do usuário, como `online` ou `offline`.
- `criadoEm`: data em que o usuário foi criado.

**Responsabilidades:**

- Identificar quem está interagindo no sistema.
- Informar se o usuário está disponível para comunicação em tempo real.
- Servir como referência para participantes de salas e remetentes de mensagens.

**Regras importantes:**

- Um usuário precisa ter um identificador válido.
- O nome deve ser válido de acordo com o objeto de valor `NomeUsuario`.
- O status de presença não deve ser usado como fonte única de verdade para autorização, pois presença online é um detalhe operacional.
- O escopo inicial não terá exclusão de usuário.

#### Mensagem

Representa uma mensagem enviada por um usuário dentro de uma sala de chat.

**Atributos principais:**

- `id`: identificador único da mensagem.
- `salaId`: identificador da sala onde a mensagem foi enviada.
- `remetenteId`: identificador do usuário que enviou a mensagem.
- `conteudo`: texto da mensagem, modelado como objeto de valor.
- `enviadaEm`: data e hora do envio.

**Responsabilidades:**

- Registrar o conteúdo enviado.
- Preservar quem enviou a mensagem e em qual sala ela foi enviada.
- Manter o histórico de comunicação da sala.

**Regras importantes:**

- Uma mensagem sempre pertence a uma sala.
- Uma mensagem sempre possui um remetente.
- Uma mensagem não deve existir com conteúdo inválido.
- Depois de enviada, a mensagem deve ser tratada como imutável no fluxo inicial do projeto.

#### ParticipanteDaSala

Representa a participação de um usuário dentro de uma sala. Essa entidade ajuda a controlar quem pode enviar e receber mensagens naquela conversa.

**Atributos principais:**

- `usuarioId`: identificador do usuário participante.
- `salaId`: identificador da sala.
- `entrouEm`: data em que o usuário entrou na sala.

**Responsabilidades:**

- Indicar quais usuários pertencem a uma sala.
- Apoiar validações antes do envio de mensagens.
- Registrar quando o usuário passou a fazer parte da sala.

**Regras importantes:**

- Um mesmo usuário não deve ser adicionado duas vezes na mesma sala.
- Apenas participantes da sala podem enviar mensagens.
- O escopo inicial não diferencia permissões entre participantes.
- O escopo inicial não terá remoção de participantes.

### 2.2. Objetos de Valor

Objetos de valor não possuem identidade própria. Eles são definidos pelos seus atributos e são usados para proteger regras de consistência do domínio.

#### ConteudoDaMensagem

Representa o texto de uma mensagem.

**Atributos principais:**

- `valor`: texto normalizado da mensagem.

**Validações:**

- Não pode ser vazio.
- Não pode conter apenas espaços em branco.
- Deve respeitar um limite máximo de caracteres, por exemplo 500.
- Pode aplicar normalização simples, como remover espaços extras no início e no fim.

**Motivo para ser objeto de valor:**

O conteúdo da mensagem não precisa de identidade própria. O que importa é o valor textual e suas regras de validade.

#### NomeDaSala

Representa o nome público de uma sala de chat.

**Validações:**

- Não pode ser vazio.
- Deve possuir tamanho mínimo e máximo.
- Pode impedir caracteres inválidos, caso isso seja necessário para URLs, buscas ou exibição.

**Motivo para ser objeto de valor:**

Centraliza as regras de validade do nome da sala e evita que strings livres circulem pelo domínio.

#### NomeUsuario

Representa o nome público de um usuário.

**Validações:**

- Não pode ser vazio.
- Não pode conter apenas espaços em branco.
- Deve possuir tamanho mínimo e máximo.
- Pode aplicar normalização simples, como remover espaços extras no início e no fim.

**Motivo para ser objeto de valor:**

O nome do usuário possui regras próprias de validade e aparece em várias partes do sistema, como listagem de participantes, histórico de mensagens e notificações em tempo real. Modelar como objeto de valor evita duplicação de validações.

#### StatusUsuario

Representa o estado de presença de um usuário.

**Valores possíveis:**

- `online`
- `offline`

**Observação:**

Esse valor pode ser persistido no usuário, mas em sistemas real-time geralmente a presença online também depende de infraestrutura, como conexões WebSocket ativas e chaves no Redis.

### 2.3. Agregados

Agregados protegem regras de consistência. A regra principal é que objetos externos devem interagir com as entidades internas por meio da raiz do agregado.

#### SalaDeChat

`SalaDeChat` é uma entidade e também a raiz do agregado principal do sistema. Ela gerencia participantes e controla se uma mensagem pode ser enviada.

**Entidades dentro do agregado:**

- `SalaDeChat`: raiz do agregado.
- `ParticipanteDaSala`: entidade interna que representa usuários vinculados à sala.

**Referências externas:**

- `Usuario` é referenciado por `usuarioId`.
- `Mensagem` pode ser criada a partir da sala, mas pode ser persistida em repositório próprio para facilitar histórico e paginação.

**Atributos principais:**

- `id`: identificador único da sala.
- `nome`: nome da sala, modelado como `NomeDaSala`.
- `participantes`: lista de participantes da sala.
- `criadaEm`: data de criação da sala.

**Comportamentos principais:**

- `adicionarParticipante(usuarioId)`: adiciona um usuário à sala.
- `podeEnviarMensagem(usuarioId)`: verifica se o usuário pode enviar mensagem.
- `enviarMensagem(usuarioId, conteudo)`: valida o participante, cria a mensagem e gera um evento de domínio.

**Invariantes do agregado:**

- Apenas participantes podem enviar mensagens.
- Um usuário não pode participar da mesma sala mais de uma vez.
- Toda mensagem criada pela sala deve possuir remetente participante e conteúdo válido.
- O agregado não expõe operação de deletar sala ou remover participante no escopo inicial.

### 2.4. Serviços

Serviços representam operações importantes do domínio ou da aplicação que não pertencem naturalmente a uma única entidade.

#### Serviços de Domínio

Serviços de domínio contêm regras de negócio que envolvem múltiplos objetos do domínio.

##### PoliticaDeEnvioDeMensagem

Responsável por validar regras de envio que podem crescer além da entidade `SalaDeChat`.

**Exemplos de regras:**

- Verificar se o usuário é participante ativo.
- Verificar se a sala permite envio de mensagens naquele momento.
- Aplicar regras futuras, como limite de mensagens por intervalo, caso seja necessário.


#### Serviços de Aplicação

Serviços de aplicação orquestram casos de uso. Eles não devem concentrar regras de negócio complexas; sua função é buscar dados, chamar o domínio, persistir mudanças e publicar eventos.

##### EnviarMensagemUseCase

Fluxo principal:

1. Recebe `salaId`, `usuarioId` e texto da mensagem.
2. Busca a `SalaDeChat` pelo repositório.
3. Cria o `ConteudoDaMensagem`.
4. Chama `sala.enviarMensagem(usuarioId, conteudo)`.
5. Persiste a mensagem e alterações necessárias.
6. Publica o evento `MensagemEnviadaEvent`.

##### CriarSalaDeChatUseCase

Fluxo principal:

1. Recebe nome da sala e usuário criador.
2. Cria o objeto de valor `NomeDaSala`.
3. Cria a `SalaDeChat`.
4. Adiciona o criador como primeiro participante da sala.
5. Persiste a sala.

##### ListarMensagensDaSalaUseCase

Fluxo principal:

1. Recebe `salaId`, `usuarioId` e parâmetros de paginação.
2. Verifica se o usuário participa da sala.
3. Busca mensagens no repositório de mensagens.
4. Retorna o histórico paginado.

##### ConectarUsuarioUseCase

Fluxo principal:

1. Recebe `usuarioId` e dados da conexão WebSocket.
2. Registra a conexão ativa no mecanismo de presença.
3. Atualiza a presença do usuário quando necessário.
4. Emite evento de usuário conectado.

### 2.5. Repositórios

Repositórios são portas da camada de domínio ou aplicação para persistência. Eles devem ser definidos como interfaces e implementados na infraestrutura.

#### SalaDeChatRepository

Responsável por persistir e recuperar salas de chat.

**Métodos esperados:**

- `findById(salaId)`: busca uma sala pelo identificador.
- `save(sala)`: persiste uma sala nova ou atualiza uma existente.
- `existsByName(nome)`: verifica se já existe uma sala com o mesmo nome, caso nomes únicos sejam necessários.

**Observação:**

Esse repositório deve lidar com o agregado `SalaDeChat` completo, incluindo seus participantes.

No escopo inicial, não haverá método `delete`. Caso seja necessário encerrar uma sala futuramente, a preferência será modelar uma regra explícita, como arquivamento, em vez de apagar dados diretamente.

#### MensagemRepository

Responsável por persistir e consultar mensagens.

**Métodos esperados:**

- `save(mensagem)`: persiste uma mensagem enviada.
- `findBySalaId(salaId, pagination)`: lista mensagens de uma sala com paginação.
- `findRecentBySalaId(salaId, limit)`: busca mensagens recentes para carregamento inicial do chat.

**Observação:**

Mensagens tendem a crescer rapidamente em volume, por isso é útil separá-las da persistência principal da sala.

#### UsuarioRepository

Responsável por persistir e consultar usuários.

**Métodos esperados:**

- `findById(usuarioId)`: busca um usuário pelo identificador.
- `save(usuario)`: persiste um usuário.
- `updateStatus(usuarioId, status)`: atualiza o status do usuário.

**Observação:**

No escopo inicial, não haverá método `delete`. Usuários serão mantidos para preservar histórico de mensagens.

#### PresencaRepository

Responsável por controlar presença online e conexões ativas. Pode ser implementado usando Redis.

**Métodos esperados:**

- `markOnline(usuarioId, connectionId)`: registra uma conexão ativa.
- `markOffline(usuarioId, connectionId)`: remove uma conexão ativa.
- `isOnline(usuarioId)`: verifica se o usuário possui conexão ativa.
- `getConnectionsByUsuarioId(usuarioId)`: retorna conexões ativas do usuário.

**Observação:**

Esse repositório representa uma necessidade operacional do sistema real-time. Ele não substitui o `UsuarioRepository`, pois presença online pode mudar rapidamente e pode não seguir o mesmo ciclo de persistência transacional.

### 2.6. Eventos de Domínio

Eventos de domínio representam algo relevante que aconteceu no domínio e que outras partes do sistema podem reagir.

#### MensagemEnviadaEvent

Disparado quando a `SalaDeChat` aceita uma nova mensagem.

**Dados principais:**

- `mensagemId`
- `salaId`
- `remetenteId`
- `conteudo`
- `enviadaEm`

**Usos:**

- Publicar mensagem no RabbitMQ.
- Notificar clientes conectados via WebSocket.
- Atualizar métricas ou logs.

#### UsuarioConectadoEvent

Disparado quando um usuário abre uma conexão WebSocket.

**Dados principais:**

- `usuarioId`
- `connectionId`
- `conectadoEm`

**Usos:**

- Atualizar presença online.
- Notificar outros usuários, se essa funcionalidade existir.

## 3. Arquitetura de Comunicação e Infraestrutura

Como as peças se conectam usando WebSockets e RabbitMQ.

### 3.1. Fluxo de Envio e Recebimento de Mensagem

1. O usuário digita uma mensagem e envia via API HTTP ou WebSocket.
2. A camada de aplicação executa o `EnviarMensagemUseCase`.
3. O caso de uso busca a `SalaDeChat`, valida o envio e cria a `Mensagem`.
4. O domínio gera o evento `MensagemEnviadaEvent`.
5. A infraestrutura publica o evento em uma exchange do RabbitMQ, por exemplo `chat.messages.exchange`.
6. Um consumer escuta a fila conectada à exchange.
7. O servidor WebSocket verifica quais usuários da sala estão conectados.
8. A mensagem é enviada para os clientes conectados em tempo real.


### 3.2. Vitest

O projeto deve usar Vitest para testes automatizados.

**Tipos de testes esperados:**

- Testes unitários para entidades, objetos de valor e serviços de domínio.
- Testes dos casos de uso da camada de aplicação.
- Testes de integração para repositórios e fluxos que dependem de PostgreSQL, Redis ou RabbitMQ.

**Prioridades iniciais de teste:**

- Validar `ConteudoDaMensagem`.
- Validar `NomeDaSala`.
- Validar `NomeUsuario`.
- Garantir que apenas participantes da sala possam enviar mensagens.
- Garantir que uma sala não aceite o mesmo participante duas vezes.