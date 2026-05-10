<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const categories = ref([]);
const showForm   = ref(false);
const editing    = ref(null);
const toast      = ref('');
const form       = ref({ name_th: '', name_en: '', slug: '', sort_order: 0, is_active: true });

function slugify(str) { return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); }

async function load() {
  const { data } = await api.get('/admin/categories');
  categories.value = data;
}

function openCreate() {
  editing.value = null;
  form.value    = { name_th: '', name_en: '', slug: '', sort_order: 0, is_active: true };
  showForm.value = true;
}

function openEdit(c) {
  editing.value  = c;
  form.value     = { ...c };
  showForm.value = true;
}

async function save() {
  if (!form.value.slug) form.value.slug = slugify(form.value.name_en || form.value.name_th);
  if (editing.value) {
    await api.put(`/admin/categories/${editing.value.id}`, form.value);
  } else {
    await api.post('/admin/categories', form.value);
  }
  showForm.value = false;
  await load();
  showToast('Saved');
}

async function remove(id) {
  if (!confirm('Delete this category?')) return;
  await api.delete(`/admin/categories/${id}`);
  await load();
  showToast('Deleted');
}

function showToast(msg) { toast.value = msg; setTimeout(() => { toast.value = ''; }, 3000); }
onMounted(load);
</script>

<template>
  <div>
    <div class="admin-page-header">
      <h1>Categories</h1>
      <button class="btn btn-primary" @click="openCreate">+ Add Category</button>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>Name TH</th><th>Name EN</th><th>Slug</th><th>Order</th><th>Active</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="c in categories" :key="c.id">
            <td>{{ c.name_th }}</td>
            <td>{{ c.name_en }}</td>
            <td><code>{{ c.slug }}</code></td>
            <td>{{ c.sort_order }}</td>
            <td><span :class="['badge', c.is_active ? 'badge-green' : 'badge-red']">{{ c.is_active ? 'Yes' : 'No' }}</span></td>
            <td>
              <button class="btn btn-outline" style="padding:0.3rem 0.8rem;font-size:0.8rem" @click="openEdit(c)">Edit</button>
              <button class="btn" style="padding:0.3rem 0.8rem;font-size:0.8rem;color:#C62828;border:1.5px solid #C62828;border-radius:50px;background:none;cursor:pointer;margin-left:0.4rem" @click="remove(c.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!categories.length"><td colspan="6" style="text-align:center;color:var(--muted)">No categories yet</td></tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal-box">
        <div class="modal-header">
          <h3>{{ editing ? 'Edit Category' : 'New Category' }}</h3>
          <button class="btn-close" @click="showForm = false">✕</button>
        </div>
        <form @submit.prevent="save">
          <div class="form-group"><label>Name TH *</label><input v-model="form.name_th" required /></div>
          <div class="form-group"><label>Name EN *</label><input v-model="form.name_en" required /></div>
          <div class="form-group">
            <label>Slug (auto-generated if blank)</label>
            <input v-model="form.slug" placeholder="e.g. face-care" />
          </div>
          <div class="form-group"><label>Sort Order</label><input v-model.number="form.sort_order" type="number" /></div>
          <div class="form-group" style="display:flex;align-items:center;gap:0.5rem">
            <input id="active" v-model="form.is_active" type="checkbox" style="width:auto" />
            <label for="active" style="margin:0">Active</label>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center">Save</button>
        </form>
      </div>
    </div>

    <div v-if="toast" class="toast success">{{ toast }}</div>
  </div>
</template>
