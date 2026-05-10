<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const banners  = ref([]);
const showForm = ref(false);
const editing  = ref(null);
const toast    = ref('');
const form     = ref({ title_th: '', title_en: '', subtitle_th: '', subtitle_en: '', sort_order: 0, is_active: true });
const imageFile = ref(null);

async function load() {
  const { data } = await api.get('/admin/banners');
  banners.value  = data;
}

function openCreate() {
  editing.value  = null;
  form.value     = { title_th: '', title_en: '', subtitle_th: '', subtitle_en: '', sort_order: 0, is_active: true };
  imageFile.value = null;
  showForm.value = true;
}

function openEdit(b) {
  editing.value   = b;
  form.value      = { ...b };
  imageFile.value = null;
  showForm.value  = true;
}

async function save() {
  const fd = new FormData();
  Object.entries(form.value).forEach(([k, v]) => fd.append(k, v));
  if (imageFile.value) fd.append('image', imageFile.value);

  if (editing.value) {
    await api.put(`/admin/banners/${editing.value.id}`, fd);
  } else {
    await api.post('/admin/banners', fd);
  }
  showForm.value = false;
  await load();
  showToast('Saved successfully');
}

async function remove(id) {
  if (!confirm('Delete this banner?')) return;
  await api.delete(`/admin/banners/${id}`);
  await load();
  showToast('Deleted');
}

function showToast(msg) {
  toast.value = msg;
  setTimeout(() => { toast.value = ''; }, 3000);
}

onMounted(load);
</script>

<template>
  <div>
    <div class="admin-page-header">
      <h1>Banners</h1>
      <button class="btn btn-primary" @click="openCreate">+ Add Banner</button>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Image</th><th>Title TH</th><th>Title EN</th><th>Order</th><th>Active</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in banners" :key="b.id">
            <td><img :src="b.image_url" style="width:80px;height:50px;object-fit:cover;border-radius:6px" /></td>
            <td>{{ b.title_th || '—' }}</td>
            <td>{{ b.title_en || '—' }}</td>
            <td>{{ b.sort_order }}</td>
            <td><span :class="['badge', b.is_active ? 'badge-green' : 'badge-red']">{{ b.is_active ? 'Yes' : 'No' }}</span></td>
            <td>
              <button class="btn btn-outline" style="padding:0.3rem 0.8rem;font-size:0.8rem" @click="openEdit(b)">Edit</button>
              <button class="btn" style="padding:0.3rem 0.8rem;font-size:0.8rem;color:#C62828;border:1.5px solid #C62828;border-radius:50px;background:none;cursor:pointer;margin-left:0.4rem" @click="remove(b.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!banners.length"><td colspan="6" style="text-align:center;color:var(--muted)">No banners yet</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal-box">
        <div class="modal-header">
          <h3>{{ editing ? 'Edit Banner' : 'New Banner' }}</h3>
          <button class="btn-close" @click="showForm = false">✕</button>
        </div>
        <form @submit.prevent="save">
          <div class="form-group">
            <label>Image {{ editing ? '(leave blank to keep)' : '*' }}</label>
            <input type="file" accept="image/*" @change="e => imageFile = e.target.files[0]" :required="!editing" />
          </div>
          <div class="form-group"><label>Title TH</label><input v-model="form.title_th" /></div>
          <div class="form-group"><label>Title EN</label><input v-model="form.title_en" /></div>
          <div class="form-group"><label>Subtitle TH</label><input v-model="form.subtitle_th" /></div>
          <div class="form-group"><label>Subtitle EN</label><input v-model="form.subtitle_en" /></div>
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
