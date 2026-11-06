import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import todosRouter from './routes/todos.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/todos', todosRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.name === 'ValidationError' ? 400 : 500).json({
    message: error.name === 'ValidationError' ? error.message : 'Something went wrong.',
  });
});

app.get('/', (req, res) => {
  res.send('Hello from todo fullstack app backend!!');
});

try {
  // connect mongodb database
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo_app');

  // listen to internal port PORT, also use 0.0.0.0 as host port
  app.listen(PORT, '0.0.0.0', () => console.log(`API listening on http://localhost:${PORT}`));
} catch (error) {
  console.error('Could not connect to MongoDB. Make sure the local MongoDB server is running.', error.message);
  process.exit(1);
}
