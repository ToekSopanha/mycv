<template>
  <section id="skills" class="skills section-padding">
    <div class="container">
      <h2 class="section-label">My Skills</h2>
      <h3 class="section-title">Technologies I work with</h3>
      
      <div class="skills-grid" v-if="!loading && !error">
        <div class="skill-category" v-for="(skills, category) in groupedSkills" :key="category">
          <h4 class="category-title">{{ category }}</h4>
          <div class="skill-items">
            <div class="skill-item" v-for="skill in skills" :key="skill.id">
              <div class="skill-info">
                <span class="skill-icon" v-if="getIcon(skill.name)">
                  <img :src="getIcon(skill.name)" :alt="skill.name" />
                </span>
                <span class="skill-name">{{ skill.name }}</span>
              </div>
              <div class="skill-bar">
                <div class="skill-progress" :style="{ width: animated ? skill.level + '%' : '0%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const skills = ref([])
const loading = ref(true)
const error = ref(null)
const animated = ref(false)

const iconUrls = {
  'Python': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg',
  'JavaScript': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg',
  'Bash/Shell': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/bash/bash-original.svg',
  'SQL': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg',
  'Docker': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg',
  'Kubernetes': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/kubernetes/kubernetes-plain.svg',
  'Jenkins': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/jenkins/jenkins-original.svg',
  'Terraform': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/terraform/terraform-plain.svg',
  'AWS': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'Azure': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/azure/azure-original.svg',
  'GCP': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/googlecloud/googlecloud-original.svg',
  'Vue.js': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg',
  'React': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg',
  'Node.js': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg',
  'Linux Administration': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg',
  'Networking (TCP/IP, DNS, VPN)': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/network/network-original.svg',
  'Ansible': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/ansible/ansible-original.svg',
  'Git': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg',
}

function getIcon(name) {
  return iconUrls[name] || ''
}

const groupedSkills = computed(() => {
  return skills.value.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})
})

async function fetchSkills() {
  try {
    const res = await axios.get('/api/skills')
    skills.value = res.data
    setTimeout(() => { animated.value = true }, 300)
  } catch (e) {
    error.value = 'Failed to load skills'
  } finally {
    loading.value = false
  }
}

onMounted(fetchSkills)
</script>

<style scoped>
.skills {
  background: var(--bg-secondary);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-top: 40px;
}

.skill-category {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
}

.category-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.skill-items {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skill-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.skill-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skill-icon img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.skill-name {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.skill-bar {
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #a78bfa);
  border-radius: 2px;
  transition: width 1s ease;
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

.error {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}
</style>
