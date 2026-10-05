import type { Request, Response } from 'express';
import { todoCreateSchema, todoIdSchema, todoListSchema, todoUpdateSchema } from '../schemas/todo.schema.js';
import { todoService } from '../services/todo.service.js';

export const todoController = {
  async list(req: Request, res: Response) {
    const query = todoListSchema.parse(req.query);
    res.json({ success: true, data: await todoService.list(query) });
  },
  async get(req: Request, res: Response) {
    const id = todoIdSchema.parse(req.params.id);
    res.json({ success: true, data: await todoService.get(id) });
  },
  async create(req: Request, res: Response) {
    const data = todoCreateSchema.parse(req.body);
    res.status(201).json({ success: true, data: await todoService.create(data) });
  },
  async update(req: Request, res: Response) {
    const id = todoIdSchema.parse(req.params.id);
    const data = todoUpdateSchema.parse(req.body);
    res.json({ success: true, data: await todoService.update(id, data) });
  },
  async delete(req: Request, res: Response) {
    const id = todoIdSchema.parse(req.params.id);
    await todoService.delete(id);
    res.json({ success: true, data: { id } });
  },
};