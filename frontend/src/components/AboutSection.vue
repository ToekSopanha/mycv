<template>
  <section id="about" class="about section-padding">
    <div class="container">
      <h2 class="section-label">About Me</h2>
      <h3 class="section-title">Hello! I'm <span>Toek Sopanha</span></h3>
      
      <div class="about-content">
        <div class="about-text">
          <p>
            I am Toek Sopanha, a dedicated student majoring in Management Information Systems (MIS) at 
            Setec Institute, with expertise spanning software engineering, network infrastructure, cloud platforms, and DevOps practices. My journey into technology has been driven by a passion for building reliable, scalable, and secure systems that power modern businesses.
          </p>
          <p>
            I specialize in full-stack development, network design and administration, cloud architecture (AWS, Azure, GCP), and implementing CI/CD pipelines. With hands-on experience in automation, containerization, and infrastructure as code, I help organizations streamline their development and operations workflows.
          </p>
          <p class="tech-heading">Here are a few technologies I've been working with recently:</p>
          <ul class="tech-list">
            <li>Python & JavaScript</li>
            <li>Docker & Kubernetes</li>
            <li>AWS & Azure & GCP</li>
            <li>Terraform & Ansible</li>
            <li>Jenkins & GitHub Actions</li>
            <li>Vue.js & React</li>
            <li>Linux & Networking</li>
            <li>CI/CD & Git</li>
          </ul>
        </div>
        
        <div class="about-image">
          <div class="image-wrapper">
            <img src="../assets/profile.jpg" alt="Toek Sopanha" class="profile-photo" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

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
  overflow-anchor: none;
  width: 290px;
  height: 350px;
  border-radius: var(--radius);
}

.image-wrapper::before {
  content: '';
  position: absolute;
  inset: -12px;
  border: 2px solid var(--accent);
  border-radius: calc(var(--radius) + 8px);
  opacity: 0.4;
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
</style>
