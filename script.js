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
  const lightboxCaption = lightbox.querySelector("p");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const evidenceImages = document.querySelectorAll(".evidence-grid img, .hoka-gallery img, .snapshot-evidence img");

  function openLightbox(image) {
    const figure = image.closest("figure");
    const preferredCaption = document.body.classList.contains("is-zh")
      ? figure?.querySelector("figcaption.lang-zh-only")
      : figure?.querySelector("figcaption.lang-en-only");

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = preferredCaption?.textContent || image.alt;
    lightbox.showModal();
  }

  evidenceImages.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
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

  const caseObserver = new IntersectionObserver(
    (entries) => {
      const currentEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (currentEntry) setCurrentCase(currentEntry.target.id);
    },
    { rootMargin: "-18% 0px -58% 0px", threshold: [0.1, 0.3, 0.55] },
  );

  caseStudies.forEach((study) => caseObserver.observe(study));
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
