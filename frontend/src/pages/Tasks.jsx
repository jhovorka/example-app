import { useEffect, useState } from "react";
import { createTask, deleteTask, listTasks, updateTask } from "../api.js";
import TaskForm from "../components/TaskForm.jsx";
import TaskItem from "../components/TaskItem.jsx";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setTasks(await listTasks());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(task) {
    await createTask(task);
    load();
  }

  async function handleStatusChange(id, status) {
    await updateTask(id, { status });
    load();
  }

  async function handleDelete(id) {
    await deleteTask(id);
    load();
  }

  return (
    <main>
      {error && <p className="error">{error}</p>}
      <TaskForm onCreate={handleCreate} />
      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
      </ul>
      {tasks.length === 0 && <p className="empty">No tasks yet. Add your first one above.</p>}
    </main>
  );
}
