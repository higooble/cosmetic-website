import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', component: () => import('../views/PublicHome.vue') },
  {
    path: '/admin/login',
    component: () => import('../views/admin/LoginView.vue'),
  },
  {
    path: '/admin',
    component: () => import('../views/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/admin/banners' },
      { path: 'banners',    component: () => import('../components/admin/BannerManager.vue') },
      { path: 'categories', component: () => import('../components/admin/CategoryManager.vue') },
      { path: 'products',   component: () => import('../components/admin/ProductManager.vue') },
      { path: 'contacts',   component: () => import('../components/admin/ContactViewer.vue') },
      { path: 'settings',   component: () => import('../components/admin/SiteSettings.vue') },
    ],
  },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach(to => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/admin/login';
});

export default router;
