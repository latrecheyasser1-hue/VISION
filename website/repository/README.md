# VISION

Bright, mobile-first Arabic/French public website. This repository is a buildless static root: `index.html`, `style-v2.css`, `app.js`, and self-hosted assets live together. No dependency installation or database is required.

## Preview
Run `npm run dev`, then open http://127.0.0.1:4190. Run `npm run check` for JavaScript syntax verification. `server.mjs` is a local preview server, not a production backend.

## Scope
Public services, portfolio, project stories, problem discovery, a local fictional order/stock demo, handover details, founder introduction, process, FAQ, approved motion films and WhatsApp contact. The contact form prepares a message for +213771335039; visitors explicitly send it in WhatsApp. No data is stored and no email is shown.

Administration, authentication and private client project tracking are reserved for phase two and are not implemented.

## Design and assets
The owner supplied the Slush reference and requested light pastel colors, no dark/navy surfaces, sculptural typography and strong scroll motion. The latest direction removes all decorative starbursts and hero stickers, replacing them with construction guides, a solid/outline wordmark and a brand-eye connection path. See DESIGN-REVISION.md. Anton and Changa are distributed with their OFL licenses. Ribbon artwork was generated for VISION; the final approved V3 films are preserved. On 2026-10-24 the owner explicitly requested real public homepage screenshots for the portfolio. Pyjama DZ, ClinicFlow DZ, Asel Butik and HK STORE are captured from their public homepages. La City was excluded at the owner’s explicit request. Al Aqsa is an offline desktop application and retains an explanatory card. No private client records or authenticated screens are included.

## Performance
The 3D ribbon is a transparent 117KB WebP rather than a live 3D renderer. Fonts and GSAP are self-hosted. All three films are inline: sources load on entering the viewport, playback starts muted and pauses offscreen or when the page is hidden. Visitors can pause or enable narration from the beginning. Reduced-motion mode disables autoplay and animated choreography. The scroll story changes four cards through activity questions, planning decisions and assembled modules; scrolling backward reverses it. Homepage screenshots use native lazy loading. Scroll timelines update via one scheduled animation frame per scroll batch; the three-chapter story uses native sticky positioning on desktop and phone, with a static reading sequence for reduced motion and short landscape windows.

This is the current design preview. Hosting and a production domain have not been configured.
