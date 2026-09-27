import { useState } from "react";
import { register } from "../api.js";

export default function Register({ onSuccess, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(email, password);
      setDone(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (done) {
    return (
      <div className="card">
        <h2>Account created</h2>
        <p>You can log in now.</p>
        <button onClick={onSuccess}>Go to login</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Register</h2>
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
      <button type="submit">Create account</button>
      <p>
        Already have an account?{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
          Log in
        </a>
      </p>
    </form>
  );
}
