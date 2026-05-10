<script setup>
import { ref, onMounted } from 'vue';
import { useContentStore } from '../stores/content';
import NavBar         from '../components/public/NavBar.vue';
import BannerSection  from '../components/public/BannerSection.vue';
import CatalogSection from '../components/public/CatalogSection.vue';
import ProductGrid    from '../components/public/ProductGrid.vue';
import ProductModal   from '../components/public/ProductModal.vue';
import ContactSection from '../components/public/ContactSection.vue';
import FooterSection  from '../components/public/FooterSection.vue';

const store    = useContentStore();
const selected = ref(null);
const active   = ref(null);

onMounted(() => store.fetchAll());

function onFilter(categoryId) {
  selected.value = categoryId;
  store.fetchProducts(categoryId);
}
</script>

<template>
  <NavBar />
  <BannerSection />
  <CatalogSection v-model:selected="selected" @filter="onFilter" />
  <ProductGrid :selectedCategory="selected" @open="p => active = p" />
  <ProductModal :product="active" @close="active = null" />
  <ContactSection />
  <FooterSection />
</template>
