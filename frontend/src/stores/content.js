import { defineStore } from 'pinia';
import api from '../services/api';

export const useContentStore = defineStore('content', {
  state: () => ({
    banners:    [],
    categories: [],
    products:   [],
    settings:   {},
    loading:    false,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      const [b, c, p, s] = await Promise.all([
        api.get('/banners'),
        api.get('/categories'),
        api.get('/products'),
        api.get('/settings'),
      ]);
      this.banners    = b.data;
      this.categories = c.data;
      this.products   = p.data;
      this.settings   = s.data;
      this.loading    = false;
    },
    async fetchProducts(categoryId) {
      const params = categoryId ? { category_id: categoryId } : {};
      const { data } = await api.get('/products', { params });
      this.products = data;
    },
    async fetchSettings() {
      const { data } = await api.get('/settings');
      this.settings = data;
    },
  },
});
