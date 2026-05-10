<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContentStore } from '../../stores/content';

const { t, locale } = useI18n();
const content = useContentStore();
const year    = new Date().getFullYear();

const brandName    = computed(() => locale.value === 'th' ? (content.settings.company_name_th || 'Cosmetic') : (content.settings.company_name_en || 'Cosmetic'));
const footerText   = computed(() => locale.value === 'th' ? (content.settings.footer_text_th || t('footer.rights')) : (content.settings.footer_text_en || t('footer.rights')));
const facebookUrl  = computed(() => content.settings.facebook_url  || null);
const instagramUrl = computed(() => content.settings.instagram_url || null);
const tiktokUrl    = computed(() => content.settings.tiktok_url    || null);
const lineUrl      = computed(() => content.settings.line_oa_url   || null);
</script>

<template>
  <footer>
    <div class="container footer-inner">
      <div class="brand">✦ {{ brandName }}</div>
      <div class="socials">
        <a v-if="lineUrl" :href="lineUrl" target="_blank" rel="noopener" aria-label="LINE OA" class="line-icon">
          <svg width="20" height="20" viewBox="0 0 18 18" fill="currentColor">
            <path d="M9 0C4.03 0 0 3.355 0 7.5c0 2.83 1.855 5.32 4.65 6.73L4.08 18l4.32-2.31c.195.025.395.04.6.04C13.97 15.73 18 12.375 18 8.23 18 3.355 13.97 0 9 0z"/>
          </svg>
        </a>
        <a v-if="facebookUrl" :href="facebookUrl" target="_blank" rel="noopener" aria-label="Facebook">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073c0 6.025 4.388 11.022 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.79-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.095 24 18.098 24 12.073z"/>
          </svg>
        </a>
        <a v-if="instagramUrl" :href="instagramUrl" target="_blank" rel="noopener" aria-label="Instagram">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        </a>
        <a v-if="tiktokUrl" :href="tiktokUrl" target="_blank" rel="noopener" aria-label="TikTok">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.88a8.28 8.28 0 004.84 1.54V7c-.92 0-1.78-.32-2.27-.31z"/>
          </svg>
        </a>

        <!-- Fallback placeholders when no links set yet -->
        <template v-if="!facebookUrl && !instagramUrl && !tiktokUrl && !lineUrl">
          <a href="#" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073c0 6.025 4.388 11.022 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.79-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.095 24 18.098 24 12.073z"/>
            </svg>
          </a>
          <a href="#" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>
        </template>
      </div>
      <p class="copy">&copy; {{ year }} {{ brandName }}. {{ footerText }}</p>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background: var(--text);
  color: rgba(255,255,255,0.7);
  padding: 2.5rem 0;
}
.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}
.brand {
  font-family: var(--font-en);
  font-size: 1.4rem;
  color: var(--primary);
  font-weight: 700;
}
.socials { display: flex; gap: 1rem; }
.socials a {
  color: rgba(255,255,255,0.6);
  transition: color 0.2s;
}
.socials a:hover { color: var(--primary); }
.line-icon:hover { color: #00C300 !important; }
.copy { font-size: 0.82rem; }
</style>
