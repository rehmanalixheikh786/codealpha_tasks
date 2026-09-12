/* 
================================================================================================
DATA
================================================================================================
*/
const SKILLS = [
  { name: "HTML", icon: "🧱", level: 95 },
  { name: "CSS", icon: "🎨", level: 90 },
  { name: "JavaScript", icon: "⚡", level: 90 },
  { name: "Tailwind CSS", icon: "🎨", level: 88 },
  { name: "Node.js", icon: "🟢", level: 85 },
  { name: "Express.js", icon: "🚀", level: 82 },
  { name: "React", icon: "⚛️", level: 88 },
  { name: "MongoDB", icon: "🍃", level: 80 },
  { name: "MySQL", icon: "🐬", level: 78 },
  { name: "Git", icon: "🌿", level: 85 },
  { name: "GitHub", icon: "🐙", level: 85 },
  { name: "Responsive Design", icon: "📱", level: 92 },
  { name: "UI/UX", icon: "✏️", level: 80 },
];

const PROJECTS = [
  {
    title: "Image Gallery",
    description:
      "A filterable photo gallery with a full-screen lightbox, keyboard navigation, and smooth transitions.",
    tech: ["HTML", "CSS", "JavaScript"],
    category: "html-css",
    image: "./assets/images/gallery1.png",
    gradient: "linear-gradient(135deg,#3d8f7c,#1c222b)",
    github: "https://github.com/rehmanalixheikh786/gallery.git",
    demo: "https://rasgallery.netlify.app/",
  },
  {
    title: "Calculator",
    description:
      "A precedence-aware calculator built without eval(), with full keyboard support and a light/dark theme.",
    tech: ["JavaScript", "CSS"],
    category: "javascript",
    image: "./assets/images/calculator.png",
    gradient: "linear-gradient(135deg,#a86a2c,#1c222b)",
    github: "https://github.com/rehmanalixheikh786/rascalculator.git",
    demo: "https://rascalculator.netlify.app/",
  },
  {
    title: "Aptech Project",
    description:
      "A responsive, user-friendly website built with modern technologies, focusing on seamless design and optimal functionality for an enhanced browsing experience.",
    tech: ["HTML", "CSS", "JavaScript"],
    category: "html-css",
    image: "./assets/images/coder.png",
    gradient: "linear-gradient(135deg,#5f6ad0,#1c222b)",
    github: "https://github.com/rehmanalixheikh786/coder.git",
    demo: "https://coder-ras.netlify.app/",
  },
];

/*
================================================================================================
NAVBAR — sticky style change on scroll
================================================================================================
*/
const navbar = document.getElementById("navbar");

function updateNavbarOnScroll() {
  navbar.classList.toggle("is-scrolled", window.scrollY > 20);
}
window.addEventListener("scroll", updateNavbarOnScroll, { passive: true });
updateNavbarOnScroll();

/*
================================================================================================
MOBILE MENU
================================================================================================
*/
const menuToggle = document.getElementById("menuToggle");
const navLinksEl = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinksEl.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

// Close the mobile menu after a link is tapped
navLinksEl.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinksEl.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/*
================================================================================================
ACTIVE NAV LINK ON SCROLL (scrollspy)
================================================================================================
*/
const sections = document.querySelectorAll("main > section[id]");
const navLinkMap = new Map();
document.querySelectorAll(".nav-link").forEach((link) => {
  navLinkMap.set(link.getAttribute("href").slice(1), link);
});

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinkMap.forEach((link) => link.classList.remove("is-active"));
      const activeLink = navLinkMap.get(entry.target.id);
      if (activeLink) activeLink.classList.add("is-active");
    });
  },
  { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
);

sections.forEach((section) => spyObserver.observe(section));

/*
================================================================================================
SCROLL-REVEAL ANIMATIONS
================================================================================================
*/
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

function observeReveals(root = document) {
  root.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
}

/*
================================================================================================
RENDER SKILLS
Progress bars fill via a second IntersectionObserver so the animation
plays only once the card actually scrolls into view.
================================================================================================
*/
const skillsGrid = document.getElementById("skillsGrid");

function renderSkills() {
  SKILLS.forEach((skill) => {
    const card = document.createElement("div");
    card.className = "skill-card reveal";
    card.innerHTML = `
      <div class="skill-top">
        <span class="skill-name"><span class="skill-icon" aria-hidden="true">${skill.icon}</span>${skill.name}</span>
        <span class="skill-percent">${skill.level}%</span>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" data-level="${skill.level}"></div>
      </div>
    `;
    skillsGrid.appendChild(card);
  });
}
renderSkills();

const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.level + "%";
        skillBarObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 },
);

document
  .querySelectorAll(".skill-bar-fill")
  .forEach((bar) => skillBarObserver.observe(bar));

/*
================================================================================================
RENDER PROJECTS + FILTERING
================================================================================================
*/
const projectsGrid = document.getElementById("projectsGrid");
const filterButtons = document.querySelectorAll(".filter-btn");

function renderProjects() {
  projectsGrid.innerHTML = "";
  PROJECTS.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card reveal";
    card.dataset.category = project.category;

    card.innerHTML = `
      <div class="card_image">
      <img src="${project.image}" alt="${project.title}">
      </div>
      <div class="project-body">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tech-row">
          ${project.tech.map((t) => `<span class="tech-chip">${t}</span>`).join("")}
        </div>
        <div class="project-links">
          <a href="${project.github}" class="btn btn-outline" target="_blank" rel="noopener">GitHub</a>
          <a href="${project.demo}" class="btn btn-primary" target="_blank" rel="noopener">Live Demo</a>
        </div>
      </div>
    `;
    projectsGrid.appendChild(card);
  });
  observeReveals(projectsGrid);
}
renderProjects();

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-pressed", b === btn ? "true" : "false");
    });

    const filter = btn.dataset.filter;
    document.querySelectorAll(".project-card").forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !matches);
    });
  });
});

/*
================================================================================================
CONTACT FORM VALIDATION
================================================================================================
*/
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "Error");
  const row = field.closest(".form-row");

  row.classList.toggle("has-error", Boolean(message));
  errorEl.textContent = message || "";
}

function validateContactForm() {
  let isValid = true;
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name.length < 2) {
    setFieldError("name", "Please enter your name.");
    isValid = false;
  } else {
    setFieldError("name", "");
  }

  if (!EMAIL_PATTERN.test(email)) {
    setFieldError("email", "Please enter a valid email address.");
    isValid = false;
  } else {
    setFieldError("email", "");
  }

  if (subject.length < 3) {
    setFieldError("subject", "Please enter a subject.");
    isValid = false;
  } else {
    setFieldError("subject", "");
  }

  if (message.length < 10) {
    setFieldError("message", "Message should be at least 10 characters.");
    isValid = false;
  } else {
    setFieldError("message", "");
  }

  return isValid;
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formSuccess.textContent = "";

  if (!validateContactForm()) return;

  /*
================================================================================================
No backend is wired up in this template — this simulates a successful
send so the UI flow can be reviewed end to end.
================================================================================================
*/
  formSuccess.textContent =
    "Thanks! Your message has been sent — I'll reply soon.";
  contactForm.reset();
});

/*
================================================================================================
BACK TO TOP
================================================================================================
*/
const backToTop = document.getElementById("backToTop");

window.addEventListener(
  "scroll",
  () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 500);
  },
  { passive: true },
);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/*
================================================================================================
FOOTER YEAR + INIT
================================================================================================
*/
document.getElementById("year").textContent = new Date().getFullYear();

observeReveals(); // catch all static .reveal elements present at load

/*
================================================================================================
3D TILT — pointer-driven perspective tilt for elements marked [data-tilt]
================================================================================================
*/
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function initTilt(el) {
  const maxTilt = Number(el.dataset.tiltMax) || 8;

  function handleMove(event) {
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width; // 0 -> 1
    const y = (event.clientY - rect.top) / rect.height; // 0 -> 1
    const ry = (x - 0.5) * (maxTilt * 2); // rotateY
    const rx = (0.5 - y) * (maxTilt * 2); // rotateX

    el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    el.style.setProperty("--tz", "18px");
    el.classList.add("is-tilting");
  }

  function handleLeave() {
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--tz", "0px");
    el.classList.remove("is-tilting");
  }

  el.addEventListener("pointermove", handleMove);
  el.addEventListener("pointerleave", handleLeave);
}

if (!prefersReducedMotion) {
  document.querySelectorAll("[data-tilt]").forEach(initTilt);
}

/*
================================================================================================
SPOTLIGHT GLOW — tracks the pointer over skill/project cards to drive a CSS radial highlight
(--mx / --my custom properties consumed by .skill-card::before and .project-card::after)
================================================================================================
*/
function attachSpotlight(container, selector) {
  container.addEventListener("pointermove", (event) => {
    const card = event.target.closest(selector);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const mx = ((event.clientX - rect.left) / rect.width) * 100;
    const my = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${mx}%`);
    card.style.setProperty("--my", `${my}%`);
  });
}

if (!prefersReducedMotion) {
  attachSpotlight(skillsGrid, ".skill-card");
  attachSpotlight(projectsGrid, ".project-card");

  // Light tilt on project cards too, added post-render since cards are dynamic
  document
    .querySelectorAll(".project-card")
    .forEach((card) => {
      card.dataset.tilt = "";
      card.dataset.tiltMax = "5";
      card.classList.add("tilt");
      initTilt(card);
    });
}
