<template>
  <section id="about" class="about section-padding">
    <div class="container">
      <h2 class="section-label">About Me</h2>
      <h3 class="section-title">{{ heading }}</h3>

      <div class="about-content">
        <div class="about-text">
          <p v-for="(paragraph, idx) in paragraphs" :key="idx">
            {{ paragraph }}
          </p>
          <p class="tech-heading">{{ techHeading }}</p>
          <ul class="tech-list">
            <li v-for="(tech, idx) in techList" :key="idx">{{ tech }}</li>
          </ul>
        </div>

        <div class="about-image">
          <div class="image-wrapper glass-card">
            <img :src="profilePhotoSrc" :alt="name" class="profile-photo" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import profileFallback from '../assets/profile.jpg'

const DEFAULTS = {
  heading: "Hello! I'm Toek Sopanha",
  paragraphs: [
    'I am Toek Sopanha, a dedicated student majoring in Management Information Systems (MIS) at Setec Institute, with expertise spanning software engineering, network infrastructure, cloud platforms, and DevOps practices. My journey into technology has been driven by a passion for building reliable, scalable, and secure systems that power modern businesses.',
    'I specialize in full-stack development, network design and administration, cloud architecture (AWS, Azure, GCP), and implementing CI/CD pipelines. With hands-on experience in automation, containerization, and infrastructure as code, I help organizations streamline their development and operations workflows.'
  ],
  techHeading: "Here are a few technologies I've been working with recently:",
  techList: [
    'Python & JavaScript',
    'Docker & Kubernetes',
    'AWS & Azure & GCP',
    'Terraform & Ansible',
    'Jenkins & GitHub Actions',
    'Vue.js & React',
    'Linux & Networking',
    'CI/CD & Git'
  ],
  profilePhoto: '',
  name: 'Toek Sopanha'
}

const heading = ref(DEFAULTS.heading)
const paragraphs = ref([...DEFAULTS.paragraphs])
const techHeading = ref(DEFAULTS.techHeading)
const techList = ref([...DEFAULTS.techList])
const profilePhoto = ref(DEFAULTS.profilePhoto)
const name = ref(DEFAULTS.name)

const FALLBACK_PROFILE_SRC = profileFallback

const profilePhotoSrc = ref(FALLBACK_PROFILE_SRC)

async function fetchAbout() {
  try {
    const res = await axios.get('/api/about')
    const data = res.data || {}
    if (data.heading) heading.value = data.heading
    if (Array.isArray(data.paragraphs) && data.paragraphs.length > 0) {
      paragraphs.value = data.paragraphs
    }
    if (data.techHeading) techHeading.value = data.techHeading
    if (Array.isArray(data.techList) && data.techList.length > 0) {
      techList.value = data.techList
    }
    profilePhoto.value = data.profilePhoto || ''

    if (profilePhoto.value) {
      // The browser resolves the path against the current origin. Vite's dev server
      // proxies /api to the backend; uploads in production are served by the same
      // origin (nginx) as the SPA, so a bare path works in both environments.
      profilePhotoSrc.value = profilePhoto.value.startsWith('/')
        ? profilePhoto.value
        : `/${profilePhoto.value}`
    } else {
      profilePhotoSrc.value = FALLBACK_PROFILE_SRC
    }
  } catch (e) {
    console.warn('Failed to fetch /api/about, using fallback content.', e?.message || e)
  }
}

fetchAbout()
</script>

<style scoped>
.about {
  background: var(--bg-secondary);
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 60px;
  align-items: start;
  margin-top: 40px;
}

.about-text p {
  color: var(--text-secondary);
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.8;
}

.tech-heading {
  color: var(--text-primary) !important;
  font-weight: 500;
  margin-top: 24px;
}

.tech-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 24px;
  list-style: none;
  margin-top: 16px;
}

.tech-list li {
  position: relative;
  padding-left: 20px;
  color: var(--text-secondary);
  font-size: 14px;
}

.tech-list li::before {
  content: '▹';
  position: absolute;
  left: 0;
  color: var(--accent);
}

.about-image {
  position: static;
  top: 120px;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  width: 290px;
  height: 350px;
  border-radius: var(--radius);
  padding: 0;
}

.image-wrapper::before {
  content: '';
  position: absolute;
  inset: -12px;
  border: 2px solid var(--accent);
  border-radius: calc(var(--radius) + 8px);
  opacity: 0.4;
  pointer-events: none;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: var(--bg-tertiary);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius);
}

@media (max-width: 900px) {
  .about-content {
    grid-template-columns: 1fr;
  }

  .about-image {
    order: -1;
    display: flex;
    justify-content: center;
  }

  .image-wrapper {
    width: 200px;
    height: 200px;
  }
}

@media (max-width: 639px) {
  .tech-list {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .about-text p {
    font-size: 15px;
    line-height: 1.7;
  }

  .image-wrapper {
    width: 180px;
    height: 180px;
  }

  .about-content {
    gap: 40px;
  }
}
</style>
