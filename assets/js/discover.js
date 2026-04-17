/* =====================================================
   TechMap - Discover (Questionário Inteligente)
   ===================================================== */

let currentStep = 0;
let answers = [];
let questions = [];

document.addEventListener("DOMContentLoaded", initDiscover);

async function initDiscover() {
  const data = await DataLoader.loadQuestionnaire();

  if (!data || !data.questions) {
    renderError("Não foi possível carregar o questionário.");
    return;
  }

  questions = data.questions;
  renderQuestion();
}

/* =============================
   RENDER PERGUNTA
   ============================= */

function renderQuestion() {
  const container = document.getElementById("question-container");
  const progress = document.getElementById("progress");

  if (!container) return;

  const question = questions[currentStep];

  progress.textContent = `Pergunta ${currentStep + 1} de ${questions.length}`;

  container.innerHTML = `
    <h2>${question.pergunta}</h2>
    <div class="stack-md">
      ${question.opcoes.map((op, index) => `
        <button class="btn btn-secondary option-btn" data-index="${index}">
          ${op.texto}
        </button>
      `).join("")}
    </div>
  `;

  document.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", handleAnswer);
  });
}

/* =============================
   RESPOSTA
   ============================= */

function handleAnswer(e) {
  const index = e.currentTarget.getAttribute("data-index");
  const selected = questions[currentStep].opcoes[index];

  answers.push(selected.peso);

  currentStep++;

  if (currentStep >= questions.length) {
    calculateResult();
  } else {
    renderQuestion();
  }
}

/* =============================
   RESULTADO
   ============================= */

async function calculateResult() {
  const total = {};

  answers.forEach(peso => {
    Object.keys(peso).forEach(area => {
      total[area] = (total[area] || 0) + peso[area];
    });
  });

  const sorted = Object.entries(total)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(item => item[0]);

  const areas = await DataLoader.loadAreas();

  const resultAreas = areas.filter(a => sorted.includes(a.id));

  renderResult(resultAreas);
}

/* =============================
   RENDER RESULTADO
   ============================= */

function renderResult(resultAreas) {
  const container = document.getElementById("question-container");

  container.innerHTML = `
    <h2>Seu resultado</h2>
    <p>Com base nas suas respostas, estes caminhos podem fazer mais sentido:</p>

    <div class="grid-3">
      ${resultAreas.map(area => `
        <div class="area-card">
          <h3>${area.nome}</h3>
          <p>${area.descricao}</p>
          <a class="text-link" href="./area-detail.html?id=${area.id}">
            Ver detalhes
          </a>
        </div>
      `).join("")}
    </div>

    <div style="margin-top: 24px;">
      <a class="btn btn-primary" href="./career-areas.html">
        Ver todas as áreas
      </a>
    </div>
  `;
}

/* =============================
   ERRO
   ============================= */

function renderError(message) {
  const container = document.getElementById("question-container");
  if (!container) return;

  container.innerHTML = `<div class="empty-state">${message}</div>`;
}