import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import type { z } from 'zod';
import type { todoCreateSchema, todoListSchema, todoUpdateSchema } from '../schemas/todo.schema.js';

type TodoCreate = z.infer<typeof todoCreateSchema>;
type TodoUpdate = z.infer<typeof todoUpdateSchema>;
type TodoList = z.infer<typeof todoListSchema>;

export const todoService = {
  list({ search, filter, sort }: TodoList) {
    const where: Prisma.TodoWhereInput = {};
    if (search) where.OR = [{ title: { contains: search } }, { description: { contains: search } }];
    if (filter === 'active') where.completed = false;
    if (filter === 'completed') where.completed = true;
    if (filter === 'high') where.priority = 'HIGH';

    if (sort === 'priority' || sort === 'dueDate') {
      return prisma.todo.findMany({ where, orderBy: { createdAt: 'desc' } }).then((todos) => {
        if (sort === 'priority') {
          const rank = { HIGH: 0, MEDIUM: 1, LOW: 2 };
          return todos.sort((a, b) => rank[a.priority] - rank[b.priority] || b.createdAt.getTime() - a.createdAt.getTime());
        }
        return todos.sort((a, b) => {
          if (!a.dueDate) return b.dueDate ? 1 : 0;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        });
      });
    }

    const orderBy: Prisma.TodoOrderByWithRelationInput = sort === 'oldest'
      ? { createdAt: 'asc' }
      : { createdAt: 'desc' };

    return prisma.todo.findMany({ where, orderBy });
  },
  get(id: string) {
    return prisma.todo.findUniqueOrThrow({ where: { id } });
  },
  create(data: TodoCreate) {
    return prisma.todo.create({ data: { ...data, priority: data.priority ?? 'MEDIUM' } });
  },
  update(id: string, data: TodoUpdate) {
    return prisma.todo.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.todo.delete({ where: { id } });
  },
};