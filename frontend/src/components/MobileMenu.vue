<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isOpen"
        class="mobile-menu-overlay"
        @click.self="close"
      />
    </transition>
    <transition name="slide">
      <aside
        v-if="isOpen"
        class="mobile-menu glass-card"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        @keydown.esc="close"
      >
        <header class="mobile-menu-header">
          <span class="mobile-menu-brand gradient-text">SOPANHA.</span>
          <button
            ref="closeButton"
            class="mobile-menu-close"
            type="button"
            aria-label="Close menu"
            @click="close"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <nav class="mobile-menu-links">
          <a
            v-for="link in links"
            :key="link.id"
            :href="`#${link.id}`"
            class="mobile-menu-link"
            @click="close"
          >
            <span class="mobile-menu-link-index gradient-text">{{ link.index }}</span>
            <span class="mobile-menu-link-label">{{ link.label }}</span>
          </a>
        </nav>

        <footer class="mobile-menu-footer">
          <a
            v-if="social.github"
            :href="social.github"
            target="_blank"
            rel="noopener"
            class="mobile-menu-social"
            aria-label="GitHub"
            @click="close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            v-if="social.telegram"
            :href="social.telegram"
            target="_blank"
            rel="noopener"
            class="mobile-menu-social"
            aria-label="Telegram"
            @click="close"
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
            </svg>
          </a>
          <a
            v-if="social.linkedin"
            :href="social.linkedin"
            target="_blank"
            rel="noopener"
            class="mobile-menu-social"
            aria-label="LinkedIn"
            @click="close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </footer>
      </aside>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const closeButton = ref(null)

const links = [
  { id: 'about', label: 'About', index: '01' },
  { id: 'skills', label: 'Skills', index: '02' },
  { id: 'projects', label: 'Projects', index: '03' },
  { id: 'contact', label: 'Contact', index: '04' },
]

const DEFAULT_SOCIAL = {
  github: 'https://github.com/ToekSopanha',
  telegram: 'https://t.me/Toek_sopanha',
  linkedin: 'https://linkedin.com/in/yourname',
}

const social = ref({ ...DEFAULT_SOCIAL })

async function loadContact() {
  try {
    const res = await fetch('/api/contact')
    if (!res.ok) return
    const data = await res.json()
    social.value = {
      github: data.github || DEFAULT_SOCIAL.github,
      telegram: data.telegram || DEFAULT_SOCIAL.telegram,
      linkedin: data.linkedin || DEFAULT_SOCIAL.linkedin,
    }
  } catch (err) {
    // Keep defaults on network failure.
  }
}

onMounted(() => {
  loadContact()
})

function close() {
  emit('close')
}

watch(
  () => props.isOpen,
  async (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
      await nextTick()
      closeButton.value?.focus()
    } else {
      document.body.style.overflow = ''
    }
  },
)
</script>

<style scoped>
.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1100;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(320px, 86vw);
  z-index: 1200;
  display: flex;
  flex-direction: column;
  padding: 28px 24px;
  border-radius: 0;
  background: var(--bg-primary);
  border-left: 1px solid var(--glass-border);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.35);
}

[data-theme="light"] .mobile-menu {
  background: var(--bg-primary);
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.mobile-menu-brand {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -1px;
}

.mobile-menu-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.mobile-menu-close:hover {
  color: var(--accent-pink, var(--accent));
  border-color: var(--accent-pink, var(--accent));
  transform: rotate(90deg);
}

.mobile-menu-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.mobile-menu-link {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 14px 8px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 500;
  color: var(--text-primary);
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.mobile-menu-link:hover,
.mobile-menu-link:focus-visible {
  background: var(--accent-subtle);
  color: var(--accent);
  transform: translateX(4px);
  outline: none;
}

.mobile-menu-link-index {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
}

.mobile-menu-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.mobile-menu-social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.mobile-menu-social:hover {
  color: var(--accent);
  border-color: var(--accent);
  transform: translateY(-2px);
}

/* Overlay fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Drawer slide */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

@media (min-width: 1025px) {
  .mobile-menu,
  .mobile-menu-overlay {
    display: none;
  }
}
</style>
