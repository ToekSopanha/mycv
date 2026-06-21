<template>
  <section id="hero" class="hero">
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
        <p class="greeting fade-in-up">Hi, my name is</p>
        <h1 class="name fade-in-up" style="animation-delay: 0.1s">
          Toek Sopanha<span class="dot">.</span>
        </h1>
        <h2 class="title fade-in-up" style="animation-delay: 0.2s">
          I build <span class="typed-text">{{ displayedText }}</span><span class="cursor">|</span>
        </h2>
        <p class="bio fade-in-up" style="animation-delay: 0.3s">
          I'm a multi-disciplinary engineer specializing in software development, networking, cloud infrastructure, and DevOps. I build scalable applications, design robust networks, manage cloud environments, and automate deployment pipelines. With a passion for creating efficient, reliable, and secure systems, I deliver end-to-end solutions that drive business value.
        </p>
        <div class="cta fade-in-up" style="animation-delay: 0.4s">
          <a href="#projects" class="btn btn-primary">Check my work</a>
          <a href="#contact" class="btn btn-outline">Get in touch</a>
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

const titles = [
  'software solutions',
  'cloud infrastructure',
  'CI/CD pipelines',
  'network architectures',
  'automation scripts',
  'scalable systems'
]

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
  const current = titles[titleIndex]
  
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
      titleIndex = (titleIndex + 1) % titles.length
    }
  }
  setTimeout(typeEffect, isDeleting ? 50 : 100)
}

onMounted(() => {
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
  color: var(--text-primary);
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
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
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
    padding-top: 60px;
  }
  
  .cta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .floating-icon {
    display: none;
  }
}
</style>
