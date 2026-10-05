import type { ErrorRequestHandler, RequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { HttpError } from '../lib/http-error.js';

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ success: false, error: { message: 'Route not found' } });
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ success: false, error: { message: error.issues[0]?.message ?? 'Invalid request' } });
    return;
  }
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ success: false, error: { message: error.message } });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    res.status(404).json({ success: false, error: { message: 'Resource not found' } });
    return;
  }
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ success: false, error: { message: 'Request body must be valid JSON' } });
    return;
  }
  console.error('Request failed:', error instanceof Error ? error.message : 'Unknown error');
  res.status(500).json({ success: false, error: { message: 'Something went wrong. Please try again.' } });
};