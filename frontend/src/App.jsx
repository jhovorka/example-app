import { useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Tasks from "./pages/Tasks.jsx";
import { isAuthenticated, logout } from "./api.js";

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [view, setView] = useState("login");

  if (authed) {
    return (
      <div className="app">
        <header>
          <h1>TaskFlow</h1>
          <button
            onClick={() => {
              logout();
              setAuthed(false);
            }}
          >
            Log out
          </button>
        </header>
        <Tasks />
      </div>
    );
  }

  return (
    <div className="app auth-screen">
      <h1>TaskFlow</h1>
      {view === "login" ? (
        <Login onSuccess={() => setAuthed(true)} onSwitch={() => setView("register")} />
      ) : (
        <Register onSuccess={() => setView("login")} onSwitch={() => setView("login")} />
      )}
    </div>
  );
}
