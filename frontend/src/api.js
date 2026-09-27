const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function register(email, password) {
  return request("/auth/register", { method: "POST", body: { email, password }, auth: false });
}

export async function login(email, password) {
  const params = new URLSearchParams();
  params.set("username", email);
  params.set("password", password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || "Login failed");
  }

  const data = await res.json();
  localStorage.setItem("token", data.access_token);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function isAuthenticated() {
  return !!getToken();
}

export async function listTasks() {
  return request("/tasks");
}

export async function createTask(task) {
  return request("/tasks", { method: "POST", body: task });
}

export async function updateTask(id, patch) {
  return request(`/tasks/${id}`, { method: "PATCH", body: patch });
}

export async function deleteTask(id) {
  return request(`/tasks/${id}`, { method: "DELETE" });
}
