# VISION light redesign — browser QA

Date: 2026-10-24

## Observed results
- Arabic RTL and French LTR rendered at phone widths 320 and 430, and desktop width 1440. No document-level horizontal overflow remained after the overflow clipping fix.
- Mobile navigation opens, updates aria-expanded, and closes when following a section link.
- Portfolio filters select the expected projects; project details remain readable at 320px.
- The brand film plays with its Arabic caption track; media sources are absent before playback is requested and cleared on close.
- The contact form opens a prepared WhatsApp message addressed to +213771335039 with correctly encoded fictional test inputs. No message was sent.
- Scroll advances the three-stage story on phone and desktop. Desktop reached the final stage through actual page scrolling.
- Browser console returned no warnings or errors in the desktop check.
- JavaScript syntax verification passes for the app and local preview server.

## Limits
Checks used browser viewport emulation, not physical phones. No measured Core Web Vitals or Lighthouse score is claimed. Reduced-motion behavior is implemented but was not verified through an emulated preference in this session.

## Delivery
Local preview: http://127.0.0.1:4190/
Screenshots: qa/mobile-430.png and qa/desktop-1440.png.
The allowlisted static repository export is in repository/. GitHub upload remains pending: the Chrome extension needs file URL access, and browser security blocks the agent from opening Chrome's internal settings. User must enable this setting manually. No commit or public hosting deployment is claimed.
## Media revision verification — 2026-10-25
This supersedes the old modal-video behavior described above.
- All three films were observed playing inline (readyState 4, advancing time) without opening a dialog.
- The narration button restarted the brand video near time zero with muted=false. Manual pause worked.
- Scrolling to the next film paused the previous film. Sources for unseen films were initially absent.
- Arabic phone width 390 and French width 320 had no document-level horizontal overflow; desktop width 1440 also passed.
- All homepage images loaded; ecommerce filtering rendered the matching thumbnails.
- The media preview console had no warnings/errors.
- La City was subsequently removed at the owner's request. Static verification confirms five remaining projects, four real homepage screenshots, three inline films, valid local references, and a 28-file upload export excluding city.jpg.
- Final browser recheck after removal was not completed: automatic browser approval review reached its usage limit. This was a review-availability failure, not a safety rejection. No workaround was attempted.
- Screenshots inline-films-desktop.jpg and inline-films-mobile.jpg document the media layout before the portfolio-only removal.

## Scroll narrative verification — 2026-10-25
- Desktop actual PageDown scrolling advanced chapter 0 → 1 → 2 and changed visible cards from questions to planning to workspace modules. PageUp restored chapter 1.
- All three stages inspected at 390×844; final workspace fits the viewport, with no document horizontal overflow (client/scroll width 375).
- French LTR inspected at 320×800; client/scroll width 305. Step-button count is zero.
- 844×390 landscape correctly activates story-flat; all three panels are visible and positioned relatively for normal scrolling.
- Console reported no errors or warnings. JavaScript syntax check passed.
- Static checks confirm three chapters with four cards each, three inline films and five portfolio projects; La City stays excluded.
- Reduced-motion shares the static fallback but preference emulation itself was not performed.
Screenshots: story-01-desktop.jpg, story-02-desktop.jpg, story-03-desktop.jpg, story-02-mobile.jpg, story-03-mobile.jpg.


## Construction hero / removal of decorative stars — 2026-10-25
- Removed all active starburst glyphs and retired sticker/star animation selectors from HTML, CSS and JS. Existing four homepage screenshots, five portfolio entries, three inline films and WhatsApp contact retained.
- Source validation: 32 unique IDs, no broken local fragment targets, 17 local asset references present, 3 inline video elements, CSS braces balanced. JavaScript syntax checked for source and export; local server syntax checked.
- Entry reveal and scroll clipping use separate elements. No new libraries, fonts, images or continuous animation loops. Existing mobile and reduced-motion breakpoints extended for the new composition.
- NOT visually verified: the browser documentation/initialization call was rejected because automatic approval review hit its usage limit. No browser action ran, and no bypass was attempted. New desktop/mobile screenshots, visual overflow and console checks remain pending. Earlier screenshots describe the prior revision only.
- No Git repository metadata is present locally; GitHub upload/deployment is not claimed.

## Additions and brand kit — 2026-10-25
Browser access restored. Verified desktop 1440px, Arabic phone 390px and French 320px: no horizontal overflow in narrow layout, new touch controls at least 44px. Scenario selection updates text and matching WhatsApp draft. Demo order of 3 deducts stock 8→5; cancellation restores 8; a new order advances through preparation/delivery; reset works. French quantity 2 produces stock 6 and total 5,000 DA. Checked Pyjama and Al Aqsa story dialogs; founder section visually reviewed. Browser error/warning logs empty. No WhatsApp messages sent. Logo PNGs visually inspected; SVGs XML-validated. All local asset/fragment references valid. Reduced-motion code uses existing preference guard; no separate runtime emulation in this pass.
