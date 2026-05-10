import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import NavBar from '../../components/public/NavBar.vue';
import en from '../../locales/en.json';
import th from '../../locales/th.json';

// localStorage mock
const storage = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem:    (k) => storage[k] ?? null,
    setItem:    (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; },
    clear:      () => { Object.keys(storage).forEach(k => delete storage[k]); },
  },
  writable: true,
});

function makeI18n(locale = 'en') {
  return createI18n({ legacy: false, locale, messages: { en, th } });
}

describe('NavBar', () => {
  it('renders brand name', () => {
    const wrapper = mount(NavBar, { global: { plugins: [makeI18n()] } });
    expect(wrapper.text()).toContain('Cosmetic');
  });

  it('renders navigation links in English', () => {
    const wrapper = mount(NavBar, { global: { plugins: [makeI18n('en')] } });
    expect(wrapper.text()).toContain('Home');
    expect(wrapper.text()).toContain('Products');
    expect(wrapper.text()).toContain('Contact');
  });

  it('shows EN button when language is TH', () => {
    const wrapper = mount(NavBar, { global: { plugins: [makeI18n('th')] } });
    expect(wrapper.find('.lang-btn').text()).toBe('EN');
  });

  it('shows TH button when language is EN', () => {
    const wrapper = mount(NavBar, { global: { plugins: [makeI18n('en')] } });
    expect(wrapper.find('.lang-btn').text()).toBe('TH');
  });

  it('toggles language on button click', async () => {
    const i18n    = makeI18n('th');
    const wrapper = mount(NavBar, { global: { plugins: [i18n] } });
    expect(wrapper.find('.lang-btn').text()).toBe('EN');
    await wrapper.find('.lang-btn').trigger('click');
    expect(wrapper.find('.lang-btn').text()).toBe('TH');
  });

  it('adds scrolled class after scroll event', async () => {
    const wrapper = mount(NavBar, { global: { plugins: [makeI18n()] } });
    expect(wrapper.find('.navbar').classes()).not.toContain('scrolled');
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    window.dispatchEvent(new Event('scroll'));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.navbar').classes()).toContain('scrolled');
  });
});
