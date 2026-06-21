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
      <div class="admin-tabs d-flex gap-2 px-4 py-3">
        <button class="tab-btn" :class="{ active: activeTab === 'projects' }"
          @click="activeTab = 'projects'">
          <i class="bi bi-folder2-open me-2"></i>Projects
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'skills' }"
          @click="activeTab = 'skills'">
          <i class="bi bi-lightning me-2"></i>Skills
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
            <div class="col-12">
              <label class="form-label-custom">Image URL</label>
              <input v-model="projectForm.image" class="form-input" placeholder="https://..." />
            </div>
            <div class="col-12">
              <label class="d-flex align-items-center gap-2" style="cursor:pointer">
                <input type="checkbox" v-model="projectForm.featured" style="accent-color:var(--accent-cyan)" />
                <span style="color:var(--text-muted); font-size:0.9rem">Mark as Featured</span>
              </label>
            </div>
            <div class="col-12 d-flex gap-2">
              <button type="submit" class="btn btn-glow">
                <i class="bi bi-check2 me-1"></i>Save
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
              <button type="submit" class="btn btn-glow">
                <i class="bi bi-check2 me-1"></i>Save
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
import { ref, reactive, onMounted } from 'vue'
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

// ── State ─────────────────────────────────────────────────────
const activeTab = ref('projects')
const projects  = ref([])
const skills    = ref([])

async function fetchAll() {
  const [p, s] = await Promise.all([
    axios.get('/api/projects'),
    axios.get('/api/skills')
  ])
  projects.value = p.data
  skills.value   = s.data
}

onMounted(() => { if (token.value) fetchAll() })

// ── Projects CRUD ─────────────────────────────────────────────
const showProjectModal = ref(false)
const editingProject   = ref(null)
const projectForm      = reactive({ title: '', description: '', tagsRaw: '', github: '', live: '', image: '', featured: false })

function openProjectModal(project = null) {
  editingProject.value = project
  if (project) {
    Object.assign(projectForm, { ...project, tagsRaw: project.tags?.join(', ') || '' })
  } else {
    Object.assign(projectForm, { title: '', description: '', tagsRaw: '', github: '', live: '', image: '', featured: false })
  }
  showProjectModal.value = true
}

async function saveProject() {
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
  showProjectModal.value = false
  fetchAll()
}

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return
  await axios.delete(`/api/projects/${id}`, authHeaders())
  fetchAll()
}

// ── Skills CRUD ───────────────────────────────────────────────
const showSkillModal = ref(false)
const editingSkill   = ref(null)
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
  if (editingSkill.value?.id) {
    await axios.put(`/api/skills/${editingSkill.value.id}`, skillForm, authHeaders())
  } else {
    await axios.post('/api/skills', skillForm, authHeaders())
  }
  showSkillModal.value = false
  fetchAll()
}

async function deleteSkill(id) {
  if (!confirm('Delete this skill?')) return
  await axios.delete(`/api/skills/${id}`, authHeaders())
  fetchAll()
}
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
.modal-box { max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; }

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
select.form-input { cursor: pointer; }
option { background: var(--bg-card); }

.status-msg.error {
  background: rgba(255,0,80,0.08);
  color: #ff4466;
  border: 1px solid rgba(255,0,80,0.2);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 0.88rem;
}
</style>
