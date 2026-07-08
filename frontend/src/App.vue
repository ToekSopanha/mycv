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

  /* Gradient palette: cyan -> purple -> pink */
  --accent-cyan: #06b6d4;
  --accent-purple: #8b5cf6;
  --accent-pink: #ec4899;
  --gradient-primary: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%);
  --gradient-primary-hover: linear-gradient(135deg, #22d3ee 0%, #a78bfa 50%, #f472b6 100%);

  /* Backwards compatible accent tokens (now point to the purple middle stop) */
  --accent: #8b5cf6;
  --accent-hover: #a78bfa;
  --accent-subtle: rgba(139, 92, 246, 0.15);

  --border: #27272a;
  --border-light: #3f3f46;

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);

  /* Glow */
  --glow-primary: 0 0 24px rgba(139, 92, 246, 0.35);
  --glow-cyan: 0 0 24px rgba(6, 182, 212, 0.35);
  --glow-pink: 0 0 24px rgba(236, 72, 153, 0.35);
}

[data-theme="light"] {
  --bg-primary: #fafafa;
  --bg-secondary: #f4f4f5;
  --bg-tertiary: #e4e4e7;
  --bg-card: #ffffff;

  --text-primary: #18181b;
  --text-secondary: #52525b;
  --text-muted: #71717a;

  --accent-cyan: #0891b2;
  --accent-purple: #7c3aed;
  --accent-pink: #db2777;
  --gradient-primary: linear-gradient(135deg, #06b6d4 0%, #7c3aed 50%, #ec4899 100%);
  --gradient-primary-hover: linear-gradient(135deg, #0891b2 0%, #8b5cf6 50%, #db2777 100%);

  --accent: #7c3aed;
  --accent-hover: #8b5cf6;
  --accent-subtle: rgba(124, 58, 237, 0.1);

  --border: #e4e4e7;
  --border-light: #d4d4d8;

  --glass-bg: rgba(255, 255, 255, 0.6);
  --glass-border: rgba(24, 24, 27, 0.06);

  --glow-primary: 0 0 24px rgba(124, 58, 237, 0.25);
  --glow-cyan: 0 0 24px rgba(8, 145, 178, 0.25);
  --glow-pink: 0 0 24px rgba(219, 39, 119, 0.25);
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
  overflow-x: hidden;
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
  width: 100%;
}

.section-padding {
  padding: 100px 0;
}

/* ---------- Global responsive breakpoints ---------- */
/* Mobile: < 640px */
@media (max-width: 639px) {
  .container {
    padding: 0 16px;
  }

  .section-padding {
    padding: 60px 0;
  }

  .section-title {
    font-size: clamp(28px, 7vw, 36px);
  }

  .section-subtitle {
    font-size: 16px;
  }
}

/* Tablet: 640–1024px */
@media (min-width: 640px) and (max-width: 1024px) {
  .section-padding {
    padding: 80px 0;
  }
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

/* ---------- Utility classes ---------- */

/* Glassmorphism card surface */
.glass-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  border-color: var(--border-light);
  transform: translateY(-4px);
  box-shadow: var(--glow-primary);
}

/* Gradient-filled primary button */
.btn-gradient {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  color: #ffffff;
  background: var(--gradient-primary);
  background-size: 200% 200%;
  background-position: 0% 50%;
  cursor: pointer;
  transition: background-position 0.4s ease, transform 0.2s ease, filter 0.2s ease, box-shadow 0.3s ease;
}

.btn-gradient:hover {
  background-position: 100% 50%;
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: var(--glow-primary);
}

.btn-gradient:focus-visible {
  outline: 2px solid var(--accent-purple);
  outline-offset: 3px;
}

/* Text filled with the gradient palette */
.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* Subtle glow ring used on focus/hover states */
.glow {
  box-shadow: var(--glow-primary);
}

.glow:hover {
  box-shadow: var(--glow-cyan);
}

/* ---------- Animations ---------- */

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
