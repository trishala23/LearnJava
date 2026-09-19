/* ==========================================================================
   Live Java playground — lets a reader edit and actually compile/run Java,
   right from a static GitHub Pages site, using Piston's free public code
   execution API (https://github.com/engineer-man/piston, hosted at
   emkc.org). No backend of our own is needed; this runs entirely in the
   reader's browser and requires internet access.
   ========================================================================== */

const PISTON_EXECUTE_URL = "https://emkc.org/api/v2/piston/execute";

async function runOnPiston(code) {
  const res = await fetch(PISTON_EXECUTE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "java",
      version: "*",
      files: [{ name: "Main.java", content: code }],
    }),
  });

  if (!res.ok) {
    throw new Error(`The online Java runner returned an error (HTTP ${res.status}).`);
  }

  const data = await res.json();
  const compileStderr = data.compile && data.compile.stderr ? data.compile.stderr.trim() : "";
  const run = data.run || {};
  const stdout = (run.stdout || "").trim();
  const stderr = (run.stderr || "").trim();

  let isError = Boolean(compileStderr) || Boolean(stderr);
  let text = "";
  if (compileStderr) text += compileStderr;
  if (stdout) text += (text ? "\n" : "") + stdout;
  if (stderr) text += (text ? "\n" : "") + stderr;
  if (!text) text = "(program produced no output)";

  return { text, isError };
}

function initPlaygrounds() {
  document.querySelectorAll(".playground").forEach((el) => {
    const textarea = el.querySelector("textarea");
    const runBtn = el.querySelector(".playground-run-btn");
    const resetBtn = el.querySelector(".playground-reset-btn");
    const output = el.querySelector(".playground-output");
    if (!textarea || !runBtn || !output) return;

    const original = textarea.value;

    resetBtn?.addEventListener("click", () => {
      textarea.value = original;
      output.style.display = "none";
      output.textContent = "";
      output.classList.remove("has-error");
    });

    runBtn.addEventListener("click", async () => {
      const code = textarea.value;
      output.style.display = "block";
      output.classList.remove("has-error");
      output.textContent = "Compiling & running on a free public Java runner (emkc.org)…";
      runBtn.disabled = true;
      const label = runBtn.textContent;
      runBtn.textContent = "Running…";

      try {
        const { text, isError } = await runOnPiston(code);
        output.textContent = text;
        output.classList.toggle("has-error", isError);
      } catch (err) {
        output.textContent =
          "Couldn't reach the online Java runner — check your internet connection and try again.\n" +
          "(" + err.message + ")";
        output.classList.add("has-error");
      } finally {
        runBtn.disabled = false;
        runBtn.textContent = label;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initPlaygrounds);
