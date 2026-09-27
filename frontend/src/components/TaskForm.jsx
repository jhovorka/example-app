import { useState } from "react";

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await onCreate({ title, description });
    setTitle("");
    setDescription("");
  }

  return (
    <form onSubmit={handleSubmit} className="card task-form">
      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Add task</button>
    </form>
  );
}
