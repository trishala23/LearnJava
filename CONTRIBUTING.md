# Contributing to LearnJava

LearnJava is a static, interactive Java tutorial site (plain HTML/CSS/JS,
no build step) published automatically to GitHub Pages whenever `main`
changes. This document is the workflow every change — including changes
made by an AI agent — should follow.

## Branching model

**One branch per change.** Never commit directly to `main`.

```bash
git checkout main
git pull origin main
git checkout -b <type>/<short-description>
# e.g. feat/java21-virtual-threads, fix/quiz-score-bug, content/interview-jvm
```

Suggested prefixes:

| Prefix      | Use for                                              |
|-------------|-------------------------------------------------------|
| `feat/`     | New interactive feature (quiz type, animation, page)  |
| `content/`  | New or revised learning content                       |
| `fix/`      | Bug fixes                                              |
| `chore/`    | Tooling, workflow, docs                                |
| `design/`   | Visual/CSS-only changes                                |

## Making a change

1. Create the branch (above).
2. Edit the relevant page(s) under the repo root and/or `css/style.css`,
   `js/main.js`, `js/quiz.js`.
3. Open the changed `.html` file directly in a browser to verify the
   interactive pieces (quizzes, accordions, animations, theme toggle)
   still work — there is no build/compile step.
4. Commit with a clear message and push the branch:
   ```bash
   git add <files>
   git commit -m "content: add Java 21 structured concurrency section"
   git push -u origin <branch-name>
   ```
5. Open a pull request into `main` using the PR template. Merging to
   `main` triggers `.github/workflows/deploy.yml`, which republishes
   GitHub Pages automatically — no manual deploy step.

## Adding a new content page

1. Copy the `<head>`/nav/footer scaffolding from an existing page (e.g.
   `advanced.html`) so the shared header/footer/theme-toggle keep working.
2. Add the page to `NAV_LINKS` in `js/main.js` so it appears in the nav
   on every page.
3. Add a card linking to it from `index.html`.
4. Reuse existing CSS classes (`.card`, `.code-tabs`, `.accordion-item`,
   `.quiz-box`, `.diagram`, `.timeline`, `.note`, `.playground`) before
   inventing new ones — consistency matters more than novelty here.

## Adding a live, editable Java playground

Most code demos on the site use a static `.run-btn`/`.console-output`
pair (see `js/main.js`'s `initRunButtons`) that just plays back
pre-baked, hard-coded output — fine for "watch this run." For an
exercise a reader should actually be able to edit and run for real,
use the `.playground` component instead (see `java8.html`'s "Try it
yourself" section for a full example):

```html
<div class="playground">
  <div class="playground-toolbar">
    <span class="label">Main.java</span>
    <div class="playground-actions">
      <button class="playground-reset-btn">↺ Reset</button>
      <button class="playground-run-btn">▶ Compile &amp; Run</button>
    </div>
  </div>
  <textarea spellcheck="false" rows="14">public class Main {
    public static void main(String[] args) {
        System.out.println("Hello!");
    }
}</textarea>
  <div class="playground-output"></div>
</div>
```

Include `<script src="js/playground.js"></script>` on the page (see
`java8.html`). It sends the textarea's contents to
[Piston](https://github.com/engineer-man/piston), a free public
code-execution API, and shows the real `javac`/`java` output — no
project backend involved. Requirements: the public class in the code
must be named exactly `Main` (Piston compiles it as `Main.java`), and
the feature needs the reader to be online.

## Adding quiz questions or interview Q&A

Quiz and interview data lives in a `<script>` block near the bottom of
each page as a plain JS array (`QUIZ_DATA` / `INTERVIEW_DATA`) — append
new objects there, no other file needs to change:

```js
{ q: "What does the `var` keyword do in Java 11?", 
  options: ["Declares a dynamically-typed variable", "Infers the type at compile time", "..."],
  correct: 1,
  explain: "var is compile-time type inference, not dynamic typing." }
```

## Style

- No frameworks/build tools — keep the site deployable as static files.
- Respect `prefers-reduced-motion` (already handled globally in
  `style.css`) — don't add animations that ignore it.
- Keep new colors as CSS variables in `:root` (and its dark-mode
  overrides) rather than hard-coded hex values.
