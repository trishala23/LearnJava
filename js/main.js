/* ==========================================================================
   LearnJava — shared site behaviour: nav injection, theme, animations,
   progress tracking, code tabs, and the tiny "run" simulator.
   ========================================================================== */

const NAV_LINKS = [
  { href: "index.html", label: "Home" },
  { href: "basics.html", label: "Java Basics" },
  { href: "java8.html", label: "Java 8" },
  { href: "java11.html", label: "Java 11" },
  { href: "java21.html", label: "Java 21" },
  { href: "java25.html", label: "Java 25" },
  { href: "advanced.html", label: "Advanced" },
  { href: "interview.html", label: "Interview Qs" },
];

function currentPage() {
  const p = location.pathname.split("/").pop();
  return p === "" ? "index.html" : p;
}

function injectNav() {
  const mount = document.getElementById("site-header");
  if (!mount) return;
  const page = currentPage();
  const links = NAV_LINKS.map(
    (l) => `<a href="${l.href}" class="${l.href === page ? "active" : ""}">${l.label}</a>`
  ).join("");
  mount.innerHTML = `
    <nav class="site-nav">
      <div class="nav-inner">
        <a href="index.html" class="brand"><span class="cup">☕</span> LearnJava</a>
        <button class="nav-toggle icon-btn" id="navToggle" aria-label="Menu">☰</button>
        <div class="nav-links" id="navLinks">${links}</div>
        <button class="icon-btn" id="themeToggle" aria-label="Toggle theme">🌓</button>
      </div>
    </nav>
    <div class="progress-track-bar" id="scrollProgress"></div>
  `;
  document.getElementById("navToggle")?.addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("open");
  });
}

function injectFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  mount.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <p>Built for learners going from <code>public static void main</code> to virtual threads. ☕</p>
        <p>Open source on GitHub — contributions welcome, one branch per change.</p>
      </div>
    </footer>
  `;
}

/* ---------- Theme ---------- */
function initTheme() {
  const stored = localStorage.getItem("lj-theme");
  if (stored) document.documentElement.setAttribute("data-theme", stored);
  document.getElementById("themeToggle")?.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("lj-theme", next);
  });
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = (scrolled || 0) + "%";
  });
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal-up, .card");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in", "reveal");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Typewriter hero effect ---------- */
function initTypewriter() {
  const el = document.querySelector(".typewriter");
  if (!el) return;
  const words = JSON.parse(el.dataset.words || "[]");
  if (!words.length) return;
  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const word = words[wi];
    ci += deleting ? -1 : 1;
    el.textContent = word.slice(0, ci);
    let delay = deleting ? 45 : 90;
    if (!deleting && ci === word.length) { delay = 1400; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
    setTimeout(tick, delay);
  }
  tick();
}

/* ---------- Code tabs ---------- */
function initCodeTabs() {
  document.querySelectorAll(".code-tabs").forEach((wrap) => {
    const btns = wrap.querySelectorAll(".code-tab-btn");
    const panels = wrap.querySelectorAll(".code-tab-panel");
    btns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("active"));
        panels.forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        panels[i].classList.add("active");
      });
    });
  });
}

/* ---------- Fake "Run" simulator ----------
   Each runnable block carries data-output (pre-baked console text) so the
   page stays 100% static (no server / real JVM) while still feeling live. */
function initRunButtons() {
  document.querySelectorAll(".run-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const full = target.dataset.output || "";
      target.textContent = "";
      target.style.display = "block";
      let i = 0;
      btn.disabled = true;
      const original = btn.textContent;
      btn.textContent = "Running…";
      const timer = setInterval(() => {
        target.textContent += full[i] || "";
        i++;
        if (i > full.length) {
          clearInterval(timer);
          btn.disabled = false;
          btn.textContent = original;
        }
      }, 12);
    });
  });
}

/* ---------- Section-complete tracking (localStorage) ---------- */
function initMarkComplete() {
  document.querySelectorAll(".mark-complete").forEach((btn) => {
    const key = "lj-done-" + btn.dataset.section;
    if (localStorage.getItem(key) === "1") {
      btn.classList.add("done");
      btn.textContent = "✅ Marked complete";
    }
    btn.addEventListener("click", () => {
      const done = btn.classList.toggle("done");
      localStorage.setItem(key, done ? "1" : "0");
      btn.textContent = done ? "✅ Marked complete" : "☐ Mark this topic complete";
    });
  });
  updateHomeProgress();
}

function updateHomeProgress() {
  document.querySelectorAll("[data-progress-key]").forEach((bar) => {
    const key = bar.dataset.progressKey;
    const total = Number(bar.dataset.total || 1);
    let done = 0;
    for (let i = 1; i <= total; i++) {
      if (localStorage.getItem(`lj-done-${key}-${i}`) === "1") done++;
    }
    const pct = Math.round((done / total) * 100);
    const inner = bar.querySelector("span");
    if (inner) inner.style.width = pct + "%";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  injectNav();
  injectFooter();
  initTheme();
  initScrollProgress();
  initReveal();
  initTypewriter();
  initCodeTabs();
  initRunButtons();
  initMarkComplete();
});
