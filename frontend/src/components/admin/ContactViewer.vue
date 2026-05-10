<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const contacts = ref([]);

async function load() {
  const { data } = await api.get('/admin/contacts');
  contacts.value = data;
}

async function markRead(id) {
  await api.put(`/admin/contacts/${id}/read`);
  const c = contacts.value.find(x => x.id === id);
  if (c) c.is_read = true;
}

function fmt(d) { return new Date(d).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }); }

onMounted(load);
</script>

<template>
  <div>
    <div class="admin-page-header">
      <h1>Contact Submissions</h1>
      <span style="font-size:0.85rem;color:var(--muted)">{{ contacts.filter(c => !c.is_read).length }} unread</span>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr v-for="c in contacts" :key="c.id" :style="{ background: c.is_read ? '' : '#FFFBF8' }">
            <td><strong>{{ c.name }}</strong></td>
            <td>{{ c.email || '—' }}</td>
            <td>{{ c.phone || '—' }}</td>
            <td style="max-width:300px;white-space:pre-wrap;font-size:0.85rem">{{ c.message }}</td>
            <td style="white-space:nowrap;font-size:0.82rem;color:var(--muted)">{{ fmt(c.created_at) }}</td>
            <td>
              <span v-if="c.is_read" class="badge badge-green">Read</span>
              <button v-else class="btn badge badge-orange" style="border:none;cursor:pointer" @click="markRead(c.id)">Mark Read</button>
            </td>
          </tr>
          <tr v-if="!contacts.length">
            <td colspan="6" style="text-align:center;color:var(--muted)">No submissions yet</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
