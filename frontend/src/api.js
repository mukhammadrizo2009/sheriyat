// API client for Sheriyat platform

function getBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envUrl) {
    const formatted = envUrl.startsWith('http') ? envUrl : `https://${envUrl}`;
    return formatted.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Agar frontend alohida static site bo'lib (masalan sheriyat-frontend.onrender.com),
    // backend sheriyat-backend.onrender.com da joylashgan bo'lsa:
    if (hostname.includes('sheriyat-frontend')) {
      return `https://${hostname.replace('sheriyat-frontend', 'sheriyat-backend')}`;
    }

    // Agar ilova deploy qilingan bo'lsa (Django Reactni o'zi uzatayotgan bo'lsa yoki bitta domenda bo'lsa):
    // Nisbiy yo'l '' brauzerni avtomatik joriy domendagi /api ga yo'naltiradi.
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return '';
    }
  }

  // Mahalliy ishlab chiqish (Vite dev server /api ni Django port 8000 ga proxy qiladi)
  return '';
}

const BASE_URL = getBaseUrl();

export { BASE_URL };

// Visitor UUID saqlash (like larni aniqlash uchun)
export function getVisitorId() {
  let id = localStorage.getItem('sheriyat_visitor_id');
  if (!id) {
    id = 'visitor_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    localStorage.setItem('sheriyat_visitor_id', id);
  }
  return id;
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.detail || `Server xatosi: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      throw new Error("Serverga ulanib bo'lmadi. Server uyg'onmoqda (Render bepul rejim) yoki internet aloqasini tekshiring.");
    }
    throw err;
  }
}

// ---------------- KITOBXON (PUBLIC) API ----------------

export const api = {
  // Shoir profili
  getPoetProfile: () => request('/api/accounts/profile/'),

  // Kategoriyalar
  getCategories: () => request('/api/categories/'),

  // She'rlar va G'oyalar
  getPoems: (params = {}) => {
    const query = new URLSearchParams();
    if (params.type) query.append('type', params.type);
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.featured) query.append('featured', params.featured);
    const qs = query.toString();
    return request(`/api/poems/${qs ? `?${qs}` : ''}`);
  },

  getPoemDetail: (slug) => request(`/api/poems/${slug}/`),

  toggleLike: (slug) => {
    const identifier = getVisitorId();
    return request(`/api/poems/${slug}/like/`, {
      method: 'POST',
      body: JSON.stringify({ identifier })
    });
  },

  addComment: (slug, data) => request(`/api/poems/${slug}/comments/`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Shoir bilan bog'lanish (Telegram bot orqali yuborish)
  sendFeedback: (data) => request('/api/feedback/send/', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // ---------------- SHOIR ADMIN API ----------------

  login: (username, password) => request('/api/accounts/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),

  getDashboardStats: (token) => request('/api/admin/dashboard/', {
    headers: { Authorization: `Token ${token}` }
  }),

  getAdminPoems: (token) => request('/api/admin/poems/', {
    headers: { Authorization: `Token ${token}` }
  }),

  createPoem: (token, data) => request('/api/admin/poems/', {
    method: 'POST',
    headers: { Authorization: `Token ${token}` },
    body: JSON.stringify(data)
  }),

  updatePoem: (token, id, data) => request(`/api/admin/poems/${id}/`, {
    method: 'PATCH',
    headers: { Authorization: `Token ${token}` },
    body: JSON.stringify(data)
  }),

  deletePoem: (token, id) => request(`/api/admin/poems/${id}/`, {
    method: 'DELETE',
    headers: { Authorization: `Token ${token}` }
  }),

  getAdminComments: (token) => request('/api/admin/comments/', {
    headers: { Authorization: `Token ${token}` }
  }),

  toggleCommentApproval: (token, id, is_approved) => request(`/api/admin/comments/${id}/`, {
    method: 'PATCH',
    headers: { Authorization: `Token ${token}` },
    body: JSON.stringify({ is_approved })
  }),

  deleteComment: (token, id) => request(`/api/admin/comments/${id}/`, {
    method: 'DELETE',
    headers: { Authorization: `Token ${token}` }
  }),

  getAdminMessages: (token) => request('/api/feedback/admin/messages/', {
    headers: { Authorization: `Token ${token}` }
  }),

  markMessageRead: (token, id, is_read) => request(`/api/feedback/admin/messages/${id}/`, {
    method: 'PATCH',
    headers: { Authorization: `Token ${token}` },
    body: JSON.stringify({ is_read })
  }),

  deleteMessage: (token, id) => request(`/api/feedback/admin/messages/${id}/`, {
    method: 'DELETE',
    headers: { Authorization: `Token ${token}` }
  }),

  resendTelegramMessage: (token, id) => request(`/api/feedback/admin/messages/${id}/resend/`, {
    method: 'POST',
    headers: { Authorization: `Token ${token}` }
  }),

  updatePoetProfile: (token, data) => request('/api/accounts/profile/', {
    method: 'PUT',
    headers: { Authorization: `Token ${token}` },
    body: JSON.stringify(data)
  }),
};

