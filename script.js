
function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}


function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initTheme() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const STORAGE_KEY = "portfolio-theme";

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    if (icon) icon.textContent = theme === "light" ? "☀️" : "🌙";
  };

  const saved = localStorage.getItem(STORAGE_KEY);
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(saved || (systemPrefersLight ? "light" : "dark"));

  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(current);
    localStorage.setItem(STORAGE_KEY, current);
  });
}


function initCounters() {
  const counters = document.querySelectorAll(".count");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 900; // ms
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(progress * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach((el) => observer.observe(el));
}

function initPhotoTilt() {
  const photo = document.getElementById("tiltPhoto");
  if (!photo || window.matchMedia("(max-width: 960px)").matches) return;

  const maxTilt = 10; // graus

  photo.addEventListener("mousemove", (e) => {
    const rect = photo.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0 a 1
    const y = (e.clientY - rect.top) / rect.height;  // 0 a 1

    const rotateY = (x - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - y) * maxTilt * 2;

    photo.style.setProperty("--tilt-x", `${rotateX}deg`);
    photo.style.setProperty("--tilt-y", `${rotateY}deg`);
  });

  photo.addEventListener("mouseleave", () => {
    photo.style.setProperty("--tilt-x", "0deg");
    photo.style.setProperty("--tilt-y", "0deg");
  });
}

function initRain() {
  const canvas = document.getElementById("rainCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height, drops;

  function sizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  
  function dropCount() {
    return window.innerWidth < 640 ? 60 : 140;
  }

  function makeDrop() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      length: 10 + Math.random() * 18,
      speed: 4 + Math.random() * 6,
      drift: 0.6, // leve inclinação, como vento
      opacity: 0.12 + Math.random() * 0.25,
    };
  }

  function createDrops() {
    drops = Array.from({ length: dropCount() }, makeDrop);
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(205, 234, 219, 1)";
    ctx.lineCap = "round";

    drops.forEach((drop) => {
      ctx.globalAlpha = drop.opacity;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x + drop.drift * 3, drop.y + drop.length);
      ctx.stroke();

      drop.x += drop.drift;
      drop.y += drop.speed;

      if (drop.y > height) {
        drop.y = -drop.length;
        drop.x = Math.random() * width;
      }
    });

    requestAnimationFrame(tick);
  }

  sizeCanvas();
  createDrops();
  tick();

  window.addEventListener("resize", () => {
    sizeCanvas();
    createDrops();
  });
}


function initFireflies() {
  const container = document.getElementById("fireflies");
  if (!container) return;

  const total = window.innerWidth < 640 ? 6 : 14;

  for (let i = 0; i < total; i++) {
    const fly = document.createElement("span");
    fly.className = "firefly";

    const left = Math.random() * 100;
    const top = 20 + Math.random() * 70;
    const floatDuration = 6 + Math.random() * 8;
    const blinkDuration = 2 + Math.random() * 3;
    const driftX = (Math.random() - 0.5) * 120;
    const driftY = -40 - Math.random() * 80;

    fly.style.left = `${left}%`;
    fly.style.top = `${top}%`;
    fly.style.setProperty("--fx", `${driftX}px`);
    fly.style.setProperty("--fy", `${driftY}px`);
    fly.style.animationDuration = `${floatDuration}s, ${blinkDuration}s`;
    fly.style.animationDelay = `${Math.random() * 4}s`;
    fly.style.animationDirection = "alternate, alternate";

    container.appendChild(fly);
  }
}

function initSkyElements() {
  const container = document.getElementById("skyElements");
  if (!container || window.matchMedia("(max-width: 640px)").matches) return;

  const cloudSizes = [
    { w: 120, h: 36 },
    { w: 90, h: 28 },
    { w: 150, h: 40 },
  ];

  cloudSizes.forEach((size, i) => {
    const cloud = document.createElement("span");
    cloud.className = "cloud";
    cloud.style.width = `${size.w}px`;
    cloud.style.height = `${size.h}px`;
    cloud.style.top = `${8 + i * 14}%`;
    cloud.style.animationDuration = `${70 + i * 25}s`;
    cloud.style.animationDelay = `${-i * 20}s`;
    container.appendChild(cloud);
  });

  const birdCount = 3;
  for (let i = 0; i < birdCount; i++) {
    const bird = document.createElement("span");
    bird.className = "bird";
    bird.textContent = "⌃";
    bird.style.top = `${15 + Math.random() * 25}%`;
    bird.style.animationDuration = `${18 + Math.random() * 10}s`;
    bird.style.animationDelay = `${-Math.random() * 15}s`;
    container.appendChild(bird);
  }
}

function initLightning() {
  const bolt = document.getElementById("lightning");
  if (!bolt) return;

  function scheduleNext() {
    const wait = 9000 + Math.random() * 16000; 
    setTimeout(() => {
      bolt.classList.add("flash");
      setTimeout(() => bolt.classList.remove("flash"), 650);
      scheduleNext();
    }, wait);
  }

  scheduleNext();
}


function openModal(modal) {
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  modal.hidden = true;
  document.body.style.overflow = "";
}

function initModal() {
  const modal = document.getElementById("successModal");
  if (!modal) return;

  modal.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", () => closeModal(modal));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal(modal);
  });

  return modal;
}

function maskPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits.replace(/^(\d{0,2})/, "($1");
  if (digits.length <= 6)
    return digits.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
  if (digits.length <= 10)
    return digits.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const modal = document.getElementById("successModal");
  const telefoneInput = form.querySelector("#telefone");


  telefoneInput.addEventListener("input", (e) => {
    e.target.value = maskPhone(e.target.value);
  });

  const rules = {
    nome: (value) => value.trim().length >= 3,
    telefone: (value) => value.replace(/\D/g, "").length >= 10,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    mensagem: (value) => value.trim().length >= 10,
  };

  const messages = {
    nome: "Digite seu nome completo.",
    telefone: "Telefone incompleto. Use o formato (99) 99999-9999.",
    email: "Digite um e-mail válido.",
    mensagem: "Conta um pouco mais sobre o que você precisa (mín. 10 caracteres).",
  };

  function validateField(name) {
    const input = form.querySelector(`[name="${name}"]`);
    const errorEl = form.querySelector(`[data-error-for="${name}"]`);
    const valid = rules[name](input.value);

    input.classList.toggle("is-invalid", !valid);
    if (errorEl) errorEl.textContent = valid ? "" : messages[name];
    return valid;
  }

  Object.keys(rules).forEach((name) => {
    const input = form.querySelector(`[name="${name}"]`);
    input.addEventListener("blur", () => validateField(name));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const results = Object.keys(rules).map(validateField);
    const allValid = results.every(Boolean);
    if (!allValid) return;

   
    if (modal) openModal(modal);

 const dadosFormulario = new FormData(form);
   
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: dadosFormulario
    }).catch(error => console.error("Erro no envio:", error));


    
    form.reset();
    form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
  });
}


document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initFooterYear();
  initTheme();
  initCounters();
  initPhotoTilt();
  initRain();
  initFireflies();
  initSkyElements();
  initLightning();
  initModal();
  initContactForm();

  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: "ease-out",
      once: true,
      offset: 60,
    });
  }
});
