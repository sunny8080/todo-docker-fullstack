import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Todo } from '../App';
import TodoItem from './TodoItem';

const todo: Todo = {
  _id: 'todo-1',
  title: 'Buy groceries',
  completed: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('TodoItem', () => {
  it('renders the todo title and active controls', () => {
    render(<TodoItem todo={todo} toggleTodo={vi.fn()} deleteTodo={vi.fn()} />);

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mark as completed' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete Buy groceries' })).toBeInTheDocument();
    expect(screen.getByRole('listitem')).not.toHaveClass('done');
  });

  it('renders completed styling and the active toggle label', () => {
    render(<TodoItem todo={{ ...todo, completed: true }} toggleTodo={vi.fn()} deleteTodo={vi.fn()} />);

    expect(screen.getByRole('listitem')).toHaveClass('done');
    expect(screen.getByRole('button', { name: 'Mark as active' })).toHaveTextContent('✓');
  });

  it('passes the todo to toggleTodo when the check button is clicked', () => {
    const toggleTodo = vi.fn();
    render(<TodoItem todo={todo} toggleTodo={toggleTodo} deleteTodo={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Mark as completed' }));

    expect(toggleTodo).toHaveBeenCalledOnce();
    expect(toggleTodo).toHaveBeenCalledWith(todo);
  });

  it('passes the todo id to deleteTodo when the delete button is clicked', () => {
    const deleteTodo = vi.fn();
    render(<TodoItem todo={todo} toggleTodo={vi.fn()} deleteTodo={deleteTodo} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete Buy groceries' }));

    expect(deleteTodo).toHaveBeenCalledOnce();
    expect(deleteTodo).toHaveBeenCalledWith('todo-1');
  });
});
