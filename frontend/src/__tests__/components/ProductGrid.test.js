import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { createPinia, setActivePinia } from 'pinia';
import ProductGrid from '../../components/public/ProductGrid.vue';
import { useContentStore } from '../../stores/content';
import en from '../../locales/en.json';
import th from '../../locales/th.json';

vi.mock('../../services/api', () => ({ default: { get: vi.fn(), post: vi.fn() } }));

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en, th } });

const mockProducts = [
  {
    id: 1, name_en: 'Rose Serum', name_th: 'เซรั่มกุหลาบ',
    price: 590, category_id: 1, is_active: true,
    images: [{ id: 1, image_url: '/uploads/a.jpg', is_primary: true, sort_order: 0 }],
  },
  {
    id: 2, name_en: 'Gold Cream', name_th: 'ครีมทองคำ',
    price: null, category_id: 1, is_active: true,
    images: [],
  },
];

describe('ProductGrid', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const store = useContentStore();
    store.products = mockProducts;
  });

  it('renders all products when no category selected', () => {
    const wrapper = mount(ProductGrid, {
      props: { selectedCategory: null },
      global: { plugins: [i18n] },
    });
    expect(wrapper.findAll('.product-card')).toHaveLength(2);
  });

  it('shows product name in English', () => {
    const wrapper = mount(ProductGrid, {
      props: { selectedCategory: null },
      global: { plugins: [i18n] },
    });
    expect(wrapper.text()).toContain('Rose Serum');
  });

  it('shows price when product has price', () => {
    const wrapper = mount(ProductGrid, {
      props: { selectedCategory: null },
      global: { plugins: [i18n] },
    });
    expect(wrapper.text()).toContain('590');
  });

  it('hides price when product has no price', () => {
    const wrapper = mount(ProductGrid, {
      props: { selectedCategory: null },
      global: { plugins: [i18n] },
    });
    const cards = wrapper.findAll('.product-card');
    expect(cards[1].find('.price').exists()).toBe(false);
  });

  it('emits open event when product clicked', async () => {
    const wrapper = mount(ProductGrid, {
      props: { selectedCategory: null },
      global: { plugins: [i18n] },
    });
    await wrapper.find('.product-card').trigger('click');
    expect(wrapper.emitted('open')).toBeTruthy();
    expect(wrapper.emitted('open')[0][0]).toMatchObject({ id: 1 });
  });

  it('shows empty message when no products match category', () => {
    const store = useContentStore();
    store.products = [];
    const wrapper = mount(ProductGrid, {
      props: { selectedCategory: 99 },
      global: { plugins: [i18n] },
    });
    expect(wrapper.text()).toContain('No products found');
  });
});
