import type { Request, Response } from 'express';
import { noteCreateSchema, noteIdSchema, noteListSchema, noteUpdateSchema } from '../schemas/note.schema.js';
import { noteService } from '../services/note.service.js';

export const noteController = {
  async list(req: Request, res: Response) {
    const query = noteListSchema.parse(req.query);
    res.json({ success: true, data: await noteService.list(query) });
  },
  async get(req: Request, res: Response) {
    const id = noteIdSchema.parse(req.params.id);
    res.json({ success: true, data: await noteService.get(id) });
  },
  async create(req: Request, res: Response) {
    const data = noteCreateSchema.parse(req.body);
    res.status(201).json({ success: true, data: await noteService.create(data) });
  },
  async update(req: Request, res: Response) {
    const id = noteIdSchema.parse(req.params.id);
    const data = noteUpdateSchema.parse(req.body);
    res.json({ success: true, data: await noteService.update(id, data) });
  },
  async delete(req: Request, res: Response) {
    const id = noteIdSchema.parse(req.params.id);
    await noteService.delete(id);
    res.json({ success: true, data: { id } });
  },
};