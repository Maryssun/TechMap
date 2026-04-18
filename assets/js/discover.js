/* =====================================================
   TechMap - Discover
   Questionário de descoberta com recomendação de áreas
   ===================================================== */

let discoverQuestions = [];
let discoverAnswers = [];
let discoverCurrentIndex = 0;
let discoverAreas = [];

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "discover") return;
  initDiscoverPage();
});

async function initDiscoverPage() {
  const questionnaireData = await DataLoader.loadQuestionnaire();
  const areasData = await DataLoader.loadAreas();

  if (!questionnaireData || !Array.isArray(questionnaireData.questions) || !areasData) {
    renderDiscoverError("Não foi possível carregar o questionário agora.");
    return;
  }

  discoverQuestions = questionnaireData.questions;
  discoverAreas = areasData;
  discoverAnswers = [];
  discoverCurrentIndex = 0;

  renderDiscoverQuestion();
}

function renderDiscoverQuestion() {
  const questionWrapper = document.getElementById("discover-questionnaire");
  const progressWrapper = document.getElementById("discover-progress");

  if (!questionWrapper || !progressWrapper) return;

  const question = discoverQuestions[discoverCurrentIndex];
  if (!question) return;

  progressWrapper.innerHTML = `
    <div class="inline-actions">
      <span class="badge badge-primary">Pergunta ${discoverCurrentIndex + 1} de ${discoverQuestions.length}</span>
      <span class="badge">${Math.round(((discoverCurrentIndex + 1) / discoverQuestions.length) * 100)}% concluído</span>
    </div>
  `;

  questionWrapper.innerHTML = `
    <div class="stack-lg">
      <div class="stack-sm">
        <h3 class="card-title">${escapeHtml(question.pergunta)}</h3>
        <p class="card-description">Escolha a opção que mais combina com você neste momento.</p>
      </div>

      <div class="grid-2" id="discover-options"></div>

      ${
        discoverCurrentIndex > 0
          ? `<div class="inline-actions"><button class="btn btn-secondary" id="discover-back-button" type="button">Voltar</button></div>`
          : ""
      }
    </div>
  `;

  const optionsContainer = document.getElementById("discover-options");

  question.opcoes.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card hover-lift w-full align-start";
    button.innerHTML = `
      <div class="stack-sm">
        <span class="badge badge-primary">Opção ${index + 1}</span>
        <strong class="card-title">${escapeHtml(option.texto)}</strong>
      </div>
    `;
    button.addEventListener("click", () => selectDiscoverOption(option.peso));
    optionsContainer.appendChild(button);
  });

  const backButton = document.getElementById("discover-back-button");
  if (backButton) {
    backButton.addEventListener("click", goBackDiscoverQuestion);
  }
}

function selectDiscoverOption(weightObject) {
  discoverAnswers[discoverCurrentIndex] = weightObject;
  discoverCurrentIndex += 1;

  if (discoverCurrentIndex >= discoverQuestions.length) {
    renderDiscoverResult();
    return;
  }

  renderDiscoverQuestion();
}

function goBackDiscoverQuestion() {
  if (discoverCurrentIndex <= 0) return;
  discoverCurrentIndex -= 1;
  renderDiscoverQuestion();
}

function renderDiscoverResult() {
  const questionWrapper = document.getElementById("discover-questionnaire");
  const progressWrapper = document.getElementById("discover-progress");
  if (!questionWrapper || !progressWrapper) return;

  const scoreMap = {};

  discoverAnswers.forEach((answer) => {
    Object.entries(answer).forEach(([key, value]) => {
      scoreMap[key] = (scoreMap[key] || 0) + value;
    });
  });

  const sortedIds = Object.entries(scoreMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);

  const recommendedAreas = discoverAreas.filter((area) => sortedIds.includes(area.id));

  progressWrapper.innerHTML = `
    <div class="inline-actions">
      <span class="badge badge-success">Questionário concluído</span>
      <span class="badge">Resultado pronto</span>
    </div>
  `;

  questionWrapper.innerHTML = `
    <div class="stack-lg">
      <div class="stack-sm">
        <h3 class="card-title">Seu resultado</h3>
        <p class="card-description">
          Com base nas suas respostas, estas áreas parecem mais compatíveis com seu perfil atual.
        </p>
      </div>

      <div class="grid-3" id="discover-result-grid"></div>

      <div class="inline-actions">
        <button class="btn btn-secondary" id="discover-restart-button" type="button">Refazer questionário</button>
        <a class="btn btn-primary" href="./career-areas.html">Explorar todas as áreas</a>
      </div>
    </div>
  `;

  const grid = document.getElementById("discover-result-grid");

  recommendedAreas.forEach((area) => {
    const card = document.createElement("article");
    card.className = "area-card card hover-lift";
    card.innerHTML = `
      <div class="stack-sm">
        <span class="badge badge-primary">Área sugerida</span>
        <h4 class="card-title">${escapeHtml(area.nome)}</h4>
        <p class="card-description">${escapeHtml(area.descricao)}</p>
      </div>
      <a class="text-link" href="./area-detail.html?id=${encodeURIComponent(area.id)}">Ver detalhes da área</a>
    `;
    grid.appendChild(card);
  });

  const restartButton = document.getElementById("discover-restart-button");
  if (restartButton) {
    restartButton.addEventListener("click", () => {
      discoverAnswers = [];
      discoverCurrentIndex = 0;
      renderDiscoverQuestion();
    });
  }
}

function renderDiscoverError(message) {
  const questionWrapper = document.getElementById("discover-questionnaire");
  if (!questionWrapper) return;

  questionWrapper.innerHTML = `
    <div class="empty-state">
      <strong>Erro</strong>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}