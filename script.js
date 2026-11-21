
/* ==========================================
   ORBITAL — SPACE INTERACTION
========================================== */

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];
let width = 0;
let height = 0;
let mouseX = 0;
let mouseY = 0;

/* RESIZE CANVAS */
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  createStars();
}

window.addEventListener("resize", resizeCanvas);

/* CREATE STAR FIELD */
function createStars() {
  const count = Math.min(
    Math.floor((width * height) / 1800),
    650
  );

  stars = [];

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.25 + 0.04,
      phase: Math.random() * Math.PI * 2
    });
  }
}

/* ANIMATE STARS */
function animateStars() {
  ctx.clearRect(0, 0, width, height);

  const time = Date.now() * 0.001;

  for (const star of stars) {
    const twinkle =
      0.35 + Math.abs(Math.sin(time + star.phase)) * 0.65;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

    ctx.fillStyle = `rgba(180,215,255,${twinkle})`;
    ctx.fill();

    star.y -= star.speed;

    if (star.y < -2) {
      star.y = height + 2;
      star.x = Math.random() * width;
    }
  }

  requestAnimationFrame(animateStars);
}

resizeCanvas();
animateStars();

/* MOUSE TRACKING */
window.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / width - 0.5) * 2;
  mouseY = (event.clientY / height - 0.5) * 2;

  const earthScene = document.getElementById("earthScene");

  if (earthScene && window.innerWidth > 900) {
    earthScene.style.transform =
      `translate(${mouseX * 8}px, ${mouseY * 8}px)`;
  }
});

/* RESET PARALLAX */
document.addEventListener("mouseleave", () => {
  const earthScene = document.getElementById("earthScene");

  if (earthScene) {
    earthScene.style.transform = "translate(0,0)";
  }
});

/* MOBILE MENU */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");

  menuToggle.textContent =
    navLinks.classList.contains("active") ? "✕" : "☰";
});

/* CLOSE MENU AFTER CLICK */
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuToggle.textContent = "☰";
  });
});

/* SCROLL REVEAL */
const revealElements = document.querySelectorAll(
  ".section-heading, .mission-text, .mission-card, .tech-card, .about-box, .contact"
);

revealElements.forEach(element => {
  element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach(element => {
  revealObserver.observe(element);
});

/* CARD STAGGER */
document.querySelectorAll(".tech-card").forEach((card, index) => {
  card.style.transitionDelay = `${index * 120}ms`;
});

/* SMOOTH ANCHOR OFFSET */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");

    if (targetId === "#") return;

    const target = document.querySelector(targetId);

    if (target) {
      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

/* CONSOLE BRANDING */
console.log(
  "%c ORBITAL INTELLIGENCE ",
  "background:#061b35;color:#65c9ff;font-size:16px;padding:10px;"
);
console.log("Exploring the unseen.");

/* =========================================
   3D MOUSE DEPTH + PARALLAX
========================================= */

const scene3D = document.querySelector(".earth-scene");
const visual3D = document.querySelector(".space-visual");

let targetRX = 0;
let targetRY = 0;
let currentRX = 0;
let currentRY = 0;

window.addEventListener("mousemove", (e) => {
  if (window.innerWidth <= 900) return;

  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;

  targetRY = x * 14;
  targetRX = -y * 14;
});

window.addEventListener("mouseleave", () => {
  targetRX = 0;
  targetRY = 0;
});

function animate3DScene() {
  currentRX += (targetRX - currentRX) * 0.04;
  currentRY += (targetRY - currentRY) * 0.04;

  if (scene3D && window.innerWidth > 900) {
    scene3D.style.transform =
      `rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
  }

  requestAnimationFrame(animate3DScene);
}

animate3DScene();

/* SCROLL DEPTH EFFECT */
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  if (visual3D) {
    visual3D.style.opacity =
      Math.max(0.25, 1 - scrollY / 1100);
  }
});

/* RANDOM SHOOTING STARS */
function shootingStar() {
  const star = document.createElement("div");

  star.style.cssText = `
    position:fixed;
    top:${Math.random() * 50}%;
    left:${Math.random() * 100}%;
    width:100px;
    height:1px;
    background:linear-gradient(90deg,transparent,#8bdcff,transparent);
    transform:rotate(-35deg);
    pointer-events:none;
    z-index:1;
    opacity:0;
    transition:opacity .3s;
  `;

  document.body.appendChild(star);

  requestAnimationFrame(() => {
    star.style.opacity = "1";
    star.style.transform = "translate(-350px,250px) rotate(-35deg)";
    star.style.transition = "transform 1s linear, opacity 1s";
  });

  setTimeout(() => star.remove(), 1200);
}

setInterval(() => {
  if (Math.random() > 0.45) shootingStar();
}, 2500);
