<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const products   = ref([]);
const categories = ref([]);
const showForm   = ref(false);
const editing    = ref(null);
const toast      = ref('');
const imageFiles = ref([]);
const form       = ref({
  category_id: '', name_th: '', name_en: '',
  description_th: '', description_en: '',
  ingredients_th: '', ingredients_en: '',
  usage_th: '', usage_en: '',
  price: '', sort_order: 0, is_active: true,
});

async function load() {
  const [p, c] = await Promise.all([api.get('/admin/products'), api.get('/admin/categories')]);
  products.value   = p.data;
  categories.value = c.data;
}

function openCreate() {
  editing.value  = null;
  imageFiles.value = [];
  form.value     = { category_id: '', name_th: '', name_en: '', description_th: '', description_en: '', ingredients_th: '', ingredients_en: '', usage_th: '', usage_en: '', price: '', sort_order: 0, is_active: true };
  showForm.value = true;
}

function openEdit(p) {
  editing.value    = p;
  imageFiles.value = [];
  form.value       = { ...p, price: p.price || '' };
  showForm.value   = true;
}

async function save() {
  const fd = new FormData();
  Object.entries(form.value).forEach(([k, v]) => { if (v !== '' && v !== null) fd.append(k, v); });
  imageFiles.value.forEach(f => fd.append('images', f));

  if (editing.value) {
    await api.put(`/admin/products/${editing.value.id}`, fd);
  } else {
    await api.post('/admin/products', fd);
  }
  showForm.value = false;
  await load();
  showToast('Saved successfully');
}

async function remove(id) {
  if (!confirm('Delete this product?')) return;
  await api.delete(`/admin/products/${id}`);
  await load();
  showToast('Deleted');
}

async function removeImage(productId, imageId) {
  if (!confirm('Remove this image?')) return;
  await api.delete(`/admin/products/${productId}/images/${imageId}`);
  const p = products.value.find(x => x.id === productId);
  if (p) p.images = p.images.filter(i => i.id !== imageId);
}

function onFiles(e) { imageFiles.value = Array.from(e.target.files); }

function primaryImg(p) { return p.images?.find(i => i.is_primary)?.image_url || p.images?.[0]?.image_url || null; }
function catName(id) { return categories.value.find(c => c.id === id)?.name_en || '—'; }

function showToast(msg) { toast.value = msg; setTimeout(() => { toast.value = ''; }, 3000); }
onMounted(load);
</script>

<template>
  <div>
    <div class="admin-page-header">
      <h1>Products</h1>
      <button class="btn btn-primary" @click="openCreate">+ Add Product</button>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>Image</th><th>Name EN</th><th>Category</th><th>Price</th><th>Active</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td>
              <img v-if="primaryImg(p)" :src="primaryImg(p)" style="width:60px;height:60px;object-fit:cover;border-radius:6px" />
              <span v-else style="color:var(--muted);font-size:0.8rem">No image</span>
            </td>
            <td>{{ p.name_en }}</td>
            <td>{{ catName(p.category_id) }}</td>
            <td>{{ p.price ? `฿${Number(p.price).toLocaleString()}` : '—' }}</td>
            <td><span :class="['badge', p.is_active ? 'badge-green' : 'badge-red']">{{ p.is_active ? 'Yes' : 'No' }}</span></td>
            <td>
              <button class="btn btn-outline" style="padding:0.3rem 0.8rem;font-size:0.8rem" @click="openEdit(p)">Edit</button>
              <button class="btn" style="padding:0.3rem 0.8rem;font-size:0.8rem;color:#C62828;border:1.5px solid #C62828;border-radius:50px;background:none;cursor:pointer;margin-left:0.4rem" @click="remove(p.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!products.length"><td colspan="6" style="text-align:center;color:var(--muted)">No products yet</td></tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal-box" style="max-width:700px">
        <div class="modal-header">
          <h3>{{ editing ? 'Edit Product' : 'New Product' }}</h3>
          <button class="btn-close" @click="showForm = false">✕</button>
        </div>
        <form @submit.prevent="save">
          <div class="form-group">
            <label>Category</label>
            <select v-model="form.category_id">
              <option value="">— None —</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name_en }}</option>
            </select>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="form-group"><label>Name TH *</label><input v-model="form.name_th" required /></div>
            <div class="form-group"><label>Name EN *</label><input v-model="form.name_en" required /></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="form-group"><label>Description TH</label><textarea v-model="form.description_th" rows="3" /></div>
            <div class="form-group"><label>Description EN</label><textarea v-model="form.description_en" rows="3" /></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="form-group"><label>Ingredients TH</label><textarea v-model="form.ingredients_th" rows="2" /></div>
            <div class="form-group"><label>Ingredients EN</label><textarea v-model="form.ingredients_en" rows="2" /></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="form-group"><label>Usage TH</label><textarea v-model="form.usage_th" rows="2" /></div>
            <div class="form-group"><label>Usage EN</label><textarea v-model="form.usage_en" rows="2" /></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="form-group"><label>Price (optional)</label><input v-model="form.price" type="number" step="0.01" placeholder="e.g. 590" /></div>
            <div class="form-group"><label>Sort Order</label><input v-model.number="form.sort_order" type="number" /></div>
          </div>

          <div class="form-group" style="display:flex;align-items:center;gap:0.5rem">
            <input id="pactive" v-model="form.is_active" type="checkbox" style="width:auto" />
            <label for="pactive" style="margin:0">Active</label>
          </div>

          <div class="form-group">
            <label>Upload Images (up to 10)</label>
            <input type="file" accept="image/*" multiple @change="onFiles" />
          </div>

          <div v-if="editing?.images?.length" class="existing-images">
            <p style="font-size:0.85rem;color:var(--muted);margin-bottom:0.5rem">Current images:</p>
            <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
              <div v-for="img in editing.images" :key="img.id" style="position:relative">
                <img :src="img.image_url" style="width:70px;height:70px;object-fit:cover;border-radius:6px" />
                <button type="button" @click="removeImage(editing.id, img.id)"
                  style="position:absolute;top:-6px;right:-6px;width:20px;height:20px;background:#E53935;color:white;border:none;border-radius:50%;font-size:0.7rem;cursor:pointer;line-height:1">✕</button>
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:1rem">Save Product</button>
        </form>
      </div>
    </div>

    <div v-if="toast" class="toast success">{{ toast }}</div>
  </div>
</template>
