import type { Todo } from '../App';

type Props = {
  todo: Todo;
  toggleTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
};

const TodoItem = ({ todo, toggleTodo, deleteTodo }: Props) => {
  return (
    <li className={`todo-item ${todo.completed ? 'done' : ''}`} key={todo._id}>
      <button className="check" type="button" aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'} onClick={() => toggleTodo(todo)}>
        {todo.completed && '✓'}
      </button>
      <span className="todo-title">{todo.title}</span>
      <button className="delete" type="button" aria-label={`Delete ${todo.title}`} onClick={() => deleteTodo(todo._id)}>
        ×
      </button>
    </li>
  );
};

export default TodoItem;
