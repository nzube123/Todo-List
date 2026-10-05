import { Router } from 'express';
import { todoController } from '../controllers/todo.controller.js';

export const todoRouter = Router();
todoRouter.get('/', todoController.list);
todoRouter.get('/:id', todoController.get);
todoRouter.post('/', todoController.create);
todoRouter.patch('/:id', todoController.update);
todoRouter.delete('/:id', todoController.delete);