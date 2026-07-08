<template>
  <section id="hero" class="hero">
    <GradientBackground variant="hero" />

    <div class="hero-bg">
      <div class="floating-icons">
        <div
          v-for="(icon, index) in floatingIcons"
          :key="index"
          class="floating-icon"
          :style="getFloatingStyle(index)"
        >
          <img :src="icon.url" :alt="icon.name" />
        </div>
      </div>
    </div>
    <div class="container hero-content">
      <div class="hero-text">
        <p class="greeting fade-in-up">{{ greeting }}</p>
        <h1 class="name fade-in-up" style="animation-delay: 0.1s">
          {{ name }}<span class="dot">.</span>
        </h1>
        <h2 class="title fade-in-up" style="animation-delay: 0.2s">
          I build <span class="typed-text gradient-text">{{ displayedText }}</span><span class="cursor">|</span>
        </h2>
        <p class="bio fade-in-up" style="animation-delay: 0.3s">
          {{ bio }}
        </p>
        <div class="cta fade-in-up" style="animation-delay: 0.4s">
          <a href="#projects" class="btn-gradient">Check my work</a>
          <a href="/api/download/cv" class="btn btn-outline" download>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download CV
          </a>
        </div>
      </div>
    </div>
    <div class="scroll-indicator">
      <div class="scroll-line"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import GradientBackground from './GradientBackground.vue'

// Default fallback content used if /api/settings fails or returns empty fields.
const DEFAULTS = {
  greeting: "Hi, my name is",
  name: 'Toek Sopanha',
  titles: [
    'software solutions',
    'cloud infrastructure',
    'CI/CD pipelines',
    'network architectures',
    'automation scripts',
    'scalable systems'
  ],
  bio: "I'm a multi-disciplinary engineer specializing in software development, networking, cloud infrastructure, and DevOps. I build scalable applications, design robust networks, manage cloud environments, and automate deployment pipelines. With a passion for creating efficient, reliable, and secure systems, I deliver end-to-end solutions that drive business value."
}

const greeting = ref(DEFAULTS.greeting)
const name = ref(DEFAULTS.name)
const bio = ref(DEFAULTS.bio)
const titles = ref([...DEFAULTS.titles])

const displayedText = ref('')
let titleIndex = 0
let charIndex = 0
let isDeleting = false

const iconBase = 'https://raw.githubusercontent.com/devicons/devicon/master/icons'

const floatingIcons = [
  { name: 'Python', url: `${iconBase}/python/python-original.svg` },
  { name: 'JavaScript', url: `${iconBase}/javascript/javascript-original.svg` },
  { name: 'Docker', url: `${iconBase}/docker/docker-original.svg` },
  { name: 'Nodejs', url: `${iconBase}/nodejs/nodejs-original.svg` },
  { name: 'Amazonwebservices', url: `${iconBase}/amazonwebservices/amazonwebservices-original-wordmark.svg` },
  { name: 'Vuejs', url: `${iconBase}/vuejs/vuejs-original.svg` },
  { name: 'React', url: `${iconBase}/react/react-original.svg` },
  { name: 'Linux', url: `${iconBase}/linux/linux-original.svg` },
  { name: 'Git', url: `${iconBase}/git/git-original.svg` },
  { name: 'Kubernetes', url: `${iconBase}/kubernetes/kubernetes-original.svg` },
  { name: 'Terraform', url: `${iconBase}/terraform/terraform-original.svg` },
  { name: 'Ansible', url: `${iconBase}/ansible/ansible-original.svg` },
]

function getFloatingStyle(index) {
  const total = floatingIcons.length
  const baseAngle = (index / total) * 2 * Math.PI
  const radius = 15 + (index % 3) * 12
  const duration = 25 + (index % 4) * 8
  const delay = index * -5

  return {
    left: `${50 + Math.cos(baseAngle) * radius}%`,
    top: `${50 + Math.sin(baseAngle) * radius}%`,
    width: `${22 + (index % 4) * 4}px`,
    height: `${22 + (index % 4) * 4}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 0.12
  }
}

function typeEffect() {
  const list = titles.value
  if (!list || list.length === 0) return

  const current = list[titleIndex % list.length]

  if (!isDeleting) {
    displayedText.value = current.substring(0, charIndex + 1)
    charIndex++
    if (charIndex === current.length) {
      isDeleting = true
      setTimeout(typeEffect, 2000)
      return
    }
  } else {
    displayedText.value = current.substring(0, charIndex - 1)
    charIndex--
    if (charIndex === 0) {
      isDeleting = false
      titleIndex = (titleIndex + 1) % list.length
    }
  }
  setTimeout(typeEffect, isDeleting ? 50 : 100)
}

async function fetchSettings() {
  try {
    const res = await axios.get('/api/settings')
    const data = res.data || {}
    if (data.greeting) greeting.value = data.greeting
    if (data.name) name.value = data.name
    if (data.bio) bio.value = data.bio
    if (Array.isArray(data.titles) && data.titles.length > 0) {
      titles.value = data.titles
      // Reset typing effect to the start of the new list.
      titleIndex = 0
      charIndex = 0
      isDeleting = false
      displayedText.value = ''
    }
  } catch (e) {
    // Fallback content is already in place; log for diagnostics.
    console.warn('Failed to fetch /api/settings, using fallback content.', e?.message || e)
  }
}

onMounted(async () => {
  await fetchSettings()
  setTimeout(typeEffect, 500)
})
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding-top: 80px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.1), transparent),
    radial-gradient(ellipse 60% 40% at 100% 50%, rgba(59, 130, 246, 0.06), transparent);
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.floating-icons {
  position: absolute;
  inset: 0;
}

.floating-icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 25s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  will-change: transform;
}

.floating-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.3));
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(8px, -12px) scale(1.05);
  }
  50% {
    transform: translate(-6px, 8px) scale(0.98);
  }
  75% {
    transform: translate(-10px, -6px) scale(1.02);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.greeting {
  font-size: 16px;
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.name {
  font-size: clamp(40px, 8vw, 80px);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 16px;
  letter-spacing: -2px;
}

.name .dot {
  color: var(--accent);
}

.title {
  font-size: clamp(24px, 5vw, 48px);
  font-weight: 600;
  color: var(--text-secondary);
  line-height: 1.2;
  margin-bottom: 24px;
}

.typed-text {
  /* color comes from .gradient-text utility (App.vue) */
  font-weight: 700;
}

.cursor {
  color: var(--accent);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.bio {
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 540px;
  margin-bottom: 40px;
  line-height: 1.7;
}

.cta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.scroll-line {
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, var(--accent), transparent);
  animation: scroll 2s ease-in-out infinite;
}

@keyframes scroll {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  51% { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

@media (max-width: 768px) {
  .hero {
    padding-top: 80px;
  }

  .cta {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .cta a {
    justify-content: center;
    text-align: center;
  }

  .floating-icon {
    display: none;
  }

  .bio {
    font-size: 16px;
    margin-bottom: 28px;
  }

  .greeting {
    font-size: 14px;
    margin-bottom: 16px;
  }

  .scroll-indicator {
    bottom: 20px;
  }

  .scroll-line {
    height: 40px;
  }
}

/* Very small phones (< 375px) — defensive size clamp */
@media (max-width: 375px) {
  .name {
    font-size: clamp(32px, 10vw, 44px);
  }

  .title {
    font-size: clamp(20px, 6vw, 28px);
  }
}
</style>
