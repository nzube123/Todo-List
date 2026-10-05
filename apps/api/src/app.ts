import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { noteRouter } from './routes/note.routes.js';
import { todoRouter } from './routes/todo.routes.js';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../../.env') });
process.env.DATABASE_URL ??= 'file:./dev.db';

export const app = express();
const allowedOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '32kb' }));
app.get('/api/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.use('/api/todos', todoRouter);
app.use('/api/notes', noteRouter);
app.use(notFoundHandler);
app.use(errorHandler);