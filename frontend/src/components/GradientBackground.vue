<template>
  <div
    class="gradient-background"
    :class="[`variant-${variant}`]"
    aria-hidden="true"
  >
    <span class="blob blob-cyan" />
    <span class="blob blob-purple" />
    <span class="blob blob-pink" />
    <span class="blob blob-extra" />
  </div>
</template>

<script setup>
defineProps({
  /**
   * 'hero'    - larger, brighter blobs designed to sit behind hero content
   * 'subtle'  - dimmer, smaller blobs for ambient backgrounds (default)
   */
  variant: {
    type: String,
    default: 'subtle',
    validator: (v) => ['hero', 'subtle'].includes(v),
  },
})
</script>

<style scoped>
.gradient-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.blob {
  position: absolute;
  display: block;
  border-radius: 50%;
  filter: blur(80px);
  will-change: transform;
}

/* Subtle variant: dim, small, slow */
.variant-subtle .blob {
  width: 320px;
  height: 320px;
  opacity: 0.18;
}

/* Hero variant: larger, brighter, faster */
.variant-hero .blob {
  width: 520px;
  height: 520px;
  opacity: 0.35;
}

/* Individual blob colors */
.blob-cyan {
  background: var(--accent-cyan, #06b6d4);
  top: -10%;
  left: -10%;
  animation: blob-float-a 22s ease-in-out infinite;
}

.blob-purple {
  background: var(--accent-purple, #8b5cf6);
  top: 20%;
  right: -15%;
  animation: blob-float-b 26s ease-in-out infinite;
}

.blob-pink {
  background: var(--accent-pink, #ec4899);
  bottom: -15%;
  left: 30%;
  animation: blob-float-c 30s ease-in-out infinite;
}

.blob-extra {
  background: var(--accent-cyan, #06b6d4);
  top: 50%;
  left: 50%;
  width: 240px;
  height: 240px;
  opacity: 0.12;
  animation: blob-float-d 34s ease-in-out infinite;
}

.variant-hero .blob-extra {
  width: 380px;
  height: 380px;
  opacity: 0.25;
}

@keyframes blob-float-a {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(40vw, 20vh) scale(1.15);
  }
  66% {
    transform: translate(20vw, 60vh) scale(0.9);
  }
}

@keyframes blob-float-b {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(-30vw, 40vh) scale(0.85);
  }
  66% {
    transform: translate(-50vw, 10vh) scale(1.2);
  }
}

@keyframes blob-float-c {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(25vw, -40vh) scale(1.1);
  }
  66% {
    transform: translate(-20vw, -20vh) scale(0.95);
  }
}

@keyframes blob-float-d {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  33% {
    transform: translate(-30%, -70%) scale(1.2);
  }
  66% {
    transform: translate(-70%, -30%) scale(0.85);
  }
}

@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none !important;
  }
}
</style>
