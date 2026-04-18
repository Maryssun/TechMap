/* =====================================================
   TechMap - App
   Comportamento global da plataforma
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  initMenu();
  initScrollReveal();
  initSmoothAnchorScroll();
  initActiveSectionLinks();
  initExternalLinks();
  initPageState();
}

/* =============================
   MENU MOBILE
   ============================= */

function initMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");

  if (!menuToggle || !nav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  const navLinks = nav.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = nav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
  });
}

/* =============================
   SCROLL REVEAL
   ============================= */

function initScrollReveal() {
  const elements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-zoom"
  );

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  elements.forEach((element) => observer.observe(element));
}

/* =============================
   ÂNCORAS INTERNAS
   ============================= */

function initSmoothAnchorScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      const header = document.querySelector(".site-header");
      const headerOffset = header ? header.offsetHeight + 16 : 0;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });
}

/* =============================
   LINK ATIVO POR SEÇÃO
   ============================= */

function initActiveSectionLinks() {
  const pageAnchors = document.querySelectorAll('.primary-nav a[href^="#"]');
  if (!pageAnchors.length) return;

  const sections = [...pageAnchors]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = `#${entry.target.id}`;
        const relatedLink = document.querySelector(`.primary-nav a[href="${id}"]`);
        if (!relatedLink) return;

        if (entry.isIntersecting) {
          pageAnchors.forEach((anchor) => anchor.classList.remove("active"));
          relatedLink.classList.add("active");
        }
      });
    },
    {
      threshold: 0.45,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* =============================
   LINKS EXTERNOS
   ============================= */

function initExternalLinks() {
  const links = document.querySelectorAll('a[href^="http"]');

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const isExternal = !href.includes(window.location.hostname);

    if (isExternal) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });
}

/* =============================
   ESTADO DA PÁGINA
   ============================= */

function initPageState() {
  document.documentElement.classList.add("is-ready");

  const currentPage = getCurrentPageName();
  document.body.setAttribute("data-page", currentPage);
}

function getCurrentPageName() {
  const path = window.location.pathname.toLowerCase();

  if (path.includes("discover")) return "discover";
  if (path.includes("career-areas")) return "career-areas";
  if (path.includes("career-paths")) return "career-paths";
  if (path.includes("study-guide")) return "study-guide";
  if (path.includes("tools")) return "tools";
  if (path.includes("resources")) return "resources";
  if (path.includes("communities")) return "communities";
  if (path.includes("about")) return "about";
  if (path.includes("area-detail")) return "area-detail";

  return "home";
}

/* =============================
   UTILIDADES
   ============================= */

function debounce(fn, delay = 250) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

window.TechMapApp = {
  debounce,
  getCurrentPageName,
};