import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3333);

app.use(express.json());

app.get("/healthcheck", (_request, response) => {
  return response.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`HTTP server running on port ${port}`);
});
