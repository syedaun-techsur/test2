export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item${task.completed ? ' completed' : ''}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, !task.completed)}
        aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />
      <span className="task-text">{task.text}</span>
      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task "${task.text}"`}
      >
        Delete
      </button>
    </li>
  )
}
