<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '../../services/api';
import { useContentStore } from '../../stores/content';

const { t } = useI18n();
const content = useContentStore();
const lineUrl = computed(() => content.settings.line_oa_url || null);

const form    = ref({ name: '', email: '', phone: '', message: '' });
const status  = ref('');
const loading = ref(false);

async function submit() {
  if (!form.value.name || !form.value.message) return;
  loading.value = true;
  try {
    await api.post('/contact', form.value);
    status.value = 'success';
    form.value   = { name: '', email: '', phone: '', message: '' };
  } catch {
    status.value = 'error';
  } finally {
    loading.value = false;
    setTimeout(() => { status.value = ''; }, 4000);
  }
}
</script>

<template>
  <section id="contact">
    <div class="container">
      <h2 class="section-title">{{ t('contact.title') }}</h2>
      <div class="contact-wrap">
        <form class="form-card card" @submit.prevent="submit">
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('contact.name') }} *</label>
              <input v-model="form.name" type="text" required />
            </div>
          </div>
          <div class="form-row two">
            <div class="form-group">
              <label>{{ t('contact.email') }}</label>
              <input v-model="form.email" type="email" />
            </div>
            <div class="form-group">
              <label>{{ t('contact.phone') }}</label>
              <input v-model="form.phone" type="tel" />
            </div>
          </div>
          <div class="form-group">
            <label>{{ t('contact.message') }} *</label>
            <textarea v-model="form.message" required rows="5" />
          </div>

          <div v-if="status" :class="['alert', status]">
            {{ status === 'success' ? t('contact.success') : t('contact.error') }}
          </div>

          <div class="btn-row">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? '...' : t('contact.send') }}
            </button>
            <a
              v-if="lineUrl"
              :href="lineUrl"
              target="_blank"
              rel="noopener"
              class="btn btn-outline line-btn"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                <path d="M9 0C4.03 0 0 3.355 0 7.5c0 2.83 1.855 5.32 4.65 6.73L4.08 18l4.32-2.31c.195.025.395.04.6.04C13.97 15.73 18 12.375 18 8.23 18 3.355 13.97 0 9 0z"/>
              </svg>
              {{ t('contact.line') }}
            </a>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-wrap { max-width: 600px; margin: 0 auto; }
.form-card { padding: 2.5rem; }
.form-row.two { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.btn-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
.line-btn { background: #00C300; color: white; border-color: #00C300; }
.line-btn:hover { background: #00A300; border-color: #00A300; }
.alert {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.alert.success { background: #E8F5E9; color: #2E7D32; }
.alert.error   { background: #FFEBEE; color: #C62828; }
button:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 480px) {
  .form-row.two { grid-template-columns: 1fr; }
}
</style>
