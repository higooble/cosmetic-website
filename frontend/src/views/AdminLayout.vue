<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const auth   = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push('/admin/login');
}
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <h2>✦ Admin</h2>
      <nav>
        <RouterLink to="/admin/banners">    🖼 Banners</RouterLink>
        <RouterLink to="/admin/categories"> 🏷 Categories</RouterLink>
        <RouterLink to="/admin/products">   💄 Products</RouterLink>
        <RouterLink to="/admin/contacts">   📩 Contacts</RouterLink>
        <RouterLink to="/admin/settings">   ⚙️ Settings</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <span class="username">{{ auth.username }}</span>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </aside>
    <main class="admin-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.sidebar-footer {
  position: absolute;
  bottom: 1.5rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.admin-sidebar { position: relative; }
.username { font-size: 0.8rem; color: rgba(255,255,255,0.5); padding: 0 0.75rem; }
.logout-btn {
  background: rgba(201,150,122,0.2);
  border: 1px solid rgba(201,150,122,0.3);
  color: var(--primary);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}
.logout-btn:hover { background: rgba(201,150,122,0.35); }
</style>
