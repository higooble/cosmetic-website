<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContentStore } from '../../stores/content';

const { locale, t } = useI18n();
const store = useContentStore();

const current  = ref(0);
let   timer    = null;

const banners = computed(() => store.banners);

function go(i) { current.value = (i + banners.value.length) % banners.value.length; }
function next() { go(current.value + 1); }
function prev() { go(current.value - 1); }

function startAuto() { timer = setInterval(next, 4500); }
function stopAuto()  { clearInterval(timer); }

onMounted(startAuto);
onUnmounted(stopAuto);

function title(b)    { return locale.value === 'th' ? b.title_th    : b.title_en; }
function subtitle(b) { return locale.value === 'th' ? b.subtitle_th : b.subtitle_en; }
</script>

<template>
  <section id="home" class="banner">
    <div v-if="banners.length" class="slides">
      <div
        v-for="(b, i) in banners"
        :key="b.id"
        :class="['slide', { active: i === current }]"
        :style="{ backgroundImage: `url(${b.image_url})` }"
      >
        <div class="overlay">
          <div class="slide-text">
            <h1>{{ title(b) }}</h1>
            <p v-if="subtitle(b)">{{ subtitle(b) }}</p>
            <a class="btn btn-primary" href="#products" @click.prevent="$el.closest('#home').nextElementSibling?.nextElementSibling?.scrollIntoView({ behavior:'smooth' })">
              {{ t('banner.shop_now') }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="banner-placeholder">
      <h1>Welcome to Cosmetic</h1>
    </div>

    <button v-if="banners.length > 1" class="arrow left"  @click="prev; stopAuto(); startAuto()">&#8249;</button>
    <button v-if="banners.length > 1" class="arrow right" @click="next; stopAuto(); startAuto()">&#8250;</button>

    <div v-if="banners.length > 1" class="dots">
      <button
        v-for="(_, i) in banners"
        :key="i"
        :class="['dot', { active: i === current }]"
        @click="go(i)"
      />
    </div>
  </section>
</template>

<style scoped>
.banner {
  position: relative;
  height: 100vh;
  min-height: 500px;
  overflow: hidden;
  padding: 0;
}
.slides, .slide { position: absolute; inset: 0; }
.slide {
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.8s ease;
}
.slide.active { opacity: 1; }
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(44,28,22,0.55) 0%, rgba(44,28,22,0.2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.slide-text { text-align: center; color: var(--white); padding: 1rem; }
.slide-text h1 { font-size: clamp(2rem, 6vw, 4rem); margin-bottom: 1rem; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
.slide-text p  { font-size: clamp(1rem, 2vw, 1.3rem); margin-bottom: 2rem; opacity: 0.9; }
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.5);
  color: var(--white);
  width: 48px; height: 48px;
  border-radius: 50%;
  font-size: 1.6rem;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.arrow:hover { background: rgba(255,255,255,0.35); }
.arrow.left  { left: 1.5rem; }
.arrow.right { right: 1.5rem; }
.dots {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}
.dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.dot.active { background: var(--white); transform: scale(1.3); }
.banner-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: var(--white);
}
</style>
