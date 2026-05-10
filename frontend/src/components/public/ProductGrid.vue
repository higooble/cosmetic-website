<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContentStore } from '../../stores/content';

const { locale, t } = useI18n();
const store  = useContentStore();
const props  = defineProps({ selectedCategory: { default: null } });
const emit   = defineEmits(['open']);

const products = computed(() => {
  if (!props.selectedCategory) return store.products;
  return store.products.filter(p => p.category_id === props.selectedCategory);
});

function name(p)     { return locale.value === 'th' ? p.name_th : p.name_en; }
function primary(p)  { return p.images?.find(i => i.is_primary)?.image_url || p.images?.[0]?.image_url || '/placeholder.jpg'; }
</script>

<template>
  <section id="products">
    <div class="container">
      <h2 class="section-title">{{ t('products.title') }}</h2>
      <div v-if="products.length" class="grid">
        <div
          v-for="p in products"
          :key="p.id"
          class="card product-card"
          @click="emit('open', p)"
        >
          <div class="img-wrap">
            <img :src="primary(p)" :alt="name(p)" loading="lazy" />
          </div>
          <div class="info">
            <h3>{{ name(p) }}</h3>
            <p v-if="p.price" class="price">
              {{ t('products.thb') }} {{ Number(p.price).toLocaleString() }}
            </p>
            <span class="view-btn">{{ t('products.view_detail') }} →</span>
          </div>
        </div>
      </div>
      <p v-else class="empty">No products found.</p>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}
.product-card { cursor: pointer; }
.img-wrap {
  aspect-ratio: 1;
  overflow: hidden;
}
.img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.product-card:hover .img-wrap img { transform: scale(1.06); }
.info { padding: 1.25rem; }
.info h3 { font-size: 1rem; margin-bottom: 0.4rem; }
.price { color: var(--primary); font-weight: 600; font-size: 0.95rem; margin-bottom: 0.5rem; }
.view-btn { font-size: 0.8rem; color: var(--muted); font-weight: 500; }
.empty { text-align: center; color: var(--muted); padding: 3rem 0; }
</style>
