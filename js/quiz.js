/* ==========================================================================
   Reusable quiz engine + interview accordion + filter/search behaviour.
   Pages define a `QUIZ_DATA` array and/or `INTERVIEW_DATA` array before
   including this script.
   ========================================================================== */

function buildQuiz(containerId, data, storageKey) {
  const root = document.getElementById(containerId);
  if (!root || !data || !data.length) return;
  let idx = 0;
  let score = 0;
  const answered = new Array(data.length).fill(false);

  function render() {
    const q = data[idx];
    root.innerHTML = `
      <div class="quiz-q">Q${idx + 1} of ${data.length}. ${q.q}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `<button class="quiz-option" data-i="${i}">${opt}</button>`).join("")}
      </div>
      <div class="quiz-feedback" id="${containerId}-fb"></div>
      <div class="quiz-nav">
        <span class="quiz-score">Score: ${score} / ${data.length}</span>
        <div>
          <button class="btn btn-ghost" id="${containerId}-prev" ${idx === 0 ? "disabled" : ""}>← Prev</button>
          <button class="btn btn-primary" id="${containerId}-next" ${idx === data.length - 1 ? "disabled" : ""}>Next →</button>
        </div>
      </div>
    `;
    if (answered[idx]) lockOptions(q);
    root.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => handleAnswer(btn, q));
    });
    root.querySelector(`#${containerId}-prev`)?.addEventListener("click", () => { idx--; render(); });
    root.querySelector(`#${containerId}-next`)?.addEventListener("click", () => { idx++; render(); });
  }

  function lockOptions(q) {
    root.querySelectorAll(".quiz-option").forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correct) btn.classList.add("correct");
    });
  }

  function handleAnswer(btn, q) {
    if (answered[idx]) return;
    answered[idx] = true;
    const i = Number(btn.dataset.i);
    const fb = document.getElementById(`${containerId}-fb`);
    if (i === q.correct) {
      btn.classList.add("correct");
      score++;
      fb.textContent = "✅ Correct — " + (q.explain || "");
      fb.style.color = "var(--accent)";
    } else {
      btn.classList.add("wrong");
      root.querySelectorAll(".quiz-option")[q.correct].classList.add("correct");
      fb.textContent = "❌ Not quite — " + (q.explain || "");
      fb.style.color = "var(--danger)";
    }
    lockOptions(q);
    root.querySelector(".quiz-score").textContent = `Score: ${score} / ${data.length}`;
    if (storageKey && idx === data.length - 1) {
      localStorage.setItem(storageKey, String(score));
    }
  }

  render();
}

function buildAccordion(containerId, data) {
  const root = document.getElementById(containerId);
  if (!root || !data) return;

  function draw(list) {
    root.innerHTML = list
      .map(
        (item, i) => `
      <div class="accordion-item" data-cat="${item.cat}">
        <div class="accordion-header">
          <span><span class="qnum">Q${i + 1}.</span>${item.q}
            <span class="difficulty diff-${item.diff}">${item.diff}</span>
          </span>
          <span class="chev">▾</span>
        </div>
        <div class="accordion-body"><p>${item.a}</p></div>
      </div>`
      )
      .join("");
    root.querySelectorAll(".accordion-item").forEach((item) => {
      const header = item.querySelector(".accordion-header");
      const body = item.querySelector(".accordion-body");
      header.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        root.querySelectorAll(".accordion-item.open").forEach((o) => {
          o.classList.remove("open");
          o.querySelector(".accordion-body").style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add("open");
          body.style.maxHeight = body.scrollHeight + 40 + "px";
        }
      });
    });
  }

  draw(data);

  const search = document.getElementById(containerId + "-search");
  const chips = document.querySelectorAll(`[data-filter-for="${containerId}"]`);
  let activeCat = "all";

  function applyFilters() {
    const term = (search?.value || "").toLowerCase();
    const filtered = data.filter((item) => {
      const matchesCat = activeCat === "all" || item.cat === activeCat;
      const matchesTerm = !term || item.q.toLowerCase().includes(term) || item.a.toLowerCase().includes(term);
      return matchesCat && matchesTerm;
    });
    draw(filtered);
  }

  search?.addEventListener("input", applyFilters);
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeCat = chip.dataset.cat;
      applyFilters();
    });
  });
}
