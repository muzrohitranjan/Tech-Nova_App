const API_BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: getToken() } : {}),
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
  return data;
}

export const api = {
  // Auth
  login: (email, password) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: (name, email, password) => apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  // User
  getMe: () => apiFetch('/users/me'),
  updateMe: (body) => apiFetch('/users/me', { method: 'PUT', body: JSON.stringify(body) }),

  // Recipes
  getRecipes: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/recipes${qs ? '?' + qs : ''}`);
  },
  getRecipe: (id) => apiFetch(`/recipes/${id}`),
  createRecipe: (body) => apiFetch('/recipes', { method: 'POST', body: JSON.stringify(body) }),
  updateRecipe: (id, body) => apiFetch(`/recipes/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteRecipe: (id) => apiFetch(`/recipes/${id}`, { method: 'DELETE' }),

  // Admin
  getAdminStats: () => apiFetch('/admin/stats'),
  getPendingRecipes: () => apiFetch('/admin/pending'),
};

