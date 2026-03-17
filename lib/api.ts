


const BASE = "https://cmsback.sampaarsh.cloud";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });

  
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    
    let msg = `Request failed: ${res.statusText}`;
    try {
      const body = await res.json();
      msg = body.error || body.message || msg;
    } catch {
      
    }
    throw new Error(msg);
  }

  
  if (res.status === 204) return null;

  return res.json();
}
