<template>
  <section id="projects" class="projects section-padding">
    <div class="container">
      <h2 class="section-label">Featured Projects</h2>
      <h3 class="section-title">Some things I've <span>built</span></h3>
      
      <div class="projects-grid" v-if="!loading">
        <div class="project-card" v-for="project in projects" :key="project.id">
          <div class="project-image">
            <div v-if="!project.image" class="image-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <img v-else :src="resolveImageSrc(project.image)" :alt="project.title" />
            <span v-if="project.featured" class="featured-badge">Featured</span>
          </div>
          <div class="project-content">
            <h4 class="project-title">{{ project.title }}</h4>
            <p class="project-desc">{{ project.description }}</p>
            <div class="project-tags">
              <span class="tag" v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
            <div class="project-links">
              <a v-if="project.github" :href="project.github" target="_blank" class="project-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Code
              </a>
              <a v-if="project.live" :href="project.live" target="_blank" class="project-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Live
              </a>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="loading">
        <div class="spinner"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const projects = ref([])
const loading = ref(true)

async function fetchProjects() {
  try {
    const res = await axios.get('/api/projects')
    projects.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    console.warn('Failed to fetch projects', e?.message || e)
  } finally {
    loading.value = false
  }
}

/**
 * Resolve an image value from a project record into a usable <img src>.
 * - Empty / falsy → handled by template (placeholder)
 * - Full http(s) URL → use as-is
 * - Bare path starting with /uploads/ → keep as-is; browser resolves against
 *   current origin. In production the SPA and uploads share an origin
 *   (nginx), in dev the Vite proxy passes /api through and uploads are
 *   served by the backend on the same origin in normal setups.
 */
function resolveImageSrc(image) {
  if (!image) return ''
  if (/^https?:\/\//i.test(image)) return image
  if (image.startsWith('/')) return image
  return `/${image}`
}

onMounted(fetchProjects)
</script>

<style scoped>
.projects {
  background: var(--bg-secondary);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.project-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: all 0.3s ease;
}

.project-card:hover {
  border-color: var(--border-light);
  transform: translateY(-4px);
}

.project-image {
  position: relative;
  height: 200px;
  background: var(--bg-tertiary);
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.project-card:hover .project-image img {
  transform: scale(1.06);
}

.project-card:hover .project-image .image-placeholder {
  color: var(--accent);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.featured-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  background: var(--accent);
  color: white;
  border-radius: 100px;
  text-transform: uppercase;
}

.project-content {
  padding: 24px;
}

.project-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.project-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.project-links {
  display: flex;
  gap: 16px;
}

.project-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.project-link:hover {
  color: var(--accent);
}

.loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet: 2 columns */
@media (min-width: 769px) and (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .project-image {
    height: 180px;
  }
}

/* Small phones — tighten project card spacing */
@media (max-width: 480px) {
  .project-content {
    padding: 20px;
  }

  .project-title {
    font-size: 16px;
  }

  .project-desc {
    font-size: 13px;
  }

  .project-links {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
