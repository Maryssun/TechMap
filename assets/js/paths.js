/* =====================================================
   TechMap - Paths
   Renderização dinâmica dos caminhos
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "career-paths") return;
  initPathsPage();
});

async function initPathsPage() {
  const grid = document.getElementById("paths-grid");
  if (!grid) return;

  grid.innerHTML = `<div class="empty-state">Carregando caminhos...</div>`;

  const paths = await DataLoader.loadPaths();

  if (!paths || !Array.isArray(paths) || paths.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <strong>Nenhum caminho encontrado.</strong>
        <p>Tente novamente mais tarde.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = "";

  paths.forEach((path) => {
    const card = document.createElement("article");
    card.className = "path-card card hover-lift";

    const areas = Array.isArray(path.area_relacionada)
      ? path.area_relacionada.join(", ")
      : "";

    const steps = Array.isArray(path.passos)
      ? path.passos.slice(0, 3).map((step) => `<li>${escapeHtml(step)}</li>`).join("")
      : "";

    card.innerHTML = `
      <div class="stack-sm">
        <span class="badge badge-primary">Caminho</span>
        <h3 class="card-title">${escapeHtml(path.nome)}</h3>
        <p class="card-description">${escapeHtml(path.resumo || "")}</p>
      </div>

      <div class="stack-sm">
        <strong>Perfil indicado</strong>
        <p class="card-description">${escapeHtml(path.perfil_indicado || "")}</p>
      </div>

      <div class="stack-sm">
        <strong>Áreas relacionadas</strong>
        <p class="card-description">${escapeHtml(areas)}</p>
      </div>

      <div class="stack-sm">
        <strong>Primeiros passos</strong>
        <ul>${steps}</ul>
      </div>

      <a class="text-link" href="./career-areas.html">Explorar áreas relacionadas</a>
    `;

    grid.appendChild(card);
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}