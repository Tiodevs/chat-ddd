import { createInMemoryContainer } from "./infra/container/create-in-memory-container.js";
import { createHttpApp } from "./interface/http/http-app.js";

const container = createInMemoryContainer();
const app = createHttpApp(container.useCases);
const port = Number(process.env.PORT ?? 3333);

app.listen(port, () => {
  console.log(`HTTP server running on port ${port}`);
});
