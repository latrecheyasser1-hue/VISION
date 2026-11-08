# VISION public website

Arabic/French public website with a light pastel design and mobile-first layout. Run `npm run dev` and open http://127.0.0.1:4190/. Run `npm run check` for JavaScript syntax verification. Static hosting root: `public/`.

## Current media
All three approved V3 films appear directly in the page: brand introduction, ecommerce, and custom systems. They load as they enter view, autoplay muted, pause offscreen or when the document is hidden, and provide native controls plus a narration-from-start button. Reduced-motion preference disables automatic playback.

The portfolio uses real public homepage screenshots for Pyjama DZ, ClinicFlow DZ, Asel Butik and HK STORE, explicitly requested by the owner. Al Aqsa is an offline desktop application with an explanatory card. La City is excluded entirely at the owner's latest request. No private client screens or records are shown.

## Contact and scope
WhatsApp +213771335039 is the primary contact. The form prepares a message which visitors review and send themselves. No email, database, authentication or private client portal is included in this public phase.

The buildless GitHub upload export is in `repository/`. GitHub upload and public hosting remain pending. See `QA.md` for verification and limitations; `DESIGN-REVISION.md` records the design decisions.

## Scroll story
Three scroll-controlled chapters replace the former step buttons: activity questions, planning decisions and an assembled custom workspace. Scroll backward to reverse the sequence. Phone and desktop use native sticky positioning; reduced-motion or short landscape windows show the three compositions as a static reading sequence.

The latest hero replaces the rejected stickers with construction guides, a solid/outline VISION wordmark and an idea-to-solution path through the brand eye. Decorative starbursts are removed throughout the active page. The light blue ribbon remains. This latest iteration passed source checks; visual browser QA is temporarily blocked by the automatic review usage limit.

## Discovery and local demonstration
`explore.js` and `explore.css` add four problem scenarios, contextual WhatsApp drafts, a fictional order/stock demonstration, project stories, handover details and a founder introduction. Demo state stays in memory and resets on reload; no real orders or client data.
