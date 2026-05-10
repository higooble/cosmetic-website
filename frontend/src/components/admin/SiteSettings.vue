<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const form = ref({
  company_name_th: '',
  company_name_en: '',
  line_oa_url:     '',
  facebook_url:    '',
  instagram_url:   '',
  tiktok_url:      '',
  footer_text_th:  '',
  footer_text_en:  '',
});

const logoFile      = ref(null);
const logoPreview   = ref('');
const currentLogo   = ref('');
const saving        = ref(false);
const status        = ref('');

onMounted(async () => {
  const { data } = await api.get('/admin/settings');
  Object.keys(form.value).forEach(k => { form.value[k] = data[k] ?? ''; });
  currentLogo.value = data.logo_url ?? '';
});

function onLogoChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  logoFile.value    = file;
  logoPreview.value = URL.createObjectURL(file);
}

async function save() {
  saving.value = true;
  status.value = '';
  try {
    const fd = new FormData();
    Object.entries(form.value).forEach(([k, v]) => fd.append(k, v));
    if (logoFile.value) fd.append('logo', logoFile.value);
    else if (currentLogo.value) fd.append('logo_url', currentLogo.value);

    const { data } = await api.put('/admin/settings', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    currentLogo.value = data.logo_url ?? '';
    logoFile.value    = null;
    logoPreview.value = '';
    status.value      = 'success';
  } catch {
    status.value = 'error';
  } finally {
    saving.value = false;
    setTimeout(() => { status.value = ''; }, 3500);
  }
}
</script>

<template>
  <div class="settings-page">
    <div class="page-header">
      <h1>⚙️ Site Settings</h1>
      <p class="subtitle">ตั้งค่าข้อมูลแบรนด์ที่แสดงบนเว็บไซต์</p>
    </div>

    <form @submit.prevent="save" class="settings-form">

      <!-- Brand Identity -->
      <section class="card section-card">
        <h2 class="section-title">🌸 ข้อมูลแบรนด์ (Brand Identity)</h2>

        <div class="form-row two">
          <div class="form-group">
            <label>ชื่อบริษัท / แบรนด์ (ไทย) *</label>
            <input v-model="form.company_name_th" type="text" placeholder="เช่น ร้านความงาม Rose Gold" required />
          </div>
          <div class="form-group">
            <label>ชื่อบริษัท / แบรนด์ (อังกฤษ)</label>
            <input v-model="form.company_name_en" type="text" placeholder="e.g. Rose Gold Beauty" />
          </div>
        </div>

        <div class="form-group">
          <label>โลโก้แบรนด์ (Logo)</label>
          <div class="logo-upload-area">
            <div class="logo-preview">
              <img v-if="logoPreview || currentLogo"
                   :src="logoPreview || (currentLogo.startsWith('/') ? `http://localhost:3000${currentLogo}` : currentLogo)"
                   alt="Logo Preview" />
              <div v-else class="logo-placeholder">
                <span>ยังไม่มีโลโก้</span>
              </div>
            </div>
            <div class="logo-upload-info">
              <input type="file" id="logo-input" accept="image/*" @change="onLogoChange" hidden />
              <label for="logo-input" class="btn btn-outline upload-btn">📁 เลือกไฟล์รูปโลโก้</label>
              <p class="hint">รองรับ JPG, PNG, WEBP • ขนาดไม่เกิน 5MB</p>
              <p class="hint">แนะนำขนาด 200×60 px (แนวนอน)</p>
              <p v-if="logoFile" class="file-selected">✅ เลือกแล้ว: {{ logoFile.name }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Social Media -->
      <section class="card section-card">
        <h2 class="section-title">📱 Social Media & Contact</h2>

        <div class="form-row two">
          <div class="form-group">
            <label>LINE OA URL</label>
            <div class="input-icon">
              <span class="icon line-icon">L</span>
              <input v-model="form.line_oa_url" type="url" placeholder="https://lin.ee/xxxxxxx" />
            </div>
            <p class="hint">วาง URL จาก LINE Official Account Manager</p>
          </div>
          <div class="form-group">
            <label>Facebook URL</label>
            <div class="input-icon">
              <span class="icon fb-icon">f</span>
              <input v-model="form.facebook_url" type="url" placeholder="https://facebook.com/yourpage" />
            </div>
          </div>
        </div>

        <div class="form-row two">
          <div class="form-group">
            <label>Instagram URL</label>
            <div class="input-icon">
              <span class="icon ig-icon">▣</span>
              <input v-model="form.instagram_url" type="url" placeholder="https://instagram.com/youraccount" />
            </div>
          </div>
          <div class="form-group">
            <label>TikTok URL</label>
            <div class="input-icon">
              <span class="icon tt-icon">♪</span>
              <input v-model="form.tiktok_url" type="url" placeholder="https://tiktok.com/@youraccount" />
            </div>
          </div>
        </div>
      </section>

      <!-- Footer Text -->
      <section class="card section-card">
        <h2 class="section-title">📝 ข้อความ Footer</h2>
        <div class="form-row two">
          <div class="form-group">
            <label>ข้อความลิขสิทธิ์ (ไทย)</label>
            <input v-model="form.footer_text_th" type="text" placeholder="สงวนลิขสิทธิ์" />
          </div>
          <div class="form-group">
            <label>ข้อความลิขสิทธิ์ (อังกฤษ)</label>
            <input v-model="form.footer_text_en" type="text" placeholder="All rights reserved" />
          </div>
        </div>
      </section>

      <!-- Actions -->
      <div class="form-actions">
        <div v-if="status" :class="['alert', status]">
          {{ status === 'success' ? '✅ บันทึกสำเร็จแล้ว!' : '❌ เกิดข้อผิดพลาด กรุณาลองใหม่' }}
        </div>
        <button type="submit" class="btn btn-primary save-btn" :disabled="saving">
          {{ saving ? 'กำลังบันทึก...' : '💾 บันทึกการตั้งค่า' }}
        </button>
      </div>

    </form>
  </div>
</template>

<style scoped>
.settings-page { padding: 2rem; max-width: 860px; }

.page-header { margin-bottom: 2rem; }
.page-header h1 { font-size: 1.6rem; color: var(--text); margin-bottom: 0.25rem; }
.subtitle { color: #888; font-size: 0.9rem; }

.section-card { margin-bottom: 1.5rem; padding: 1.75rem; }
.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 1.25rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgba(201,150,122,0.2);
}

.form-row.two { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
.form-group label { font-size: 0.85rem; font-weight: 600; color: var(--text); }
.form-group input {
  padding: 0.6rem 0.85rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}
.form-group input:focus { outline: none; border-color: var(--primary); }
.hint { font-size: 0.78rem; color: #aaa; margin-top: 0.2rem; }
.file-selected { font-size: 0.82rem; color: #4CAF50; margin-top: 0.3rem; }

/* Logo */
.logo-upload-area { display: flex; gap: 1.5rem; align-items: flex-start; flex-wrap: wrap; }
.logo-preview {
  width: 180px; height: 80px;
  border: 2px dashed #ddd;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; background: #fafafa; flex-shrink: 0;
}
.logo-preview img { max-width: 100%; max-height: 100%; object-fit: contain; }
.logo-placeholder { color: #ccc; font-size: 0.82rem; }
.logo-upload-info { display: flex; flex-direction: column; gap: 0.4rem; }
.upload-btn { cursor: pointer; display: inline-block; }

/* Input with icon */
.input-icon { position: relative; }
.input-icon input { padding-left: 2.4rem; width: 100%; box-sizing: border-box; }
.icon {
  position: absolute; left: 0.75rem; top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem; font-weight: 700; width: 18px; text-align: center;
}
.line-icon  { color: #00C300; }
.fb-icon    { color: #1877F2; }
.ig-icon    { color: #E1306C; }
.tt-icon    { color: #000; }

/* Actions */
.form-actions { display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start; }
.save-btn { padding: 0.75rem 2.5rem; font-size: 1rem; }
.save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.alert {
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
}
.alert.success { background: #E8F5E9; color: #2E7D32; }
.alert.error   { background: #FFEBEE; color: #C62828; }

@media (max-width: 640px) {
  .form-row.two { grid-template-columns: 1fr; }
}
</style>
