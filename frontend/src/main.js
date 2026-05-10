import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import router from './router';
import App from './App.vue';
import './assets/styles/main.css';

import en from './locales/en.json';
import th from './locales/th.json';

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'th',
  fallbackLocale: 'en',
  messages: { en, th },
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.mount('#app');
