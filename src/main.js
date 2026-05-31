import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { products, faq } from './data.js'

gsap.registerPlugin(ScrollTrigger)

// --- PARTICLE BACKGROUND ---
const canvas = document.getElementById('particle-canvas')
const ctx = canvas.getContext('2d')
let particles = []
let animFrameId

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

class Particle {
  constructor() {
    this.reset()
  }

  reset() {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 2.5 + 0.5
    this.speedX = (Math.random() - 0.5) * 0.4
    this.speedY = (Math.random() - 0.5) * 0.4
    this.opacity = Math.random() * 0.4 + 0.05
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY

    if (this.x < -10) this.x = canvas.width + 10
    if (this.x > canvas.width + 10) this.x = -10
    if (this.y < -10) this.y = canvas.height + 10
    if (this.y > canvas.height + 10) this.y = -10
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(233, 69, 96, ${this.opacity})`
    ctx.fill()
  }
}

function initParticles() {
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120)
  particles = Array.from({ length: count }, () => new Particle())
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  particles.forEach(p => {
    p.update()
    p.draw()
  })

  particles.forEach((a, i) => {
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(233, 69, 96, ${0.03 * (1 - dist / 120)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  })

  animFrameId = requestAnimationFrame(animateParticles)
}

resizeCanvas()
initParticles()
animateParticles()

window.addEventListener('resize', () => {
  resizeCanvas()
  initParticles()
})

// --- NAVBAR ---
const navbar = document.getElementById('navbar')
const mobileMenuBtn = document.getElementById('mobile-menu-btn')
const mobileMenu = document.getElementById('mobile-menu')

ScrollTrigger.create({
  start: 'top -80',
  onEnter: () => navbar.classList.add('navbar-scrolled'),
  onLeaveBack: () => navbar.classList.remove('navbar-scrolled'),
})

mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden')
})

document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden')
  })
})

// --- HERO TITLE SPLIT ---
const heroTitle = document.getElementById('hero-title')
const titleText = heroTitle.textContent.trim()
heroTitle.innerHTML = titleText.split('').map(ch =>
  ch === ' ' ? ' ' : `<span class="char">${ch}</span>`
).join('')

const chars = heroTitle.querySelectorAll('.char')

const heroTl = gsap.timeline({ delay: 0.3 })
heroTl
  .to(chars, {
    y: 0,
    opacity: 1,
    rotateX: 0,
    duration: 0.8,
    stagger: 0.04,
    ease: 'power3.out',
  })
  .fromTo('#hero-subtitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3')
  .fromTo('#hero-cta', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5')

// --- ABOUT SECTION ---
gsap.fromTo('.about-content', { y: 60, opacity: 0 }, {
  y: 0, opacity: 1, duration: 1, ease: 'power3.out',
  scrollTrigger: {
    trigger: '#about',
    start: 'top 75%',
  },
})

// --- PRODUCTS ---
const productsGrid = document.getElementById('products-grid')

productsGrid.innerHTML = products.map(p => `
  <div class="product-card" data-id="${p.id}">
    <div class="product-icon" style="background: linear-gradient(135deg, ${p.color}33, ${p.color}11); border: 2px solid ${p.color}44;">
      ${p.icon}
    </div>
    <h3 class="text-xl font-bold text-white mt-5 mb-1">${p.name}</h3>
    <p class="text-sm text-accent/80 font-medium mb-3">${p.tagline}</p>
    <p class="text-sm text-gray-400 leading-relaxed mb-5">${p.description}</p>
    <div class="flex items-center justify-between">
      <span class="text-2xl font-black text-white">${p.price} <span class="text-sm font-normal text-gray-500">TL</span></span>
      <button class="btn-primary text-sm px-5 py-2 buy-btn" data-product="${p.name}">
        Satın Al
      </button>
    </div>
  </div>
`).join('')

gsap.from('.product-card', {
  y: 80,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#products-grid',
    start: 'top 80%',
  },
})

document.querySelectorAll('.buy-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    const name = btn.dataset.product
    btn.textContent = 'Sepete Eklendi! 😅'
    btn.style.pointerEvents = 'none'
    setTimeout(() => {
      btn.innerHTML = 'Satın Al'
      btn.style.pointerEvents = 'auto'
    }, 2000)
    gsap.timeline()
      .to(btn, { scale: 1.1, duration: 0.1 })
      .to(btn, { scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.3)' })
  })
})

// --- FAQ ---
const faqList = document.getElementById('faq-list')

faqList.innerHTML = faq.map((item, index) => `
  <div class="faq-item" data-index="${index}">
    <div class="faq-question">
      <span>${item.q}</span>
      <span class="icon">+</span>
    </div>
    <div class="faq-answer">
      <div class="faq-answer-inner">${item.a}</div>
    </div>
  </div>
`).join('')

faqList.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement
    const isActive = item.classList.contains('active')

    faqList.querySelectorAll('.faq-item.active').forEach(active => {
      active.classList.remove('active')
    })

    if (!isActive) {
      item.classList.add('active')
    }
  })
})

gsap.from('.faq-item', {
  y: 40,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '#faq-list',
    start: 'top 80%',
  },
})

// --- FORM ---
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault()
  const btn = e.target.querySelector('button[type="submit"]')
  btn.textContent = 'Gönderildi! (Rüyana düştü) ✨'
  btn.style.pointerEvents = 'none'
  setTimeout(() => {
    btn.innerHTML = 'Gönder → Rüya'
    btn.style.pointerEvents = 'auto'
  }, 3000)
  e.target.reset()
})

// --- CONTACT REVEAL ---
gsap.from('.contact-info', {
  x: -60,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#contact',
    start: 'top 75%',
  },
})

gsap.from('#contact-form', {
  x: 60,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#contact',
    start: 'top 75%',
  },
})
