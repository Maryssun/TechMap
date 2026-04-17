/* =====================================================
   TechMap - Areas
   Renderização dinâmica das áreas da tecnologia
   ===================================================== */

async function initAreasPage() {
  const areasContainer = document.querySelector("[data-areas-grid]");

  if (!areasContainer) {
    console.warn("[Areas] Container de áreas não encontrado.");
    return;
  }

  setLoadingState(areasContainer, "Carregando áreas...");

  const areas = await DataLoader.loadAreas();

  if (!areas || !Array.isArray(areas) || areas.length === 0) {
    setEmptyState(
      areasContainer,
      "Nenhuma área foi encontrada no momento."
    );
    return;
  }

  renderAreas(areasContainer, areas);
}

/* =============================
   RENDER PRINCIPAL
   ============================= */

function renderAreas(container, areas) {
  container.innerHTML = "";

  const fragment = document.createDocumentFragment();

  areas.forEach((area) => {
    const card = createAreaCard(area);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

/* =============================
   CARD
   ============================= */

function createAreaCard(area) {
  const article = document.createElement("article");
  article.className = "area-card";
  article.setAttribute("data-area-id", safeText(area.id || ""));

  const title = document.createElement("h3");
  title.textContent = safeText(area.nome || "Área sem nome");

  const description = document.createElement("p");
  description.textContent = safeText(area.descricao || "Descrição não disponível.");

  const meta = document.createElement("div");
  meta.className = "area-meta";
  meta.textContent = buildMetaText(area);

  const profileTitle = document.createElement("strong");
  profileTitle.textContent = "Perfil mais comum";

  const profileList = createList(area.perfil, 3);

  const stepsTitle = document.createElement("strong");
  stepsTitle.textContent = "Primeiros passos";

  const stepsList = createList(area.primeiros_passos, 3);

  const toolsTitle = document.createElement("strong");
  toolsTitle.textContent = "Ferramentas que aparecem";

  const toolsList = createTagList(area.ferramentas, 4);

  const link = document.createElement("a");
  link.href = `./area-detail.html?id=${encodeURIComponent(area.id || "")}`;
  link.className = "text-link";
  link.setAttribute("aria-label", `Ver detalhes da área ${safeText(area.nome || "")}`);
  link.textContent = "Ver detalhes da área";

  article.appendChild(title);
  article.appendChild(description);
  article.appendChild(meta);
  article.appendChild(profileTitle);
  article.appendChild(profileList);
  article.appendChild(stepsTitle);
  article.appendChild(stepsList);
  article.appendChild(toolsTitle);
  article.appendChild(toolsList);
  article.appendChild(link);

  return article;
}

/* =============================
   META
   ============================= */

function buildMetaText(area) {
  const cargos = Array.isArray(area.cargos_iniciais)
    ? area.cargos_iniciais.length
    : 0;

  const ferramentas = Array.isArray(area.ferramentas)
    ? area.ferramentas.length
    : 0;

  return `${cargos} possibilidades iniciais • ${ferramentas} ferramentas em destaque`;
}

/* =============================
   LISTAS
   ============================= */

function createList(items, limit = 3) {
  const list = document.createElement("ul");
  list.className = "stack-sm";

  if (!Array.isArray(items) || items.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Informação não disponível.";
    list.appendChild(item);
    return list;
  }

  items.slice(0, limit).forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = safeText(entry);
    list.appendChild(item);
  });

  return list;
}

function createTagList(items, limit = 4) {
  const wrapper = document.createElement("div");
  wrapper.className = "inline-actions";

  if (!Array.isArray(items) || items.length === 0) {
    const emptyTag = document.createElement("span");
    emptyTag.className = "pill";
    emptyTag.textContent = "Sem ferramentas";
    wrapper.appendChild(emptyTag);
    return wrapper;
  }

  items.slice(0, limit).forEach((entry) => {
    const tag = document.createElement("span");
    tag.className = "pill";
    tag.textContent = safeText(entry);
    wrapper.appendChild(tag);
  });

  return wrapper;
}

/* =============================
   ESTADOS DE TELA
   ============================= */

function setLoadingState(container, message = "Carregando...") {
  container.innerHTML = "";

  const state = document.createElement("div");
  state.className = "empty-state loading";
  state.textContent = message;

  container.appendChild(state);
}

function setEmptyState(container, message = "Nenhum conteúdo disponível.") {
  container.innerHTML = "";

  const state = document.createElement("div");
  state.className = "empty-state";
  state.textContent = message;

  container.appendChild(state);
}

/* =============================
   SEGURANÇA / SANITIZAÇÃO SIMPLES
   ============================= */

function safeText(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}