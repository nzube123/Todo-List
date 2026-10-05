import { app } from './app.js';
import { prisma } from './lib/prisma.js';

const port = Number(process.env.PORT ?? 5000);
const server = app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

const shutdown = () => {
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);