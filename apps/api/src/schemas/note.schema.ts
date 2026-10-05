import { z } from 'zod';

export const noteIdSchema = z.string().uuid('Invalid note ID');
export const noteCreateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(160, 'Title must be 160 characters or fewer'),
  content: z.string().trim().min(1, 'Content is required').max(12000, 'Content must be 12000 characters or fewer'),
}).strict();

export const noteUpdateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(160, 'Title must be 160 characters or fewer').optional(),
  content: z.string().trim().min(1, 'Content is required').max(12000, 'Content must be 12000 characters or fewer').optional(),
  pinned: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'Provide at least one field to update');

export const noteListSchema = z.object({
  search: z.string().trim().max(120).optional(),
});