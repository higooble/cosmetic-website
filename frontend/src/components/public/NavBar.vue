<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContentStore } from '../../stores/content';

const { t, locale } = useI18n();
const content  = useContentStore();
const scrolled = ref(false);

const sections = ['home', 'catalog', 'products', 'contact'];

const brandName = computed(() =>
  locale.value === 'th'
    ? (content.settings.company_name_th || 'Cosmetic')
    : (content.settings.company_name_en || 'Cosmetic')
);

const logoUrl = computed(() => {
  const url = content.settings.logo_url;
  if (!url) return null;
  return url.startsWith('/') ? `http://localhost:3000${url}` : url;
});

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function toggleLang() {
  const next = locale.value === 'th' ? 'en' : 'th';
  locale.value = next;
  localStorage.setItem('lang', next);
}

function onScroll() { scrolled.value = window.scrollY > 60; }
onMounted(() => window.addEventListener('scroll', onScroll));
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
  <nav :class="['navbar', { scrolled }]">
    <div class="container nav-inner">
      <span class="brand">
        <img v-if="logoUrl" :src="logoUrl" :alt="brandName" class="logo-img" />
        <template v-else>✦ {{ brandName }}</template>
      </span>
      <ul class="nav-links">
        <li v-for="s in sections" :key="s">
          <a @click.prevent="scrollTo(s)" href="#">{{ t(`nav.${s}`) }}</a>
        </li>
      </ul>
      <button class="lang-btn" @click="toggleLang">
        {{ locale === 'th' ? 'EN' : 'TH' }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 900;
  padding: 1.25rem 0;
  transition: all 0.3s ease;
}
.navbar.scrolled {
  background: rgba(250, 247, 245, 0.96);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 20px rgba(201,150,122,0.12);
  padding: 0.85rem 0;
}
.nav-inner {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.brand {
  font-family: var(--font-en);
  font-size: 1.3rem;
  color: var(--primary);
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-right: auto;
  display: flex;
  align-items: center;
}
.logo-img {
  height: 40px;
  max-width: 160px;
  object-fit: contain;
}
.nav-links {
  list-style: none;
  display: flex;
  gap: 2rem;
}
.nav-links a {
  color: var(--text);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}
.nav-links a:hover { color: var(--primary); }
.lang-btn {
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 50px;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: opacity 0.2s;
}
.lang-btn:hover { opacity: 0.85; }

@media (max-width: 640px) {
  .nav-links { display: none; }
}
</style>
