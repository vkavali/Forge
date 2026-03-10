export function setAuth(token: string, userId: string, email: string, name: string) {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userName', name);
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
}

export function getAuth() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  return { token, userId: localStorage.getItem('userId') || '', email: localStorage.getItem('userEmail') || '', name: localStorage.getItem('userName') || '' };
}
