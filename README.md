# LearnJava ☕

An interactive, animated Java tutorial — from `public static void main` all
the way through Java 8, Java 11, and Java 21, plus advanced topics and an
interview-question bank. Pure static HTML/CSS/JS, published to **GitHub
Pages**.

## Contents

| Page | Covers |
|------|--------|
| `index.html` | Landing page, learning path, release timeline |
| `basics.html` | JVM/JRE/JDK, variables, control flow, arrays, strings (pool, immutability, methods, StringBuilder), enums, classes & objects (constructors, `this`, instance vs static, `equals`/`hashCode`/`toString`), OOP pillars, interfaces (default/static/private methods, constants, diamond problem), exceptions, core collections |
| `java8.html` | Lambdas (syntax forms, variable capture, worked problem statements you can edit and **really** compile/run in-browser), functional interfaces, Streams, method references, default/static interface methods, `Optional`, `java.time` |
| `java11.html` | `var`, new `String`/`Files` methods, `HttpClient`, single-file source launching |
| `java21.html` | Records, sealed classes, pattern matching, record patterns, virtual threads, sequenced collections, text blocks, structured concurrency |
| `java25.html` | Compact source files & instance main methods, module imports, flexible constructor bodies, scoped values, structured concurrency (preview), primitive type patterns, GC/runtime improvements |
| `advanced.html` | Collections internals, generics, concurrency, JVM memory & GC, design patterns, NIO |
| `interview.html` | Searchable/filterable bank of Java interview Q&A |

Every page includes runnable-feeling code demos, animated diagrams
(JVM memory, GC sweeps, virtual vs. platform threads, stream pipelines),
and a short quiz with instant feedback. Progress is tracked per-topic in
the browser's `localStorage` — nothing is sent anywhere. The Lambda
Expressions section on `java8.html` goes further: its "Try it yourself"
boxes are editable and send your code to [Piston](https://github.com/engineer-man/piston),
a free public code-execution API, so you get a real `javac`/`java`
result — the only feature on the site that needs a network call
beyond loading the page itself.

## Running locally

No build step — just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publishing (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys the site to GitHub Pages
automatically on every push to `main`. One-time setup in the repo:
**Settings → Pages → Source → GitHub Actions**.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) — the short version: one topic
branch per change, PR into `main`, and the Pages deploy happens
automatically once it's merged.
