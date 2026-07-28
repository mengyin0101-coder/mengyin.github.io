const buttons = document.querySelectorAll(".lang-button");
const savedLanguage = localStorage.getItem("portfolio-language") || "en";

function setLanguage(language) {
  document.body.classList.toggle("is-zh", language === "zh");
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  buttons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === language);
  });
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
  const evidenceImages = document.querySelectorAll(".evidence-grid img, .hoka-gallery img");

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
