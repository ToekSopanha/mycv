<template>
  <div class="admin-panel">
    <!-- Login screen -->
    <div v-if="!token" class="login-screen d-flex align-items-center justify-content-center">
      <div class="glass-card login-card p-5 text-center">
        <div class="login-icon mb-3"><i class="bi bi-shield-lock-fill"></i></div>
        <h4 class="mb-1">Admin Access</h4>
        <p class="text-muted mb-4" style="font-size:0.9rem">Enter your password to manage content</p>
        <form @submit.prevent="login">
          <input v-model="password" type="password" class="form-input mb-3"
            placeholder="Password" autocomplete="current-password" />
          <button type="submit" class="btn btn-glow w-100" :disabled="loggingIn">
            <span v-if="loggingIn"><span class="spinner-border spinner-border-sm me-2"></span></span>
            <i v-else class="bi bi-unlock me-2"></i>Login
          </button>
          <div v-if="loginError" class="status-msg error mt-3">
            <i class="bi bi-x-circle me-2"></i>{{ loginError }}
          </div>
        </form>
        <RouterLink to="/" class="d-block mt-3" style="color:var(--text-muted); font-size:0.85rem">
          ← Back to Portfolio
        </RouterLink>
      </div>
    </div>

    <!-- Dashboard -->
    <div v-else class="dashboard">
      <!-- Top bar -->
      <div class="admin-topbar d-flex align-items-center justify-content-between px-4 py-3">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-shield-check" style="color:var(--accent-cyan); font-size:1.3rem"></i>
          <span style="font-weight:700; font-family:var(--font-heading)">Admin Dashboard</span>
        </div>
        <div class="d-flex gap-2">
          <RouterLink to="/" class="btn btn-sm btn-outline-glow">
            <i class="bi bi-eye me-1"></i>View Site
          </RouterLink>
          <button class="btn btn-sm" style="background:rgba(255,0,80,0.15); color:#ff4466; border:1px solid rgba(255,0,80,0.3); border-radius:8px"
            @click="logout">
            <i class="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </div>
      </div>

      <!-- Tab navigation -->
      <div class="admin-tabs d-flex gap-2 px-4 py-3 flex-wrap">
        <button class="tab-btn" :class="{ active: activeTab === 'projects' }"
          @click="activeTab = 'projects'">
          <i class="bi bi-folder2-open me-2"></i>Projects
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'skills' }"
          @click="activeTab = 'skills'">
          <i class="bi bi-lightning me-2"></i>Skills
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'about' }"
          @click="activeTab = 'about'">
          <i class="bi bi-person-badge me-2"></i>About / Hero
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'contact' }"
          @click="activeTab = 'contact'">
          <i class="bi bi-envelope me-2"></i>Contact
        </button>
      </div>

      <div class="admin-content px-4 pb-5">

        <!-- ── PROJECTS TAB ── -->
        <div v-if="activeTab === 'projects'">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="m-0">Manage Projects</h5>
            <button class="btn btn-glow btn-sm" @click="openProjectModal()">
              <i class="bi bi-plus-lg me-1"></i>Add Project
            </button>
          </div>

          <div v-if="status.text && status.scope === 'projects'" class="status-msg" :class="status.type" >
            <i :class="status.type === 'success' ? 'bi bi-check-circle' : 'bi bi-x-circle'" class="me-2"></i>{{ status.text }}
          </div>

          <div class="row g-3">
            <div class="col-md-6 col-lg-4" v-for="project in projects" :key="project.id">
              <div class="glass-card p-3">
                <div class="d-flex justify-content-between align-items-start">
                  <h6 class="mb-1" style="color:var(--text-primary)">{{ project.title }}</h6>
                  <span v-if="project.featured" class="tag-badge" style="font-size:0.65rem">⭐ Featured</span>
                </div>
                <p style="color:var(--text-muted); font-size:0.82rem; line-height:1.5" class="mb-2">
                  {{ project.description?.slice(0, 100) }}{{ project.description?.length > 100 ? '…' : '' }}
                </p>
                <div class="mb-2">
                  <span class="tag-badge" v-for="tag in project.tags" :key="tag">{{ tag }}</span>
                </div>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-outline-glow" @click="openProjectModal(project)">
                    <i class="bi bi-pencil"></i> Edit
                  </button>
                  <button class="btn btn-sm"
                    style="background:rgba(255,0,80,0.1); color:#ff4466; border:1px solid rgba(255,0,80,0.2); border-radius:8px"
                    @click="deleteProject(project.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── SKILLS TAB ── -->
        <div v-if="activeTab === 'skills'">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="m-0">Manage Skills</h5>
            <button class="btn btn-glow btn-sm" @click="openSkillModal()">
              <i class="bi bi-plus-lg me-1"></i>Add Skill
            </button>
          </div>

          <div v-if="status.text && status.scope === 'skills'" class="status-msg" :class="status.type">
            <i :class="status.type === 'success' ? 'bi bi-check-circle' : 'bi bi-x-circle'" class="me-2"></i>{{ status.text }}
          </div>

          <div class="row g-3">
            <div class="col-md-6 col-lg-3" v-for="skill in skills" :key="skill.id">
              <div class="glass-card p-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span style="font-weight:600">{{ skill.icon }} {{ skill.name }}</span>
                  <span class="tag-badge" style="font-size:0.7rem">{{ skill.category }}</span>
                </div>
                <div class="progress-track mb-2">
                  <div class="progress-fill fill-expert" :style="{ width: skill.level + '%' }"></div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span style="color:var(--accent-cyan); font-size:0.8rem">{{ skill.level }}%</span>
                  <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-glow" @click="openSkillModal(skill)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm"
                      style="background:rgba(255,0,80,0.1); color:#ff4466; border:1px solid rgba(255,0,80,0.2); border-radius:8px"
                      @click="deleteSkill(skill.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── ABOUT / HERO TAB ── -->
        <div v-if="activeTab === 'about'">
          <h5 class="mb-4">About / Hero Content</h5>

          <div v-if="status.text && status.scope === 'about'" class="status-msg" :class="status.type">
            <i :class="status.type === 'success' ? 'bi bi-check-circle' : 'bi bi-x-circle'" class="me-2"></i>{{ status.text }}
          </div>

          <!-- Hero section -->
          <div class="glass-card p-4 mb-4">
            <h6 class="mb-3"><i class="bi bi-stars me-2"></i>Hero Section</h6>
            <div class="row g-3">
              <div class="col-sm-6">
                <label class="form-label-custom">Greeting</label>
                <input v-model="heroForm.greeting" class="form-input" placeholder="Hi, my name is" />
              </div>
              <div class="col-sm-6">
                <label class="form-label-custom">Name</label>
                <input v-model="heroForm.name" class="form-input" placeholder="Your name" />
              </div>
              <div class="col-12">
                <label class="form-label-custom">Typed Titles (comma separated)</label>
                <input v-model="heroForm.titlesRaw" class="form-input"
                  placeholder="Full Stack Developer, UI Designer, Open Source Contributor" />
                <small style="color:var(--text-muted)">
                  Each entry will be cycled in the typing animation.
                </small>
              </div>
              <div class="col-12">
                <label class="form-label-custom">Hero Bio</label>
                <textarea v-model="heroForm.bio" class="form-input" rows="3"
                  placeholder="A short tagline shown beneath the name"></textarea>
              </div>
              <div class="col-12 d-flex gap-2">
                <button type="button" class="btn btn-glow" :disabled="savingHero" @click="saveHero">
                  <span v-if="savingHero" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-check2 me-1"></i>Save Hero
                </button>
              </div>
            </div>
          </div>

          <!-- Profile photo + About section -->
          <div class="glass-card p-4 mb-4">
            <h6 class="mb-3"><i class="bi bi-person-circle me-2"></i>Profile Photo</h6>
            <div class="row g-3 align-items-start">
              <div class="col-sm-4">
                <div class="image-preview-box">
                  <img v-if="aboutForm.profilePhoto" :src="aboutForm.profilePhoto" alt="Profile preview" />
                  <div v-else class="image-preview-placeholder">
                    <i class="bi bi-image"></i>
                    <span>No photo</span>
                  </div>
                </div>
              </div>
              <div class="col-sm-8">
                <label class="form-label-custom">Upload Image</label>
                <input ref="profileFileInput" type="file" accept="image/*" class="form-input"
                  @change="handleProfilePhotoChange" />
                <small style="color:var(--text-muted)">
                  Accepted: any image/* up to 5 MB. Uploads immediately and updates the preview.
                </small>
                <div v-if="uploadingProfile" class="mt-2" style="color:var(--text-muted); font-size:0.85rem">
                  <span class="spinner-border spinner-border-sm me-2"></span>Uploading…
                </div>
              </div>
            </div>
          </div>

          <!-- CV / Resume upload -->
          <div class="glass-card p-4 mb-4">
            <h6 class="mb-3"><i class="bi bi-file-earmark-pdf me-2"></i>CV / Resume</h6>
            <div class="row g-3 align-items-start">
              <div class="col-sm-4">
                <div class="cv-status-box">
                  <i v-if="cvStatusLoading" class="bi bi-hourglass-split"
                    style="color:var(--text-muted); font-size:2.2rem"></i>
                  <i v-else-if="cvExists" class="bi bi-file-earmark-check-fill"
                    style="color:#4ade80; font-size:2.4rem"></i>
                  <i v-else class="bi bi-file-earmark-x"
                    style="color:var(--text-muted); font-size:2.4rem"></i>
                  <div v-if="cvStatusLoading" class="cv-status-label muted">Checking…</div>
                  <div v-else-if="cvExists" class="cv-status-label success">CV uploaded</div>
                  <div v-else class="cv-status-label muted">No CV uploaded</div>
                </div>
              </div>
              <div class="col-sm-8">
                <label class="form-label-custom">Upload CV (PDF only, max 10 MB)</label>
                <input ref="cvFileInput" type="file" accept="application/pdf" class="form-input"
                  @change="handleCvFileChange" />
                <small style="color:var(--text-muted)">
                  Replaces the current CV file on the server.
                </small>
                <div v-if="uploadingCv" class="mt-2" style="color:var(--text-muted); font-size:0.85rem">
                  <span class="spinner-border spinner-border-sm me-2"></span>Uploading…
                </div>
                <div v-if="cvExists" class="mt-3">
                  <a href="/api/download/cv" target="_blank" rel="noopener"
                    class="btn btn-outline-glow btn-sm">
                    <i class="bi bi-download me-1"></i>Download current CV
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="glass-card p-4 mb-4">
            <h6 class="mb-3"><i class="bi bi-file-text me-2"></i>About Section</h6>
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label-custom">Heading</label>
                <input v-model="aboutForm.heading" class="form-input" placeholder="About Me" />
              </div>
              <div class="col-12">
                <label class="form-label-custom">Paragraphs (one per line)</label>
                <!--
                  Paragraphs convention: textarea where each line is one paragraph.
                  On save, split by newline, trim each, drop empty lines.
                -->
                <textarea v-model="aboutForm.paragraphsRaw" class="form-input" rows="5"
                  placeholder="First paragraph&#10;Second paragraph&#10;Third paragraph"></textarea>
                <small style="color:var(--text-muted)">
                  Each line becomes one paragraph in the About section.
                </small>
              </div>
              <div class="col-sm-6">
                <label class="form-label-custom">Tech Heading</label>
                <input v-model="aboutForm.techHeading" class="form-input" placeholder="Technologies I work with" />
              </div>
              <div class="col-sm-6">
                <label class="form-label-custom">Tech List (comma separated)</label>
                <input v-model="aboutForm.techListRaw" class="form-input"
                  placeholder="Vue.js, Node.js, TypeScript, Docker" />
              </div>
              <div class="col-12 d-flex gap-2">
                <button type="button" class="btn btn-glow" :disabled="savingAbout" @click="saveAbout">
                  <span v-if="savingAbout" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-check2 me-1"></i>Save About
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── CONTACT TAB ── -->
        <div v-if="activeTab === 'contact'">
          <h5 class="mb-4">Contact Information</h5>

          <div v-if="status.text && status.scope === 'contact'" class="status-msg" :class="status.type">
            <i :class="status.type === 'success' ? 'bi bi-check-circle' : 'bi bi-x-circle'" class="me-2"></i>{{ status.text }}
          </div>

          <div class="glass-card p-4">
            <div class="row g-3">
              <div class="col-sm-6">
                <label class="form-label-custom">Email</label>
                <input v-model="contactForm.email" class="form-input" type="email"
                  placeholder="you@example.com" />
              </div>
              <div class="col-sm-6">
                <label class="form-label-custom">Phone</label>
                <input v-model="contactForm.phone" class="form-input"
                  placeholder="+1 555 123 4567" />
              </div>
              <div class="col-12">
                <label class="form-label-custom">Location</label>
                <input v-model="contactForm.location" class="form-input"
                  placeholder="San Francisco, CA" />
              </div>
              <div class="col-sm-6">
                <label class="form-label-custom">GitHub URL</label>
                <input v-model="contactForm.github" class="form-input"
                  placeholder="https://github.com/username" />
              </div>
              <div class="col-sm-6">
                <label class="form-label-custom">Telegram URL</label>
                <input v-model="contactForm.telegram" class="form-input"
                  placeholder="https://t.me/username" />
              </div>
              <div class="col-12">
                <label class="form-label-custom">LinkedIn URL</label>
                <input v-model="contactForm.linkedin" class="form-input"
                  placeholder="https://linkedin.com/in/username" />
              </div>
              <div class="col-12 d-flex gap-2">
                <button type="button" class="btn btn-glow" :disabled="savingContact" @click="saveContact">
                  <span v-if="savingContact" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-check2 me-1"></i>Save Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── PROJECT MODAL ── -->
    <div v-if="showProjectModal" class="modal-overlay" @click.self="showProjectModal = false">
      <div class="glass-card modal-box p-4">
        <h5 class="mb-4">{{ editingProject?.id ? 'Edit Project' : 'Add New Project' }}</h5>
        <form @submit.prevent="saveProject">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label-custom">Title *</label>
              <input v-model="projectForm.title" class="form-input" required placeholder="Project title" />
            </div>
            <div class="col-12">
              <label class="form-label-custom">Description *</label>
              <textarea v-model="projectForm.description" class="form-input" rows="3" required placeholder="Short description"></textarea>
            </div>
            <div class="col-12">
              <label class="form-label-custom">Tags (comma separated)</label>
              <input v-model="projectForm.tagsRaw" class="form-input" placeholder="Vue.js, Node.js, Bootstrap" />
            </div>
            <div class="col-sm-6">
              <label class="form-label-custom">GitHub URL</label>
              <input v-model="projectForm.github" class="form-input" placeholder="https://github.com/..." />
            </div>
            <div class="col-sm-6">
              <label class="form-label-custom">Live URL</label>
              <input v-model="projectForm.live" class="form-input" placeholder="https://..." />
            </div>

            <!-- Image upload + URL fallback -->
            <div class="col-sm-7">
              <label class="form-label-custom">Thumbnail File</label>
              <input ref="projectFileInput" type="file" accept="image/*" class="form-input"
                @change="handleProjectImageChange" />
              <small style="color:var(--text-muted)">
                Uploads on select (max 5 MB).
              </small>
              <div v-if="uploadingProjectImage" class="mt-1" style="color:var(--text-muted); font-size:0.85rem">
                <span class="spinner-border spinner-border-sm me-2"></span>Uploading…
              </div>
            </div>
            <div class="col-sm-5">
              <label class="form-label-custom">Image URL (optional)</label>
              <input v-model="projectForm.image" class="form-input" placeholder="https://..." />
              <small style="color:var(--text-muted)">
                External URL fallback if you don't upload a file.
              </small>
            </div>
            <div class="col-12">
              <label class="form-label-custom">Preview</label>
              <div class="image-preview-box image-preview-wide">
                <img v-if="projectForm.image || projectImagePreview"
                  :src="projectImagePreview || projectForm.image" alt="Project preview" />
                <div v-else class="image-preview-placeholder">
                  <i class="bi bi-image"></i>
                  <span>No image</span>
                </div>
              </div>
            </div>

            <div class="col-12">
              <label class="d-flex align-items-center gap-2" style="cursor:pointer">
                <input type="checkbox" v-model="projectForm.featured" style="accent-color:var(--accent-cyan)" />
                <span style="color:var(--text-muted); font-size:0.9rem">Mark as Featured</span>
              </label>
            </div>
            <div class="col-12 d-flex gap-2">
              <button type="submit" class="btn btn-glow" :disabled="savingProject">
                <span v-if="savingProject" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-check2 me-1"></i>Save
              </button>
              <button type="button" class="btn btn-outline-glow" @click="showProjectModal = false">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- ── SKILL MODAL ── -->
    <div v-if="showSkillModal" class="modal-overlay" @click.self="showSkillModal = false">
      <div class="glass-card modal-box p-4">
        <h5 class="mb-4">{{ editingSkill?.id ? 'Edit Skill' : 'Add New Skill' }}</h5>
        <form @submit.prevent="saveSkill">
          <div class="row g-3">
            <div class="col-sm-6">
              <label class="form-label-custom">Name *</label>
              <input v-model="skillForm.name" class="form-input" required placeholder="JavaScript" />
            </div>
            <div class="col-sm-6">
              <label class="form-label-custom">Category *</label>
              <select v-model="skillForm.category" class="form-input">
                <option>Languages</option>
                <option>Frameworks</option>
                <option>Tools</option>
                <option>Other</option>
              </select>
            </div>
            <div class="col-sm-6">
              <label class="form-label-custom">Level (0–100): {{ skillForm.level }}%</label>
              <input type="range" v-model.number="skillForm.level" min="0" max="100"
                class="w-100" style="accent-color:var(--accent-cyan)" />
            </div>
            <div class="col-sm-6">
              <label class="form-label-custom">Icon (emoji)</label>
              <input v-model="skillForm.icon" class="form-input" placeholder="🔥" />
            </div>
            <div class="col-12 d-flex gap-2">
              <button type="submit" class="btn btn-glow" :disabled="savingSkill">
                <span v-if="savingSkill" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-check2 me-1"></i>Save
              </button>
              <button type="button" class="btn btn-outline-glow" @click="showSkillModal = false">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

// ── Auth ──────────────────────────────────────────────────────
const token      = ref(localStorage.getItem('admin_token') || '')
const password   = ref('')
const loginError = ref(null)
const loggingIn  = ref(false)

async function login() {
  loggingIn.value = true
  loginError.value = null
  try {
    const res = await axios.post('/api/auth/login', { password: password.value })
    token.value = res.data.token
    localStorage.setItem('admin_token', token.value)
    password.value = ''
    fetchAll()
    fetchSettings()
    fetchAbout()
    fetchContact()
    checkCvStatus()
  } catch {
    loginError.value = 'Invalid password. Please try again.'
  } finally {
    loggingIn.value = false
  }
}

function logout() {
  token.value = ''
  localStorage.removeItem('admin_token')
}

function authHeaders() {
  return { headers: { Authorization: `Bearer ${token.value}` } }
}

// ── Status messages ───────────────────────────────────────────
const status = reactive({ text: '', type: 'success', scope: '' })
let statusTimer = null

function showStatus(text, type, scope) {
  status.text  = text
  status.type  = type
  status.scope = scope
  if (statusTimer) clearTimeout(statusTimer)
  statusTimer = setTimeout(() => {
    status.text = ''
  }, 4000)
}

// ── State ─────────────────────────────────────────────────────
const activeTab = ref('projects')
const projects  = ref([])
const skills    = ref([])

// Hero form (POST /api/settings)
const heroForm = reactive({
  greeting: 'Hi, my name is',
  name: '',
  titlesRaw: '',
  bio: ''
})
const savingHero = ref(false)

// About form (POST /api/about)
const aboutForm = reactive({
  heading: '',
  paragraphsRaw: '',
  techHeading: '',
  techListRaw: '',
  profilePhoto: ''
})
const savingAbout = ref(false)
const uploadingProfile = ref(false)
const profileFileInput = ref(null)

// CV / Resume upload state
const cvExists         = ref(false)
const cvStatusLoading  = ref(false)
const uploadingCv      = ref(false)
const cvFileInput      = ref(null)

// Contact form (POST /api/contact)
const contactForm = reactive({
  email: '',
  phone: '',
  location: '',
  github: '',
  telegram: '',
  linkedin: ''
})
const savingContact = ref(false)

async function fetchAll() {
  const [p, s] = await Promise.all([
    axios.get('/api/projects'),
    axios.get('/api/skills')
  ])
  projects.value = p.data
  skills.value   = s.data
}

async function fetchSettings() {
  try {
    const res = await axios.get('/api/settings')
    heroForm.greeting  = res.data.greeting ?? ''
    heroForm.name      = res.data.name ?? ''
    heroForm.titlesRaw = (res.data.titles || []).join(', ')
    heroForm.bio       = res.data.bio ?? ''
  } catch (err) {
    console.error('Failed to load settings', err)
  }
}

async function fetchAbout() {
  try {
    const res = await axios.get('/api/about')
    aboutForm.heading       = res.data.heading ?? ''
    // Paragraphs convention: stored as array; edited as newline-separated string.
    aboutForm.paragraphsRaw = (res.data.paragraphs || []).join('\n')
    aboutForm.techHeading   = res.data.techHeading ?? ''
    aboutForm.techListRaw   = (res.data.techList || []).join(', ')
    aboutForm.profilePhoto  = res.data.profilePhoto ?? ''
  } catch (err) {
    console.error('Failed to load about', err)
  }
}

async function fetchContact() {
  try {
    const res = await axios.get('/api/contact')
    Object.assign(contactForm, {
      email:    res.data.email    ?? '',
      phone:    res.data.phone    ?? '',
      location: res.data.location ?? '',
      github:   res.data.github   ?? '',
      telegram: res.data.telegram ?? '',
      linkedin: res.data.linkedin ?? ''
    })
  } catch (err) {
    console.error('Failed to load contact', err)
  }
}

onMounted(() => {
  if (token.value) {
    fetchAll()
    fetchSettings()
    fetchAbout()
    fetchContact()
    checkCvStatus()
  }
})

// ── Save: Hero (POST /api/settings) ───────────────────────────
async function saveHero() {
  savingHero.value = true
  try {
    const payload = {
      greeting: heroForm.greeting,
      name:     heroForm.name,
      titles:   heroForm.titlesRaw.split(',').map(t => t.trim()).filter(Boolean),
      bio:      heroForm.bio
    }
    await axios.post('/api/settings', payload, authHeaders())
    showStatus('Hero section saved.', 'success', 'about')
  } catch (err) {
    showStatus('Failed to save hero: ' + (err.response?.data?.error || err.message), 'error', 'about')
  } finally {
    savingHero.value = false
  }
}

// ── Save: About (POST /api/about) ────────────────────────────
async function saveAbout() {
  savingAbout.value = true
  try {
    // Paragraphs convention: split textarea by newline, trim, drop empty lines.
    const paragraphs = aboutForm.paragraphsRaw
      .split('\n')
      .map(p => p.trim())
      .filter(Boolean)
    const techList = aboutForm.techListRaw
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
    const payload = {
      heading:      aboutForm.heading,
      paragraphs,
      techHeading:  aboutForm.techHeading,
      techList,
      profilePhoto: aboutForm.profilePhoto
    }
    await axios.post('/api/about', payload, authHeaders())
    showStatus('About section saved.', 'success', 'about')
  } catch (err) {
    showStatus('Failed to save about: ' + (err.response?.data?.error || err.message), 'error', 'about')
  } finally {
    savingAbout.value = false
  }
}

// ── Save: Contact (POST /api/contact) ────────────────────────
async function saveContact() {
  savingContact.value = true
  try {
    await axios.post('/api/contact', { ...contactForm }, authHeaders())
    showStatus('Contact info saved.', 'success', 'contact')
  } catch (err) {
    showStatus('Failed to save contact: ' + (err.response?.data?.error || err.message), 'error', 'contact')
  } finally {
    savingContact.value = false
  }
}

// ── Profile photo upload ──────────────────────────────────────
async function handleProfilePhotoChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  uploadingProfile.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await axios.post('/api/upload/profile', formData, {
      headers: { Authorization: `Bearer ${token.value}` }
      // Do NOT set Content-Type; axios will add the multipart boundary.
    })
    aboutForm.profilePhoto = res.data.url
    showStatus('Profile photo uploaded.', 'success', 'about')
  } catch (err) {
    showStatus('Profile photo upload failed: ' + (err.response?.data?.error || err.message), 'error', 'about')
  } finally {
    uploadingProfile.value = false
    // Clear the file input so re-selecting the same file works.
    if (profileFileInput.value) profileFileInput.value.value = ''
  }
}

// ── CV / Resume upload ────────────────────────────────────────
async function checkCvStatus() {
  cvStatusLoading.value = true
  try {
    // HEAD request avoids downloading the PDF body just to check existence.
    const res = await fetch('/api/download/cv', { method: 'HEAD' })
    cvExists.value = res.ok
  } catch {
    cvExists.value = false
  } finally {
    cvStatusLoading.value = false
  }
}

async function handleCvFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  // Client-side guards give faster feedback; the server still re-validates.
  if (file.type !== 'application/pdf') {
    showStatus('Only PDF files are allowed.', 'error', 'about')
    if (cvFileInput.value) cvFileInput.value.value = ''
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    showStatus('CV file too large (max 10 MB).', 'error', 'about')
    if (cvFileInput.value) cvFileInput.value.value = ''
    return
  }
  uploadingCv.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await axios.post('/api/upload/cv', formData, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    showStatus(res.data?.message || 'CV uploaded successfully.', 'success', 'about')
    cvExists.value = true
  } catch (err) {
    showStatus('CV upload failed: ' + (err.response?.data?.error || err.message), 'error', 'about')
  } finally {
    uploadingCv.value = false
    if (cvFileInput.value) cvFileInput.value.value = ''
  }
}

// ── Projects CRUD ─────────────────────────────────────────────
const showProjectModal = ref(false)
const editingProject   = ref(null)
const savingProject    = ref(false)
const projectFileInput = ref(null)
const projectImagePreview = ref('')

const projectForm = reactive({
  title: '',
  description: '',
  tagsRaw: '',
  github: '',
  live: '',
  image: '',
  featured: false
})

function openProjectModal(project = null) {
  editingProject.value = project
  projectImagePreview.value = ''
  if (project) {
    Object.assign(projectForm, { ...project, tagsRaw: project.tags?.join(', ') || '' })
  } else {
    Object.assign(projectForm, { title: '', description: '', tagsRaw: '', github: '', live: '', image: '', featured: false })
  }
  showProjectModal.value = true
}

async function handleProjectImageChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  // Show instant local preview while uploading.
  const reader = new FileReader()
  reader.onload = (e) => { projectImagePreview.value = e.target.result }
  reader.readAsDataURL(file)

  uploadingProjectImage.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await axios.post('/api/upload/project', formData, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    // Replace local preview with the server URL and set as the project's image.
    projectImagePreview.value = ''
    projectForm.image = res.data.url
    showStatus('Image uploaded.', 'success', 'projects')
  } catch (err) {
    projectImagePreview.value = ''
    showStatus('Image upload failed: ' + (err.response?.data?.error || err.message), 'error', 'projects')
  } finally {
    uploadingProjectImage.value = false
    if (projectFileInput.value) projectFileInput.value.value = ''
  }
}
const uploadingProjectImage = ref(false)

async function saveProject() {
  savingProject.value = true
  try {
    const payload = {
      ...projectForm,
      tags: projectForm.tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
    }
    delete payload.tagsRaw
    if (editingProject.value?.id) {
      await axios.put(`/api/projects/${editingProject.value.id}`, payload, authHeaders())
    } else {
      await axios.post('/api/projects', payload, authHeaders())
    }
    showStatus('Project saved.', 'success', 'projects')
    showProjectModal.value = false
    fetchAll()
  } catch (err) {
    showStatus('Failed to save project: ' + (err.response?.data?.error || err.message), 'error', 'projects')
  } finally {
    savingProject.value = false
  }
}

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return
  try {
    await axios.delete(`/api/projects/${id}`, authHeaders())
    showStatus('Project deleted.', 'success', 'projects')
    fetchAll()
  } catch (err) {
    showStatus('Failed to delete project: ' + (err.response?.data?.error || err.message), 'error', 'projects')
  }
}

// ── Skills CRUD ───────────────────────────────────────────────
const showSkillModal = ref(false)
const editingSkill   = ref(null)
const savingSkill    = ref(false)
const skillForm      = reactive({ name: '', category: 'Languages', level: 75, icon: '' })

function openSkillModal(skill = null) {
  editingSkill.value = skill
  if (skill) {
    Object.assign(skillForm, skill)
  } else {
    Object.assign(skillForm, { name: '', category: 'Languages', level: 75, icon: '' })
  }
  showSkillModal.value = true
}

async function saveSkill() {
  savingSkill.value = true
  try {
    if (editingSkill.value?.id) {
      await axios.put(`/api/skills/${editingSkill.value.id}`, skillForm, authHeaders())
    } else {
      await axios.post('/api/skills', skillForm, authHeaders())
    }
    showStatus('Skill saved.', 'success', 'skills')
    showSkillModal.value = false
    fetchAll()
  } catch (err) {
    showStatus('Failed to save skill: ' + (err.response?.data?.error || err.message), 'error', 'skills')
  } finally {
    savingSkill.value = false
  }
}

async function deleteSkill(id) {
  if (!confirm('Delete this skill?')) return
  try {
    await axios.delete(`/api/skills/${id}`, authHeaders())
    showStatus('Skill deleted.', 'success', 'skills')
    fetchAll()
  } catch (err) {
    showStatus('Failed to delete skill: ' + (err.response?.data?.error || err.message), 'error', 'skills')
  }
}

// Clear status when switching tabs so messages don't linger.
watch(activeTab, () => { status.text = '' })
</script>

<style scoped>
.admin-panel { min-height: 100vh; background: var(--bg-primary); }

/* Login */
.login-screen { min-height: 100vh; }
.login-card { max-width: 420px; width: 100%; }
.login-icon {
  width: 64px; height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
  display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem; color: #fff;
  margin: 0 auto;
}

/* Topbar */
.admin-topbar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-glow);
  position: sticky; top: 0; z-index: 100;
}

/* Tabs */
.tab-btn {
  background: var(--bg-card);
  color: var(--text-muted);
  border: 1px solid var(--border-glow);
  border-radius: 10px;
  padding: 0.45rem 1.2rem;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active,
.tab-btn:hover {
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
  color: #fff;
  border-color: transparent;
}

/* Progress (reuse from Skills) */
.progress-track {
  height: 5px;
  background: rgba(255,255,255,0.08);
  border-radius: 10px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s ease;
}
.fill-expert { background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple)); }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}
.modal-box { max-width: 640px; width: 100%; max-height: 90vh; overflow-y: auto; }

/* Form inputs */
.form-label-custom {
  display: block;
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 500;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}
.form-input {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border-glow);
  border-radius: 8px;
  color: var(--text-primary);
  padding: 0.6rem 0.9rem;
  font-size: 0.9rem;
  font-family: var(--font-main);
  resize: vertical;
}
.form-input:focus {
  outline: none;
  border-color: var(--accent-cyan);
  box-shadow: 0 0 0 3px rgba(0,212,255,0.1);
}
.form-input[type="file"] {
  padding: 0.45rem 0.6rem;
  font-size: 0.85rem;
}
select.form-input { cursor: pointer; }
option { background: var(--bg-card); }

/* Status messages */
.status-msg {
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 0.88rem;
  margin-bottom: 1rem;
}
.status-msg.success {
  background: rgba(0, 200, 120, 0.08);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.25);
}
.status-msg.error {
  background: rgba(255, 0, 80, 0.08);
  color: #ff4466;
  border: 1px solid rgba(255, 0, 80, 0.2);
}

/* Image preview boxes */
.image-preview-box {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: rgba(255,255,255,0.03);
  border: 1px dashed var(--border-glow);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-preview-wide {
  aspect-ratio: 16 / 9;
}
.image-preview-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.image-preview-placeholder {
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
}
.image-preview-placeholder i { font-size: 1.8rem; opacity: 0.6; }

/* CV status box (mirrors image-preview-box without the square aspect ratio) */
.cv-status-box {
  width: 100%;
  min-height: 140px;
  background: rgba(255,255,255,0.03);
  border: 1px dashed var(--border-glow);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 1rem;
}
.cv-status-label {
  font-size: 0.85rem;
  font-weight: 500;
}
.cv-status-label.success { color: #4ade80; }
.cv-status-label.muted   { color: var(--text-muted); }

/* ---------- Responsive ---------- */
@media (max-width: 768px) {
  .admin-topbar {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .admin-tabs {
    padding: 0.75rem 1rem;
    gap: 0.5rem;
  }

  .tab-btn {
    flex: 1 1 auto;
    min-width: 0;
    padding: 0.5rem 0.8rem;
    font-size: 0.82rem;
  }

  .admin-content {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }

  .modal-box {
    padding: 1.25rem !important;
    max-height: 95vh;
  }

  .form-input {
    font-size: 16px; /* prevents iOS zoom on focus */
    padding: 0.65rem 0.85rem;
    min-height: 44px; /* touch-friendly */
  }

  textarea.form-input {
    min-height: 80px;
  }

  .image-preview-box {
    max-width: 220px;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .login-card {
    margin: 0 1rem;
    padding: 1.5rem !important;
  }

  .tab-btn {
    font-size: 0.78rem;
    padding: 0.45rem 0.6rem;
  }

  .admin-content .row > [class*="col-"] {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
