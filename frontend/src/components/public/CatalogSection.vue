<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContentStore } from '../../stores/content';

const { locale, t } = useI18n();
const store = useContentStore();

const emit = defineEmits(['filter']);

const categories = computed(() => store.categories);
const selectedId  = defineModel('selected', { default: null });

function catName(c) { return locale.value === 'th' ? c.name_th : c.name_en; }

function select(id) {
  selectedId.value = id;
  emit('filter', id);
}
</script>

<template>
  <section id="catalog">
    <div class="container">
      <h2 class="section-title">{{ t('catalog.title') }}</h2>
      <div class="cat-grid">
        <button
          :class="['cat-pill', { active: selectedId === null }]"
          @click="select(null)"
        >
          {{ t('catalog.all') }}
        </button>
        <button
          v-for="c in categories"
          :key="c.id"
          :class="['cat-pill', { active: selectedId === c.id }]"
          @click="select(c.id)"
        >
          {{ catName(c) }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
section { padding: 4rem 0 2rem; }
.cat-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}
.cat-pill {
  padding: 0.6rem 1.5rem;
  border: 2px solid var(--border);
  border-radius: 50px;
  background: var(--white);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
}
.cat-pill:hover,
.cat-pill.active {
  border-color: var(--primary);
  background: var(--primary);
  color: var(--white);
}
</style>
