# CLAUDE.md — Frq Community Project Spec

> This is the ground truth document for the Frq project.
> Read this fully before writing a single line of code.
> Work autonomously, plan first, then build end-to-end.

---

## Who I am

Anonymous founder. Do not ask for my name or identity anywhere in the project.
I will handle account creation myself (Gmail, GitHub). Your job is to build everything else.

---

## What is Frq

**Frq** (pronounced "frequency") is a Gen Z spiritual community — not a religion, not a cult.
Built around kindness, interdependence, and showing up for each other.
No doctrine. No hierarchy. No gatekeeping.
Founded anonymously. The community owns it, not the founder.

Tagline: *"find your frequency"*
Domain target: `frq-community.github.io` (GitHub Pages for now)
Email: `frq.community@gmail.com`

---

## Your mission

Build a complete, deployable, production-ready GitHub Pages website for Frq from scratch.
This includes file structure, landing page, waitlist backend, mobile optimization, SEO, and GitHub Actions deployment pipeline.

Do not ask me questions mid-build unless something is genuinely blocked.
Make smart decisions autonomously. Document every decision in comments.

---

## Existing files (attached)

- `index.html` — the landing page, already designed. Enhance, do not redesign.
- `README.md` — the community manifesto. This goes in the repo root as-is.

---

## Full project structure to build

```
frq-community/
├── index.html              # landing page (enhance existing)
├── README.md               # community manifesto (use existing)
├── CLAUDE.md               # this file
├── 404.html                # custom 404 page, on-brand
├── circle.html             # /circle — what the weekly circle is, how to join one
├── manifesto.html          # /manifesto — full Frq philosophy, long form
├── assets/
│   ├── css/
│   │   └── shared.css      # shared styles across all pages
│   ├── js/
│   │   └── main.js         # shared JS (modal, scroll reveal, analytics)
│   └── og-image.png        # open graph image (generate a simple SVG-based one)
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions — auto deploy to gh-pages on push to main
└── _config.yml             # GitHub Pages config
```

---

## Design system (do not deviate)

```css
--bg: #0a0a09;
--surface: #111110;
--border: rgba(255,255,255,0.08);
--text: #e8e4dc;
--muted: #6b6860;
--accent: #c8f060;
--serif: 'Instrument Serif', serif;       /* Google Fonts */
--mono: 'DM Mono', monospace;             /* Google Fonts */
```

**Rules:**
- Dark background always. No light mode.
- Accent color `#c8f060` (yellow-green) for highlights, CTAs, labels only — not overused.
- `Instrument Serif` for headings and pull quotes.
- `DM Mono` for body, labels, nav, buttons.
- No gradients. No drop shadows. No glow effects.
- Noise texture overlay on every page (already in index.html — replicate).
- 0.5px–1px borders only, using `rgba(255,255,255,0.08)`.
- Scroll-reveal animations on all sections (IntersectionObserver — already in index.html).
- Brutally minimal. Editorial. Like a zine or record label site.

---

## Pages to build

### index.html (enhance existing)
- Keep all existing sections
- Add a working waitlist form (Formspree — see backend section)
- Replace the `comingSoon()` toast with real form submission
- Ensure full mobile responsiveness (test at 375px)
- Add structured data (JSON-LD) for SEO
- Add canonical URL meta tag

### circle.html
Content to include:
- What is the weekly circle?
- How it works (8–12 people, one question, one hour, no hierarchy)
- How to request joining a circle or starting one
- A simple signup form (name/handle + email + timezone)
- Same nav and footer as index.html

### manifesto.html
Content to include:
- Full cosmology section ("The honest story")
- The seven principles (expanded — one paragraph each)
- The anti-cult clause
- The vision
- Closing line: "We're not trying to save the world. We're trying to be decent to each other consistently — which, honestly, might be the same thing."
- Long-form editorial layout, serif-heavy, generous line-height
- No forms on this page — reading only

### 404.html
- On-brand, minimal
- Headline: "wrong frequency."
- Subtext: "this page doesn't exist. but you do."
- Link back to home
- Same nav/footer

---

## Waitlist backend (Formspree)

Use **Formspree** (free tier, no backend needed, works with GitHub Pages).

1. The form action should be: `https://formspree.io/f/REPLACE_WITH_FORM_ID`
2. Add a comment in the HTML: `<!-- TODO: replace REPLACE_WITH_FORM_ID with actual Formspree form ID after founder creates account at formspree.io using frq.community@gmail.com -->`
3. Fields to capture:
   - `email` (required)
   - `handle` (their chosen community name, required)
   - `timezone` (select dropdown, for circle matching)
   - `_replyto` (hidden, same as email)
   - `_subject` (hidden value: "New Frq member request")
4. On success: show a thank-you message inline, do not redirect
5. On error: show a friendly error message

---

## GitHub Actions deployment

Create `.github/workflows/deploy.yml` that:
- Triggers on push to `main`
- Uses `actions/checkout@v3`
- Deploys to `gh-pages` branch using `peaceiris/actions-gh-pages@v3`
- No build step needed (pure HTML/CSS/JS — just copy files)
- Exclude `CLAUDE.md` and `.github/` from the deployed output

```yaml
# deploy.yml structure hint
name: Deploy Frq to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
          exclude_assets: 'CLAUDE.md,.github'
```

---

## SEO requirements

Every page needs:
```html
<meta name="description" content="...">
<meta property="og:title" content="Frq">
<meta property="og:description" content="...">
<meta property="og:type" content="website">
<meta property="og:url" content="https://frq-community.github.io">
<meta property="og:image" content="https://frq-community.github.io/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://frq-community.github.io/[page]">
```

JSON-LD structured data on index.html:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Frq",
  "description": "A Gen Z spiritual community built on kindness, not religion.",
  "url": "https://frq-community.github.io"
}
```

---

## Navigation (shared across all pages)

```
frq          [why]  [principles]  [circle]  [manifesto]  [join →]
```

- `frq` logo links to `index.html`
- `[join →]` opens the waitlist modal
- Active page highlighted with accent color
- Mobile: hamburger menu, full-screen overlay

---

## Footer (shared across all pages)

```
frq                    founded anonymously · v0.1 · community-owned
```

- No social links yet
- No personal info
- Link to `manifesto.html` and `circle.html`

---

## Tone and copy rules

- Write like a real person, not a brand.
- No corporate language. No "we're passionate about".
- Gen Z voice: direct, honest, a little dry.
- Short sentences. Real talk.
- Never preachy. Never performative.
- If writing new copy, match the voice in README.md exactly.

---

## What the founder will do manually after you're done

1. Create `frq.community@gmail.com`
2. Create GitHub account with that email
3. Create repo `frq-community`, push all files
4. Enable GitHub Pages (Settings → Pages → main branch)
5. Create Formspree account, get form ID, replace `REPLACE_WITH_FORM_ID`
6. Done — site is live

---

## Definition of done

- [ ] All pages build without errors
- [ ] index.html passes mobile check at 375px
- [ ] Waitlist form submits (with placeholder Formspree ID + clear TODO comment)
- [ ] GitHub Actions deploy.yml is valid YAML
- [ ] All pages share consistent nav, footer, fonts, colors
- [ ] README.md is untouched (manifesto content)
- [ ] No console errors on any page
- [ ] All internal links work
- [ ] 404.html is linked in `_config.yml`

---

## Final instruction

Plan the build order first (output a quick checklist).
Then build each file completely before moving to the next.
Do not stop to ask questions.
When done, output a summary of every file created and any TODOs the founder needs to complete manually.

*Frq — find your frequency.*
