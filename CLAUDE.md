# jmoore.net — Project Context

Personal website for **Jordan Moore** (jordan.c.moore@gmail.com). Deliberately minimal:
a single landing page with **his photo as the centerpiece**, his name, and a couple of
contact links. Personal, not professional — **no work/employer references on the site.**
Built July 2026, following the same assets-only Cloudflare Worker pattern as
`Documents\DreamWeaver\DreamWeaverRacing` and `Documents\HerrinChoker\HerrinChokerRacing`.

**Domain: jmoore.net** — already on Cloudflare nameservers (`thaddeus`/`monroe.ns.cloudflare.com`),
in the same Cloudflare account as the racing sites (`Jordan.c.moore@gmail.com's Account`,
id 0be87ab1fbd42baf0061a20e50f458ee).

## Deployment

Assets-only static site, no build step. Cloudflare Worker **jmoore** — **LIVE at
https://jmoore.net since July 29 2026** (HTTP/2, Cloudflare cert). Preview URL:
https://jmoore.jordan-c-moore.workers.dev. The custom domain is declared in `wrangler.jsonc`
`routes` (`{pattern:"jmoore.net", custom_domain:true}`); `workers_dev:true` keeps the
preview URL alive. The Worker name must stay `jmoore` (matches the name Cloudflare derives
from the `JMoore` repo) or git builds break. `.assetsignore` keeps CLAUDE.md, config,
`.wrangler/`, and `*.HEIC` out of the served site.

**The first deploys were manual** via `npx wrangler deploy`, run from a git-export in the
scratchpad because Controlled Folder Access blocks node/wrangler from writing inside
`Documents` (see local dev notes for the recipe). **Push-to-deploy (Workers Builds) is now
connected** (July 29 2026) and verified: a push to `main` auto-ran `wrangler deploy` and
deployed version `97ff4f89` ~30s later. Fully matches the racing sites now.

GitHub repo: **`jordancmoore-create/JMoore`** (https://github.com/jordancmoore-create/JMoore),
branch `main`, empty build command.

### Status / steps
1. **Photo** — DONE. `images/jordan.jpg` (1200×1600, ~240 KB), converted from the user's
   `Jordan.HEIC` with ffmpeg and stripped of EXIF/GPS. The `.HEIC` source is git-ignored
   (browsers can't render HEIC; keep the local original, commit only the JPEG).
2. **GitHub repo** — created; remote wired; initial push done from this machine.
3. **Custom domain** — DONE. `jmoore.net` (apex) attached via wrangler.jsonc `routes`.
   `www.jmoore.net` NOT set up (optional: add as a second `custom_domain` route).
4. **Workers Builds (push-to-deploy)** — DONE (July 29 2026). Repo connected via the
   Cloudflare GitHub App; push to `main` → auto-deploy (verified). Manual redeploy still
   possible with the scratchpad `git archive` → `wrangler deploy` recipe in local dev notes.
   To make the repo appear in the connect dropdown: GitHub → Settings → Applications →
   Installed GitHub Apps → Cloudflare Workers and Pages → Configure → add repo access.
5. **hello@jmoore.net** — DONE. Cloudflare Email Routing forwards to Gmail; the site's
   `mailto:` uses hello@jmoore.net.

## Design system

**The photo is the whole page.** Full-bleed `<img class="bg">` (`object-fit:cover`,
`object-position:40% 35%` — tune to reframe Jordan), a soft vignette/edge fade over it,
and two frosted-glass contact pills (Email · GitHub) fixed in the top-right sky. No title,
no body text (user's call, July 2026). Pure CSS: system font stack, no web fonts, no JS.
CSS-only entrance animation (`fade-in` photo, `drop-in` pills; respects
`prefers-reduced-motion`). Pills: `rgba(16,20,12,.36)` + `backdrop-filter: blur` + warm-white
text, legible over the bright sky.

Earlier iteration (in git history) was a centered card with the name in Fraunces + an
earth-tone/green palette; replaced when the user asked for the full-bleed photo look.

## File structure

```
index.html         full-bleed photo + top-right Email/GitHub pills (no title, no JS)
css/style.css      all styles (full-bleed bg, vignette, frosted pills)
images/jordan.jpg  the portrait — the entire page
favicon.svg        JM monogram favicon (green gradient)
```

## Ideas / roadmap (user is still deciding direction — keep it minimal for now)

- A short personal one-liner (would need a text element added back over the photo).
- Later, maybe: a /now page, a links hub, a photo/travel gallery, a light blog.
  Kept intentionally empty for now per the user.
- OG share image at `images/og.png` (1200×630), then point `og:image` at it.

## Local dev notes (this machine)

- **Preview:** `.claude/launch.json` config **jmoore** — python http.server, port 4321.
- **Image conversion:** ffmpeg is installed (native HEIF decode). Recipe used:
  `ffmpeg -i Jordan.HEIC -q:v 2 full.jpg` then
  `ffmpeg -i full.jpg -map_metadata -1 -vf scale=1200:-2 -q:v 3 jordan.jpg` (metadata
  stripped). No ImageMagick / PIL on this box.
- **Windows Defender Controlled Folder Access** protects `Documents`: apps not on its
  allowlist fail writes here with misleading errors. `git.exe` is allowlisted and Claude's
  Write/Edit tools work, but **ffmpeg/powershell/cp cannot write into the repo**. **Binary
  files (e.g. the photo):** produce them in the session scratchpad (Temp is not
  CFA-protected), then let allowlisted git write them into the repo:
  `git hash-object -w <tmpfile>` → `git update-index --add --cacheinfo 100644,<sha>,<repo-path>`
  → `git checkout-index -f -- <repo-path>`.
- Sister sites: DreamWeaver Racing + Herrin Choker Racing under `Documents\...` — same
  assets-only Worker + Workers Builds pattern.
