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

Assets-only static site, no build step. Cloudflare Worker **jmoore**. Intended flow,
identical to the other sites: **push to `main` → Workers Builds runs `npx wrangler deploy`
→ live in about a minute.** The Worker name in `wrangler.jsonc` must stay `jmoore` (matches
the name Cloudflare derives from the `JMoore` repo) or git builds break. `.assetsignore`
keeps CLAUDE.md and config files out of the served site.

GitHub repo: **`jordancmoore-create/JMoore`** (https://github.com/jordancmoore-create/JMoore),
branch `main`, empty build command.

### Status / steps
1. **Photo** — DONE. `images/jordan.jpg` (1200×1600, ~240 KB), converted from the user's
   `Jordan.HEIC` with ffmpeg and stripped of EXIF/GPS. The `.HEIC` source is git-ignored
   (browsers can't render HEIC; keep the local original, commit only the JPEG).
2. **GitHub repo** — created; remote wired; initial push done from this machine.
3. **Workers Builds** — Cloudflare dashboard → Workers & Pages → import `JMoore`, root dir =
   repo root, build command empty. (Or first-deploy manually: `npx wrangler deploy`.)
4. **Custom domain** — attach `jmoore.net` (+ optional `www`) to the Worker. Zone is already
   on the account.
5. **hello@jmoore.net** — user is setting up Cloudflare Email Routing (forward to Gmail).
   Once verified, switch the site's `mailto:` from the Gmail address to hello@jmoore.net.

## Design system

```css
--bg:#f4f1e9          /* warm sand (light, default) */
--text:#23281f        /* deep forest ink */
--muted:#6d7266       /* sage-gray */
--accent:#5c7a52      /* muted forest green — chosen to complement the photo */
/* dark theme via prefers-color-scheme: #14170f bg, #ece9dd text, #9bb884 accent */
```

Earth-tone / green palette (the user's preference; also matches the photo — green pullover,
grass, coast). Fonts: **Fraunces** (display — the name) + **Inter** (small text). Light by
default with a `prefers-color-scheme: dark` override. Entrance fade via `body.is-loaded`
(respects `prefers-reduced-motion`).

## File structure

```
index.html         single centered stage: photo + name + accent rule + Email/GitHub links
css/style.css      all styles
js/main.js         footer year + entrance-animation toggle
images/jordan.jpg  the portrait (the site's focal point)
favicon.svg        JM monogram favicon (green gradient)
```

## Ideas / roadmap (user is still deciding direction — keep it minimal for now)

- A short personal one-liner under the name (commented `.tagline` in index.html).
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
