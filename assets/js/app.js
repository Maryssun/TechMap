/* =====================================================
   TechMap - App Core
   Inicialização geral da aplicação
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

/* =============================
   INIT PRINCIPAL
   ============================= */

function initApp() {
  initMenu();
  initPage();
  initAccessibility();
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
    menuToggle.setAttribute("aria-expanded", isOpen);
  });
}

/* =============================
   DETECÇÃO DE PÁGINA
   ============================= */

function getCurrentPage() {
  const path = window.location.pathname;

  if (path.includes("discover")) return "discover";
  if (path.includes("career-areas")) return "areas";
  if (path.includes("career-paths")) return "paths";
  if (path.includes("study-guide")) return "study";
  if (path.includes("communities")) return "community";
  if (path.includes("tools")) return "tools";
  if (path.includes("about")) return "about";

  return "home";
}

/* =============================
   INICIALIZAÇÃO POR PÁGINA
   ============================= */

function initPage() {
  const page = getCurrentPage();

  switch (page) {
    case "discover":
      initDiscoverPage();
      break;

    case "areas":
      initAreasPage();
      break;

    case "paths":
      initPathsPage();
      break;

    case "study":
      initStudyPage();
      break;

    case "community":
      initCommunityPage();
      break;

    case "tools":
      initToolsPage();
      break;

    default:
      initHomePage();
  }
}

/* =============================
   HOME
   ============================= */

function initHomePage() {
  console.log("Home carregada");
}

/* =============================
   DISCOVER
   ============================= */

function initDiscoverPage() {
  console.log("Discover carregado");

  // futura lógica de questionário
}

/* =============================
   AREAS
   ============================= */

function initAreasPage() {
  console.log("Áreas carregadas");

  // futura renderização de areas.json
}

/* =============================
   PATHS
   ============================= */

function initPathsPage() {
  console.log("Paths carregados");
}

/* =============================
   STUDY
   ============================= */

function initStudyPage() {
  console.log("Study guide carregado");
}

/* =============================
   COMMUNITY
   ============================= */

function initCommunityPage() {
  console.log("Comunidades carregadas");
}

/* =============================
   TOOLS
   ============================= */

function initToolsPage() {
  console.log("Ferramentas carregadas");
}

/* =============================
   ACESSIBILIDADE
   ============================= */

function initAccessibility() {
  // foco visível via teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      document.body.classList.add("user-is-tabbing");
    }
  });
}

/* =============================
   UTILIDADES GERAIS
   ============================= */

// debounce (futuro: busca, filtros)
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}