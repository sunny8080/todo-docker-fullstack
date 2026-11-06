import { Router } from 'express';
import mongoose from 'mongoose';
import Todo from '../models/Todo.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    res.json(await Todo.find().sort({ createdAt: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (!title) return res.status(400).json({ message: 'A todo title is required.' });
    res.status(201).json(await Todo.create({ title }));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid todo id.' });
    }
    
    const updates = {};
    if (typeof req.body.title === 'string') updates.title = req.body.title.trim();
    if (typeof req.body.completed === 'boolean') updates.completed = req.body.completed;
    if (updates.title === '') return res.status(400).json({ message: 'A todo title cannot be empty.' });
    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!todo) return res.status(404).json({ message: 'Todo not found.' });
    res.json(todo);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid todo id.' });
    }
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found.' });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
