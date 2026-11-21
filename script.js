
/* BRANDO INTERACTIVE ENGINE */

const loader = document.getElementById("loader");

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hide"), 900);
});

/* STARFIELD */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];
let width, height;
let mouseX = 0, mouseY = 0;
let smoothX = 0, smoothY = 0;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  const count = Math.min(240, Math.floor((width * height) / 5500));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 1.4 + .2,
    alpha: Math.random() * .8 + .2,
    speed: Math.random() * .25 + .05,
    phase: Math.random() * Math.PI * 2
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);

  smoothX += (mouseX - smoothX) * .025;
  smoothY += (mouseY - smoothY) * .025;

  stars.forEach(star => {
    star.phase += .015;
    const twinkle = star.alpha + Math.sin(star.phase) * .2;
    const px = star.x + smoothX * star.speed * 15;
    const py = star.y + smoothY * star.speed * 15;

    ctx.beginPath();
    ctx.arc(px, py, star.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(190,215,255,${Math.max(.1,twinkle)})`;
    ctx.fill();

    star.y -= star.speed;
    if (star.y < -2) {
      star.y = height + 2;
      star.x = Math.random() * width;
    }
  });

  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / width - .5) * 2;
  mouseY = (e.clientY / height - .5) * 2;
});
resizeCanvas();
drawStars();

/* PLANET PARALLAX */
const planetWrap = document.getElementById("planetWrap");

window.addEventListener("mousemove", (e) => {
  if (window.innerWidth <= 700) return;

  const x = (e.clientX / window.innerWidth - .5);
  const y = (e.clientY / window.innerHeight - .5);

  planetWrap.style.transform =
    `translate(${x * -22}px, calc(-50% + ${y * -22}px))`;
});

/* HUD COORDINATES */
const coordinates = document.getElementById("coordinates");

window.addEventListener("mousemove", (e) => {
  const x = ((e.clientX / window.innerWidth) * 360 - 180).toFixed(3);
  const y = ((e.clientY / window.innerHeight) * 180 - 90).toFixed(3);
  coordinates.textContent = `${y} / ${x}`;
});

/* MOBILE MENU */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
  });
});

/* SCROLL REVEAL */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: .12
});

document.querySelectorAll(".reveal").forEach(el => {
  revealObserver.observe(el);
});

/* CARD TILT */
document.querySelectorAll(".feature-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    if (window.innerWidth <= 700) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;

    card.style.transform =
      `perspective(800px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-5px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* RANDOM SHOOTING STARS */
function shootingStar() {
  const star = document.createElement("div");
  star.style.cssText = `
    position:fixed;
    z-index:1;
    pointer-events:none;
    width:100px;
    height:1px;
    top:${Math.random() * 50}%;
    left:${Math.random() * 80}%;
    background:linear-gradient(90deg,transparent,rgba(150,200,255,.8));
    transform:rotate(-35deg);
    opacity:0;
  `;
  document.body.appendChild(star);

  star.animate([
    { opacity:0, transform:"translate(0,0) rotate(-35deg)" },
    { opacity:1, offset:.2 },
    { opacity:0, transform:"translate(-220px,140px) rotate(-35deg)" }
  ], {
    duration:1100,
    easing:"ease-out"
  });

  setTimeout(() => star.remove(), 1200);
}

setInterval(() => {
  if (Math.random() > .35) shootingStar();
}, 4500);

/* ACTIVE NAV */
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const top = section.offsetTop - 200;
    if (window.scrollY >= top) current = section.getAttribute("id");
  });

  navItems.forEach(link => {
    link.style.color =
      link.getAttribute("href") === `#${current}` ? "#eef3ff" : "";
  });
});
