const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80&auto=format&fit=crop",
    alt: "Golden sunset light over layered mountain ranges",
    title: "Last Light",
    category: "nature",
  },
  {
    src: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900&q=80&auto=format&fit=crop",
    alt: "Thin morning mist drifting through a quiet pine forest",
    title: "Morning Mist",
    category: "nature",
  },
  {
    src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=900&q=80&auto=format&fit=crop",
    alt: "Wide green valley under a bright open sky",
    title: "Open Valley",
    category: "nature",
  },
  {
    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&q=80&auto=format&fit=crop",
    alt: "Glowing lines of code displayed on a dark screen",
    title: "Source Code",
    category: "technology",
  },
  {
    src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&q=80&auto=format&fit=crop",
    alt: "Modern workspace with a laptop, notebook, and coffee",
    title: "Working Late",
    category: "technology",
  },
  {
    src: "https://images.unsplash.com/photo-1499591934245-40b55745b905?w=900&q=80&auto=format&fit=crop",
    alt: "Empty desert highway stretching to the horizon",
    title: "Open Highway",
    category: "travel",
  },
  {
    src: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80&auto=format&fit=crop",
    alt: "Turquoise coastline viewed from a cliffside path",
    title: "Coastal Edge",
    category: "travel",
  },
  {
    src: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=900&q=80&auto=format&fit=crop",
    alt: "Dirt road winding through a golden countryside",
    title: "Backroad",
    category: "travel",
  },
  {
    src: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=900&q=80&auto=format&fit=crop",
    alt: "Symmetrical facade of a modern building against a clear sky",
    title: "Clean Lines",
    category: "architecture",
  },
  {
    src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&q=80&auto=format&fit=crop",
    alt: "Interior hallway with dramatic light and shadow",
    title: "Light Well",
    category: "architecture",
  },
  {
    src: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=900&q=80&auto=format&fit=crop",
    alt: "Close portrait of a person in soft natural light",
    title: "Held Gaze",
    category: "people",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80&auto=format&fit=crop&utm_source",
    alt: "Small group of people walking and talking together",
    title: "Walking Together",
    category: "people",
  },
];

let activeFilter = "all";
let visibleImages = IMAGES;
let currentLightboxIndex = 0;

const galleryGrid = document.getElementById("galleryGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lbImage");
const lbTitle = document.getElementById("lbTitle");
const lbCounter = document.getElementById("lbCounter");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");
function renderGallery() {
  galleryGrid.innerHTML = "";

  IMAGES.forEach((image, index) => {
    const isVisible = activeFilter === "all" || image.category === activeFilter;

    const item = document.createElement("button");
    item.className =
      "gallery-item" + (isVisible ? " is-entering" : " is-hidden");
    item.setAttribute("type", "button");
    item.setAttribute(
      "aria-label",
      `Open ${image.title} (${image.category}) in full view`,
    );
    item.dataset.index = index;
    item.innerHTML = `
      <img src="${image.src}" alt="${image.alt}" loading="lazy">
      <span class="item-overlay">
        <span class="item-category">${capitalize(image.category)}</span>
        <span class="item-title">${image.title}</span>
      </span>
    `;
    item.addEventListener("click", () => openLightbox(index));
    galleryGrid.appendChild(item);
  });
  visibleImages = IMAGES.filter(
    (img) => activeFilter === "all" || img.category === activeFilter,
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    activeFilter = btn.dataset.filter;

    filterButtons.forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-pressed", b === btn ? "true" : "false");
    });

    renderGallery();
  });
});

function openLightbox(fullIndex) {
  const image = IMAGES[fullIndex];
  currentLightboxIndex = visibleImages.indexOf(image);
  showLightboxImage();

  lightbox.hidden = false;
  requestAnimationFrame(() => lightbox.classList.add("is-open"));

  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  document.body.style.overflow = "";
  setTimeout(() => {
    lightbox.hidden = true;
  }, 300);
}

function showLightboxImage() {
  const image = visibleImages[currentLightboxIndex];
  lbImage.src = image.src;
  lbImage.alt = image.alt;
  lbTitle.textContent = image.title;
  lbCounter.textContent = `${currentLightboxIndex + 1} / ${visibleImages.length}`;
}

function showNext() {
  currentLightboxIndex = (currentLightboxIndex + 1) % visibleImages.length;
  showLightboxImage();
}

function showPrev() {
  currentLightboxIndex =
    (currentLightboxIndex - 1 + visibleImages.length) % visibleImages.length;
  showLightboxImage();
}

lbClose.addEventListener("click", closeLightbox);
lbNext.addEventListener("click", showNext);
lbPrev.addEventListener("click", showPrev);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") showNext();
  if (event.key === "ArrowLeft") showPrev();
});

renderGallery();
