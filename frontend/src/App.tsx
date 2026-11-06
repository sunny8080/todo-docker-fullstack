import { useEffect, useMemo, useState, type SubmitEvent } from 'react';

type Todo = {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

type TodoFilter = 'all' | 'active' | 'completed';

const API_URL = import.meta.env.VITE_BED_URL || 'http://localhost:3000';

console.log(import.meta.env.VITE_BED_URL);

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? 'Request failed. Please try again.');
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    request<Todo[]>('/todos')
      .then(setTodos)
      .catch((error: unknown) => setError(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  const visibleTodos = useMemo(
    () =>
      todos.filter((todo) => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
      }),
    [todos, filter],
  );
  const remaining = todos.filter((todo) => !todo.completed).length;

  async function addTodo(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    setError('');
    try {
      const todo = await request<Todo>('/todos', {
        method: 'POST',
        body: JSON.stringify({ title }),
      });
      setTodos((current) => [todo, ...current]);
      setTitle('');
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    }
  }

  async function toggleTodo(todo: Todo) {
    setError('');
    try {
      const updated = await request<Todo>(`/todos/${todo._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !todo.completed }),
      });
      setTodos((current) => current.map((item) => (item._id === updated._id ? updated : item)));
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    }
  }

  async function deleteTodo(id: string) {
    setError('');
    try {
      await request(`/todos/${id}`, { method: 'DELETE' });
      setTodos((current) => current.filter((todo) => todo._id !== id));
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    }
  }

  return (
    <main className="page-shell">
      <section className="todo-panel" aria-labelledby="page-title">
        <header className="header">
          <div className="eyebrow">
            <span className="sun-mark">✳</span> YOUR PERSONAL SPACE
          </div>
          <h1 id="page-title">
            Make room
            <br />
            for <em>what matters.</em>
          </h1>
          <p className="intro">A little progress, one task at a time.</p>
        </header>

        <form className="add-form" onSubmit={addTodo}>
          <label className="sr-only" htmlFor="new-task">
            Add a task
          </label>
          <input id="new-task" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What needs doing?" maxLength={200} />
          <button type="submit" aria-label="Add task">
            +
          </button>
        </form>

        <div className="list-heading">
          <span>
            YOUR LIST <span className="count">{todos.length}</span>
          </span>
          <div className="filters" aria-label="Filter tasks">
            {(['all', 'active', 'completed'] as const).map((option) => (
              <button key={option} className={filter === option ? 'selected' : ''} onClick={() => setFilter(option)} type="button">
                {option}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="notice" role="alert">
            {error}
          </p>
        )}
        {loading ? (
          <p className="empty-state">Gathering your tasks…</p>
        ) : visibleTodos.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">✧</span>
            <p>{todos.length ? 'Nothing in this view.' : 'Your list is clear.'}</p>
            <small>{todos.length ? 'Try another filter.' : 'Add a task above to get started.'}</small>
          </div>
        ) : (
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <li className={`todo-item ${todo.completed ? 'done' : ''}`} key={todo._id}>
                <button className="check" type="button" aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'} onClick={() => toggleTodo(todo)}>
                  {todo.completed && '✓'}
                </button>
                <span className="todo-title">{todo.title}</span>
                <button className="delete" type="button" aria-label={`Delete ${todo.title}`} onClick={() => deleteTodo(todo._id)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer className="footer">
          <span>
            {remaining} {remaining === 1 ? 'thing' : 'things'} left to do
          </span>
          <span>TAKE IT ONE STEP AT A TIME</span>
        </footer>
      </section>
      <div className="page-note">
        A softer way to get things done <span>·</span> TODAY, AT YOUR PACE
      </div>
    </main>
  );
}
