import { createApp } from './app.js';
import { createDependencies }  from './config/deps.js';

const PORT = Number(process.env.PORT ?? 3000);

const deps = createDependencies();
const app = createApp(deps);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down server...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));