const STATUSES = ["todo", "in_progress", "done"];

export default function TaskItem({ task, onStatusChange, onDelete }) {
  return (
    <li className={`task task-${task.status}`}>
      <div>
        <strong>{task.title}</strong>
        {task.description && <p>{task.description}</p>}
      </div>
      <div className="task-actions">
        <select value={task.status} onChange={(e) => onStatusChange(task.id, e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </li>
  );
}
