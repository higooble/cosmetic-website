<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n();
const props = defineProps({ product: Object });
const emit  = defineEmits(['close']);

const imgIndex = ref(0);
watch(() => props.product, () => { imgIndex.value = 0; });

const images = computed(() => props.product?.images || []);
const active  = computed(() => images.value[imgIndex.value]?.image_url || '/placeholder.jpg');

const name        = computed(() => locale.value === 'th' ? props.product?.name_th        : props.product?.name_en);
const description = computed(() => locale.value === 'th' ? props.product?.description_th : props.product?.description_en);
const ingredients = computed(() => locale.value === 'th' ? props.product?.ingredients_th : props.product?.ingredients_en);
const usage       = computed(() => locale.value === 'th' ? props.product?.usage_th       : props.product?.usage_en);

function prev() { imgIndex.value = (imgIndex.value - 1 + images.value.length) % images.value.length; }
function next() { imgIndex.value = (imgIndex.value + 1) % images.value.length; }
</script>

<template>
  <Teleport to="body">
    <div v-if="product" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-box product-modal">
        <button class="btn-close" @click="emit('close')">✕</button>

        <div class="modal-body">
          <!-- Image Gallery -->
          <div class="gallery">
            <div class="main-img">
              <img :src="active" :alt="name" />
              <button v-if="images.length > 1" class="arrow left"  @click="prev">&#8249;</button>
              <button v-if="images.length > 1" class="arrow right" @click="next">&#8250;</button>
            </div>
            <div v-if="images.length > 1" class="thumbs">
              <img
                v-for="(img, i) in images"
                :key="img.id"
                :src="img.image_url"
                :class="{ active: i === imgIndex }"
                @click="imgIndex = i"
              />
            </div>
          </div>

          <!-- Product Info -->
          <div class="detail">
            <h2>{{ name }}</h2>
            <p v-if="product.price" class="price">
              {{ t('products.thb') }} {{ Number(product.price).toLocaleString() }}
            </p>
            <p v-if="description" class="desc">{{ description }}</p>

            <div v-if="ingredients" class="section-block">
              <h4>{{ t('products.ingredients') }}</h4>
              <p>{{ ingredients }}</p>
            </div>

            <div v-if="usage" class="section-block">
              <h4>{{ t('products.usage') }}</h4>
              <p>{{ usage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.product-modal {
  max-width: 860px;
  padding: 0;
  overflow: hidden;
}
.btn-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0,0,0,0.5);
  border: none;
  color: white;
  width: 36px; height: 36px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  z-index: 10;
}
.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.gallery { background: #f0ebe8; position: relative; }
.main-img {
  position: relative;
  aspect-ratio: 1;
}
.main-img img { width: 100%; height: 100%; object-fit: cover; }
.arrow {
  position: absolute;
  top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,0.7);
  border: none;
  font-size: 1.6rem;
  width: 36px; height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.arrow.left  { left: 0.5rem; }
.arrow.right { right: 0.5rem; }
.thumbs {
  display: flex;
  gap: 0.4rem;
  padding: 0.5rem;
  flex-wrap: wrap;
}
.thumbs img {
  width: 56px; height: 56px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0.6;
  border: 2px solid transparent;
  transition: all 0.2s;
}
.thumbs img.active { opacity: 1; border-color: var(--primary); }
.detail {
  padding: 2rem;
  overflow-y: auto;
  max-height: 560px;
}
.detail h2 { font-size: 1.5rem; margin-bottom: 0.75rem; }
.price { color: var(--primary); font-weight: 700; font-size: 1.2rem; margin-bottom: 1rem; }
.desc { color: var(--muted); line-height: 1.7; margin-bottom: 1.25rem; font-size: 0.95rem; }
.section-block { margin-top: 1.25rem; }
.section-block h4 {
  font-family: var(--font-en);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 0.4rem;
}
.section-block p { font-size: 0.9rem; color: var(--muted); line-height: 1.6; }

@media (max-width: 640px) {
  .modal-body { grid-template-columns: 1fr; }
  .detail { max-height: none; }
}
</style>
