<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const auth   = useAuthStore();
const router = useRouter();

const form  = ref({ username: '', password: '' });
const error = ref('');
const busy  = ref(false);

async function login() {
  error.value = '';
  busy.value  = true;
  try {
    await auth.login(form.value.username, form.value.password);
    router.push('/admin');
  } catch {
    error.value = 'Invalid username or password';
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card card">
      <h1>✦ Admin</h1>
      <p class="sub">Cosmetic CMS</p>
      <form @submit.prevent="login">
        <div class="form-group">
          <label>Username</label>
          <input v-model="form.username" type="text" required autocomplete="username" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="form.password" type="password" required autocomplete="current-password" />
        </div>
        <p v-if="error" class="err">{{ error }}</p>
        <button type="submit" class="btn btn-primary w-full" :disabled="busy">
          {{ busy ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg), #f0e8e4);
}
.login-card {
  width: 100%;
  max-width: 380px;
  padding: 2.5rem;
  text-align: center;
}
h1 { font-size: 1.6rem; color: var(--primary); margin-bottom: 0.25rem; }
.sub { color: var(--muted); font-size: 0.9rem; margin-bottom: 2rem; }
.w-full { width: 100%; justify-content: center; }
.err { color: #C62828; font-size: 0.85rem; margin-bottom: 0.75rem; }
button:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
