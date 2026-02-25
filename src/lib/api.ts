'use client';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_ATLAS_BACKEND_URL || 'http://localhost:8000';

  // 1. Retrieve the token from local storage
  const token = typeof window !== 'undefined' ? localStorage.getItem('atlas_auth_token') : null;

  // 2. Set up standard headers
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...options.headers,
  });

  // 3. If a token exists, attach it to the Authorization header
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // 4. Make the actual network request
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  // 5. Global Security Catch: If the backend says the token is invalid/expired (401)
  if (response.status === 401 && typeof window !== 'undefined') {
    console.warn("Session expired. Redirecting to login.");
    localStorage.removeItem('atlas_auth_token');
    window.location.href = '/login';
    // Return a new promise that never resolves to prevent further processing in the component
    return new Promise(() => {});
  }

  return response;
};
