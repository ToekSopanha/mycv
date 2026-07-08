<template>
  <section id="contact" class="contact section-padding">
    <div class="container">
      <div class="contact-content">
        <h2 class="section-label">Get In Touch</h2>
        <h3 class="section-title">Let's <span>connect</span></h3>
        <p class="contact-text">
          I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>

        <ul class="contact-info" v-if="hasContactInfo">
          <li v-if="email">
            <span class="info-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <a :href="`mailto:${email}`">{{ email }}</a>
          </li>
          <li v-if="phone">
            <span class="info-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </span>
            <a :href="`tel:${phone}`">{{ phone }}</a>
          </li>
          <li v-if="location">
            <span class="info-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </span>
            <span>{{ location }}</span>
          </li>
        </ul>

        <a v-if="email" :href="`mailto:${email}`" class="btn-gradient">Say Hello</a>
        <a v-else href="mailto:your.email@example.com" class="btn-gradient">Say Hello</a>

        <div class="social-links" v-if="hasSocialLinks">
          <a v-if="github" :href="github" target="_blank" rel="noopener" class="social-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a v-if="telegram" :href="telegram" target="_blank" rel="noopener" class="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-telegram" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
            </svg>
          </a>
          <a v-if="linkedin" :href="linkedin" target="_blank" rel="noopener" class="social-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>

      <footer class="footer">
        <p>Designed & Built by Toek Sopanha</p>
      </footer>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const DEFAULTS = {
  email: 'your.email@example.com',
  phone: '',
  location: '',
  github: 'https://github.com/ToekSopanha',
  telegram: 'https://t.me/Toek_sopanha',
  linkedin: 'https://linkedin.com/in/yourname'
}

const email = ref(DEFAULTS.email)
const phone = ref(DEFAULTS.phone)
const location = ref(DEFAULTS.location)
const github = ref(DEFAULTS.github)
const telegram = ref(DEFAULTS.telegram)
const linkedin = ref(DEFAULTS.linkedin)

const hasContactInfo = computed(
  () => Boolean(email.value || phone.value || location.value)
)

const hasSocialLinks = computed(
  () => Boolean(github.value || telegram.value || linkedin.value)
)

async function fetchContact() {
  try {
    const res = await axios.get('/api/contact')
    const data = res.data || {}
    if (data.email !== undefined) email.value = data.email
    if (data.phone !== undefined) phone.value = data.phone
    if (data.location !== undefined) location.value = data.location
    if (data.github !== undefined) github.value = data.github
    if (data.telegram !== undefined) telegram.value = data.telegram
    if (data.linkedin !== undefined) linkedin.value = data.linkedin
  } catch (e) {
    console.warn('Failed to fetch /api/contact, using fallback content.', e?.message || e)
  }
}

fetchContact()
</script>

<style scoped>
.contact {
  background: var(--bg-primary);
  min-height: 80vh;
  display: flex;
  flex-direction: column;
}

.contact-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.contact-text {
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 32px;
}

.contact-info {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
  width: 100%;
  max-width: 420px;
}

.contact-info li {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 15px;
}

.contact-info a {
  color: var(--text-secondary);
  transition: color 0.2s;
}

.contact-info a:hover {
  color: var(--accent);
}

.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-subtle);
  color: var(--accent);
  flex-shrink: 0;
}

.social-links {
  display: flex;
  gap: 24px;
  margin-top: 40px;
}

.social-link {
  color: var(--text-secondary);
  transition: all 0.2s;
}

.social-link:hover {
  color: var(--accent);
  transform: translateY(-3px);
}

.footer {
  text-align: center;
  padding: 40px 0 20px;
  color: var(--text-muted);
  font-size: 14px;
}

@media (max-width: 639px) {
  .contact-text {
    font-size: 16px;
    margin-bottom: 24px;
  }

  .contact-info li {
    font-size: 14px;
    flex-wrap: wrap;
  }

  .contact-info a {
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .social-links {
    gap: 16px;
    margin-top: 28px;
  }

  .footer {
    padding: 24px 0 16px;
    font-size: 13px;
  }
}
</style>
