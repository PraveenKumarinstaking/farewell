// ── Particle Background ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const colors = [
  [108, 159, 255],  // blue
  [168, 85, 247],   // purple
  [252, 92, 125],   // pink
  [247, 215, 148],  // gold
];

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.05;
    this.pulse = Math.random() * Math.PI * 2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulse += 0.015;
    this.opacity = 0.08 + Math.sin(this.pulse) * 0.15;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 60; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(79, 143, 255, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
// animateParticles();

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Mobile nav toggle ──
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});
// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.textContent = '☰';
  });
});

// ── Scroll reveal ──
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('Revealing element:', entry.target);
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ── Lightbox with Navigation ──
let currentLightboxIndex = 0;
let galleryItems = [];

function initGallery() {
  galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
}

function openLightbox(item) {
  if (galleryItems.length === 0) initGallery();
  currentLightboxIndex = galleryItems.indexOf(item);
  updateLightboxImage();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateLightboxImage() {
  const img = galleryItems[currentLightboxIndex].querySelector('img');
  document.getElementById('lightboxImg').src = img.src;
  document.getElementById('lightboxCounter').textContent = 
    `${currentLightboxIndex + 1} / ${galleryItems.length}`;
}

function navigateLightbox(direction) {
  currentLightboxIndex += direction;
  if (currentLightboxIndex < 0) currentLightboxIndex = galleryItems.length - 1;
  if (currentLightboxIndex >= galleryItems.length) currentLightboxIndex = 0;
  updateLightboxImage();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

// Close lightbox when clicking on background (not on image or buttons)
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});

// ── Message Form ──
const messages = [
  { name: 'Ananya', text: 'These 4 years changed my life forever. Love you all! 💙' },
  { name: 'Rahul', text: 'From late-night coding to early-morning exams — we survived it all together 🔥' },
  { name: 'Priya', text: 'Remember our first hackathon? That was the day we became a team ❤️' },
  { name: 'Arjun', text: 'College is over, but these friendships? They\'re forever. Miss you already. 🥺' },
];

function renderMessages() {
  const wall = document.getElementById('messagesWall');
  wall.innerHTML = '';
  messages.forEach((msg, i) => {
    const card = document.createElement('div');
    card.className = 'msg-card';
    card.style.animationDelay = `${i * 0.1}s`;
    card.innerHTML = `
      <div class="msg-author">${escapeHTML(msg.name)}</div>
      <div class="msg-text">${escapeHTML(msg.text)}</div>
    `;
    wall.appendChild(card);
  });
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function submitMessage(e) {
  e.preventDefault();
  const name = document.getElementById('msgName').value.trim();
  const text = document.getElementById('msgText').value.trim();
  if (!name || !text) return;
  messages.unshift({ name, text });
  renderMessages();
  document.getElementById('messageForm').reset();
  showToast();
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Initial render
renderMessages();

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Typewriter tagline in hero ──
const taglines = [
  '"One Last Time, Together Forever"',
  '"Goodbyes are not forever"',
  '"End of an era, start of a new story"',
  '"Memories made, friendships sealed"',
];
let taglineIndex = 0;
const heroQuote = document.querySelector('.hero-quote');
const originalQuote = heroQuote.innerHTML;

// ── Countdown to event ──
function updateCountdown() {
  const eventDate = new Date('2026-05-02T09:30:00+05:30');
  const now = new Date();
  const diff = eventDate - now;
  if (diff <= 0) return;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const badge = document.querySelector('.hero-badge');
  if (badge && days >= 0) {
    badge.textContent = `🎓 ${days}d ${hours}h ${mins}m to Farewell!`;
  }
}
updateCountdown();
setInterval(updateCountdown, 60000);
