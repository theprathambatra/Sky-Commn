# Sky Communications — Editorial PR Website Concept

A multi-page, deploy-ready static website prototype for Sky Communications.

## Pages
- `index.html` — cinematic homepage
- `work.html` — filterable project archive
- `services.html` — full capability system
- `studio.html` — founder, philosophy, locations
- `journal.html` — editorial / SEO content layer
- `contact.html` — enquiry flow
- `case-lacoste.html`
- `case-dream-beauty.html`
- `case-khurana.html`
- `case-avon.html`

## Design system
- Editorial fashion / newsroom language instead of a conventional agency template
- Black, paper, and Sky turquoise palette
- Oversized typography, hard rules, press-card collage, editorial grids
- Custom cursor, intro loader, page wipes, parallax collage, scroll reveals, draggable archive rail, filterable work and interactive service rows
- Purpose-built mobile layout: no horizontal navigation dependency and no hover-only content

## Run locally
Open `index.html` directly, or run any simple static server in this folder.

Example:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy
This is intentionally build-step-free. Upload the entire folder to GitHub Pages, Netlify, Vercel static hosting, Cloudflare Pages, or the existing hosting account.

## Production notes
1. The enquiry form currently hands off to `mailto:` so the prototype works without a backend. Replace it with Formspree, Resend, HubSpot, a serverless function, or the client's CRM.
2. Google Fonts are loaded from the web; self-host fonts if desired for tighter performance/privacy control.
3. Social-feed imagery in `assets/images` is cropped from the reference screenshots supplied for this concept. Replace with original high-resolution campaign assets before final launch.
4. Four case studies are fully routed. Remaining work cards are presentation examples until more campaign copy/assets are provided.
5. Current office/contact details were carried over from the existing Sky Communications site; confirm them with the client before launch.
