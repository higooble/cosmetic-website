import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('../../services/api', () => ({ default: { post: vi.fn() } }));
import api from '../../services/api';

// localStorage mock
const storage = {};
const localStorageMock = {
  getItem:    (k) => storage[k] ?? null,
  setItem:    (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear:      () => { Object.keys(storage).forEach(k => delete storage[k]); },
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

import { useAuthStore } from '../../stores/auth';

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('starts with no token', () => {
    const auth = useAuthStore();
    expect(auth.isLoggedIn).toBe(false);
    expect(auth.token).toBeNull();
  });

  it('sets token and username on login', async () => {
    api.post.mockResolvedValueOnce({ data: { token: 'abc123', username: 'admin' } });
    const auth = useAuthStore();
    await auth.login('admin', 'admin1234');
    expect(auth.token).toBe('abc123');
    expect(auth.username).toBe('admin');
    expect(auth.isLoggedIn).toBe(true);
  });

  it('saves token to localStorage on login', async () => {
    api.post.mockResolvedValueOnce({ data: { token: 'abc123', username: 'admin' } });
    const auth = useAuthStore();
    await auth.login('admin', 'admin1234');
    expect(localStorageMock.getItem('admin_token')).toBe('abc123');
  });

  it('clears token on logout', async () => {
    api.post.mockResolvedValueOnce({ data: { token: 'abc123', username: 'admin' } });
    const auth = useAuthStore();
    await auth.login('admin', 'admin1234');
    auth.logout();
    expect(auth.token).toBeNull();
    expect(auth.isLoggedIn).toBe(false);
    expect(localStorageMock.getItem('admin_token')).toBeNull();
  });

  it('throws on failed login', async () => {
    api.post.mockRejectedValueOnce(new Error('Invalid credentials'));
    const auth = useAuthStore();
    await expect(auth.login('admin', 'wrong')).rejects.toThrow('Invalid credentials');
    expect(auth.isLoggedIn).toBe(false);
  });
});
