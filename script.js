const buttons = document.querySelectorAll(".lang-button");
const savedLanguage = localStorage.getItem("portfolio-language") || "en";
const pageKey = window.location.pathname.split("/").pop() || "index.html";
const localizedPageMeta = {
  "index.html": {
    en: { title: "Mengyin Li | Sports Marketing Portfolio", description: "Sports marketing and event strategy portfolio for Mengyin Li, focused on running, outdoor culture, sports PR and brand community storytelling." },
    zh: { title: "李梦茵 Eva Li | 体育营销作品集", description: "李梦茵的体育营销与赛事策略作品集，聚焦跑步、户外文化、体育公关与品牌社群叙事。" },
  },
  "case-studies.html": {
    en: { title: "Case Studies | Mengyin Li", description: "Selected sports marketing case studies by Mengyin Li." },
    zh: { title: "案例研究 | 李梦茵 Eva Li", description: "李梦茵的精选体育营销案例，涵盖体育公关、跑步品牌活动、目的地策略与越野社群复盘。" },
  },
  "project-snapshots.html": {
    en: { title: "Project Snapshots | Mengyin Li", description: "Additional project snapshots from Mengyin Li's sports, lifestyle and outdoor marketing work." },
    zh: { title: "项目速览 | 李梦茵 Eva Li", description: "李梦茵的体育、生活方式与户外营销补充项目速览。" },
  },
};

function setLanguage(language) {
  document.body.classList.toggle("is-zh", language === "zh");
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  buttons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === language);
  });
  document.querySelectorAll("[data-aria-en]").forEach((element) => {
    element.setAttribute("aria-label", element.dataset[language === "zh" ? "ariaZh" : "ariaEn"]);
  });
  const pageMeta = localizedPageMeta[pageKey]?.[language];
  if (pageMeta) {
    document.title = pageMeta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", pageMeta.description);
  }
  localStorage.setItem("portfolio-language", language);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

setLanguage(savedLanguage);

const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const lightbox = document.querySelector("#image-lightbox");

if (lightbox) {
  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("#lightbox-caption");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const previousButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");
  const counter = lightbox.querySelector(".lightbox-count");
  const selector = ".evidence-grid img, .hoka-gallery img, .snapshot-evidence img";
  const evidenceImages = [...document.querySelectorAll(selector)];
  let gallery = [];
  let currentIndex = 0;
  let opener = null;

  function renderImage() {
    const image = gallery[currentIndex];
    const figure = image.closest("figure");
    const language = document.body.classList.contains("is-zh") ? "zh" : "en";
    const caption = figure?.querySelector(`figcaption.lang-${language}-only`);
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption?.textContent || image.alt;
    counter.textContent = `${currentIndex + 1} / ${gallery.length}`;
    previousButton.disabled = nextButton.disabled = gallery.length < 2;
  }

  function moveImage(direction) {
    currentIndex = (currentIndex + direction + gallery.length) % gallery.length;
    renderImage();
  }

  function openLightbox(image) {
    opener = image;
    const project = image.closest(".case-study, .snapshot-study");
    gallery = project ? [...project.querySelectorAll(selector)] : [image];
    currentIndex = gallery.indexOf(image);
    renderImage();
    lightbox.showModal();
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  evidenceImages.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-haspopup", "dialog");
    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  // Keep native pinch zoom and vertical scrolling; only clear, single-finger
  // horizontal gestures on an unzoomed image change the page.
  let swipeStart = null;
  lightboxImage.addEventListener("touchstart", (event) => {
    swipeStart = event.touches.length === 1 && (window.visualViewport?.scale || 1) <= 1.01
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY, time: performance.now() }
      : null;
  }, { passive: true });
  lightboxImage.addEventListener("touchmove", (event) => {
    if (event.touches.length !== 1 || (window.visualViewport?.scale || 1) > 1.01) swipeStart = null;
  }, { passive: true });
  lightboxImage.addEventListener("touchcancel", () => { swipeStart = null; }, { passive: true });
  lightboxImage.addEventListener("touchend", (event) => {
    const start = swipeStart;
    swipeStart = null;
    if (!start || event.touches.length || event.changedTouches.length !== 1) return;
    const end = event.changedTouches[0];
    const direction = imageSwipeDirection(end.clientX - start.x, end.clientY - start.y,
      performance.now() - start.time, window.visualViewport?.scale || 1);
    if (direction) moveImage(direction);
  }, { passive: true });

  previousButton.addEventListener("click", () => moveImage(-1));
  nextButton.addEventListener("click", () => moveImage(1));
  closeButton.addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveImage(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  lightbox.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    opener?.focus({ preventScroll: true });
  });
  lightbox.addEventListener("click", (event) => {
    const bounds = lightbox.getBoundingClientRect();
    if (event.target === lightbox && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
      lightbox.close();
    }
  });
}

const caseStudies = document.querySelectorAll(".case-study");
const caseIndexLinks = document.querySelectorAll(".case-index a");

if (caseStudies.length && caseIndexLinks.length) {
  function setCurrentCase(id) {
    caseIndexLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  const hashCase = window.location.hash.slice(1);
  setCurrentCase(hashCase || caseStudies[0].id);

  let caseFrame = 0;
  let lastActiveCase = null;
  function updateCurrentCase() {
    caseFrame = 0;
    const header = document.querySelector(".site-header");
    const index = document.querySelector(".case-index");
    const isMobile = window.matchMedia("(max-width: 980px)").matches;
    const top = (header?.getBoundingClientRect().height || 76) + (isMobile ? index.offsetHeight : 0) + 28;
    let current = caseStudies[0];
    for (const study of caseStudies) {
      if (study.getBoundingClientRect().top <= top) current = study;
    }
    const changed = lastActiveCase !== current.id;
    lastActiveCase = current.id;
    setCurrentCase(current.id);
    if (isMobile && changed) {
      const link = index.querySelector('[aria-current="true"]');
      const bounds = index.getBoundingClientRect();
      const item = link?.getBoundingClientRect();
      if (item && (item.left < bounds.left || item.right > bounds.right)) {
        index.scrollTo({ left: index.scrollLeft + item.left - bounds.left - 12, behavior: "auto" });
      }
    }
  }
  function scheduleCaseUpdate() {
    if (!caseFrame) caseFrame = requestAnimationFrame(updateCurrentCase);
  }
  window.addEventListener("scroll", scheduleCaseUpdate, { passive: true });
  window.addEventListener("resize", scheduleCaseUpdate);
  window.addEventListener("load", scheduleCaseUpdate);
  scheduleCaseUpdate();

}

const snapshotStudies = document.querySelectorAll(".snapshot-study");
const snapshotIndexLinks = document.querySelectorAll(".snapshot-index a");

if (snapshotStudies.length && snapshotIndexLinks.length) {
  function setCurrentSnapshot(id) {
    snapshotIndexLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  const hashSnapshot = window.location.hash.slice(1);
  setCurrentSnapshot(hashSnapshot || snapshotStudies[0].id);

  const snapshotObserver = new IntersectionObserver(
    (entries) => {
      const currentEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (currentEntry) setCurrentSnapshot(currentEntry.target.id);
    },
    { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
  );

  snapshotStudies.forEach((study) => snapshotObserver.observe(study));
}

// Header height changes with viewport width and language.
const siteHeader = document.querySelector(".site-header");
if (siteHeader) {
  const updateHeaderHeight = () => {
    document.documentElement.style.setProperty("--site-header-height", `${siteHeader.getBoundingClientRect().height}px`);
  };
  new ResizeObserver(updateHeaderHeight).observe(siteHeader);
  updateHeaderHeight();
}

// A swipe is deliberate, mostly horizontal, quick and performed before zooming.
function imageSwipeDirection(dx, dy, duration, scale) {
  if (scale > 1.01 || duration > 800 || Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.6) return 0;
  return dx < 0 ? 1 : -1;
}

// Match visual and keyboard reading order; preserve the desktop sequence.
const homepageAbout = document.querySelector("#home > #about");
const homepageProjects = document.querySelector("#home > #projects");
if (homepageAbout && homepageProjects) {
  const mobileLayout = window.matchMedia("(max-width: 980px)");
  const orderHomepage = () => {
    const first = mobileLayout.matches ? homepageProjects : homepageAbout;
    const second = mobileLayout.matches ? homepageAbout : homepageProjects;
    if (first.nextElementSibling !== second) second.before(first);
  };
  mobileLayout.addEventListener("change", orderHomepage);
  orderHomepage();
}

const mobileCaseIndex = document.querySelector(".case-index");
if (mobileCaseIndex) {
  new ResizeObserver(() => {
    document.documentElement.style.setProperty("--case-index-height", `${mobileCaseIndex.offsetHeight}px`);
  }).observe(mobileCaseIndex);
}
