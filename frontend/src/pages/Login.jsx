import { useState } from "react";
import { login } from "../api.js";

export default function Login({ onSuccess, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Log in</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Log in</button>
      <p>
        No account?{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
          Register
        </a>
      </p>
    </form>
  );
}
