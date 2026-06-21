<template>
  <div id="portfolio-app">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root,
[data-theme="dark"] {
  --bg-primary: #0a0a0b;
  --bg-secondary: #111113;
  --bg-tertiary: #18181b;
  --bg-card: #1c1c1f;
  
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  
  --accent: #8b5cf6;
  --accent-hover: #a78bfa;
  --accent-subtle: rgba(139, 92, 246, 0.15);
  
  --border: #27272a;
  --border-light: #3f3f46;
}

[data-theme="light"] {
  --bg-primary: #fafafa;
  --bg-secondary: #f4f4f5;
  --bg-tertiary: #e4e4e7;
  --bg-card: #ffffff;
  
  --text-primary: #18181b;
  --text-secondary: #52525b;
  --text-muted: #71717a;
  
  --accent: #7c3aed;
  --accent-hover: #8b5cf6;
  --accent-subtle: rgba(124, 58, 237, 0.1);
  
  --border: #e4e4e7;
  --border-light: #d4d4d8;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Space Grotesk', -apple-system, sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s, color 0.3s;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-padding {
  padding: 100px 0;
}

.section-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 16px;
}

.section-title {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 16px;
}

.section-title span {
  color: var(--accent);
}

.section-subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 600px;
}

/* Cards */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: var(--border-light);
  transform: translateY(-4px);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--accent);
  color: white;
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-light);
  color: var(--text-primary);
}

.btn-outline:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* Tags */
.tag {
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  background: var(--accent-subtle);
  color: var(--accent);
  border-radius: 100px;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-light);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease forwards;
}

#portfolio-app {
  min-height: 100vh;
}
</style>
