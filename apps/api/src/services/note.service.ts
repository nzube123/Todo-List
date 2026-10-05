import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import type { z } from 'zod';
import type { noteCreateSchema, noteListSchema, noteUpdateSchema } from '../schemas/note.schema.js';

type NoteCreate = z.infer<typeof noteCreateSchema>;
type NoteUpdate = z.infer<typeof noteUpdateSchema>;
type NoteList = z.infer<typeof noteListSchema>;

export const noteService = {
  list({ search }: NoteList) {
    const where: Prisma.NoteWhereInput = search
      ? { OR: [{ title: { contains: search } }, { content: { contains: search } }] }
      : {};
    return prisma.note.findMany({ where, orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }] });
  },
  get(id: string) {
    return prisma.note.findUniqueOrThrow({ where: { id } });
  },
  create(data: NoteCreate) {
    return prisma.note.create({ data });
  },
  update(id: string, data: NoteUpdate) {
    return prisma.note.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.note.delete({ where: { id } });
  },
};