import { Router } from 'express';
import { noteController } from '../controllers/note.controller.js';

export const noteRouter = Router();
noteRouter.get('/', noteController.list);
noteRouter.get('/:id', noteController.get);
noteRouter.post('/', noteController.create);
noteRouter.patch('/:id', noteController.update);
noteRouter.delete('/:id', noteController.delete);