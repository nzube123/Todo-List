import { z } from 'zod';

const optionalDate = z.union([z.string().trim().length(0), z.string().datetime({ offset: true }), z.string().date()]).optional().transform((value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('Invalid date');
  return date;
});

export const todoIdSchema = z.string().uuid('Invalid todo ID');
export const todoCreateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(160, 'Title must be 160 characters or fewer'),
  description: z.string().trim().max(2000, 'Description must be 2000 characters or fewer').optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: optionalDate,
}).strict();

export const todoUpdateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(160, 'Title must be 160 characters or fewer').optional(),
  description: z.string().trim().max(2000, 'Description must be 2000 characters or fewer').optional().nullable(),
  completed: z.boolean().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: optionalDate,
}).strict().refine((value) => Object.keys(value).length > 0, 'Provide at least one field to update');

export const todoListSchema = z.object({
  search: z.string().trim().max(120).optional(),
  filter: z.enum(['all', 'active', 'completed', 'high']).optional(),
  sort: z.enum(['newest', 'oldest', 'priority', 'dueDate']).optional(),
});