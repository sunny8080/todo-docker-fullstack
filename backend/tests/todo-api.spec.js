// @ts-check
import { test, expect } from '@playwright/test';

test.describe('POST /api/todos', () => {
  test('creates a todo and returns its default fields', async ({ request }) => {
    const title = `Create todo ${Date.now()}`;
    const response = await request.post('/api/todos', {
      data: { title },
    });

    expect(response.status()).toBe(201);
    const todo = await response.json();
    try {
      expect(todo).toMatchObject({ title, completed: false });
      expect(todo._id).toEqual(expect.any(String));
      expect(todo.createdAt).toEqual(expect.any(String));
      expect(todo.updatedAt).toEqual(expect.any(String));
    } finally {
      await request.delete(`/api/todos/${todo._id}`);
    }
  });

  test('trims whitespace from the todo title', async ({ request }) => {
    const response = await request.post('/api/todos', {
      data: { title: '  Buy groceries  ' },
    });

    expect(response.status()).toBe(201);
    const todo = await response.json();
    try {
      expect(todo.title).toBe('Buy groceries');
    } finally {
      await request.delete(`/api/todos/${todo._id}`);
    }
  });

  test('rejects an empty title', async ({ request }) => {
    const response = await request.post('/api/todos', {
      data: { title: '   ' },
    });

    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'A todo title is required.',
    });
  });

  test('rejects a missing title', async ({ request }) => {
    const response = await request.post('/api/todos', {
      data: {},
    });

    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'A todo title is required.',
    });
  });
});

test.describe('GET /api/todos', () => {
  test('returns a list of todos', async ({ request }) => {
    const response = await request.get('/api/todos');

    expect(response.status()).toBe(200);
    const todos = await response.json();
    expect(Array.isArray(todos)).toBe(true);
  });

  test('includes a todo after it is created', async ({ request }) => {
    const title = `Get todo ${Date.now()}`;
    const createResponse = await request.post('/api/todos', {
      data: { title },
    });
    expect(createResponse.status()).toBe(201);
    const createdTodo = await createResponse.json();

    const getResponse = await request.get('/api/todos');
    expect(getResponse.status()).toBe(200);
    const todos = await getResponse.json();

    try {
      expect(todos).toEqual(expect.arrayContaining([
        expect.objectContaining({ _id: createdTodo._id, title }),
      ]));
    } finally {
      await request.delete(`/api/todos/${createdTodo._id}`);
    }
  });
});
