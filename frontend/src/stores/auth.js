import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token:    localStorage.getItem('admin_token') || null,
    username: localStorage.getItem('admin_username') || null,
  }),
  getters: {
    isLoggedIn: s => !!s.token,
  },
  actions: {
    async login(username, password) {
      const { data } = await api.post('/admin/login', { username, password });
      this.token    = data.token;
      this.username = data.username;
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_username', data.username);
    },
    logout() {
      this.token    = null;
      this.username = null;
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_username');
    },
  },
});
