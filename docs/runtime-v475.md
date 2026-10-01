# V475 — navigation and runtime performance

## Problems addressed
- Missing local data URLs used `/public/`, although Vite publishes that folder at the application base. Screens now load bundled official data first and refresh remotely without blocking interaction.
- The shared logo registry and the official logo API called each other indefinitely for unknown historical teams. Removed the circular fallback; an unknown logo returns an empty result safely.
- Lower panels force-rendered after every mutation, including their own updates. Signatures now prevent continuous redraws and include the official data timestamp.
- Scorer categories handled both pointer-up and click and scheduled repeated forced renders. A single click activates the category; player rows open the existing profile.
- Corrected single-element selectors used as arrays in recruitment, registration approval, team pickers, weather and notification preferences.
- Removed calls to the deleted legacy TV renderer and reconnected the existing Where to Watch view with an idempotent mount.
- Guarded tactics initialization and asynchronous screen rendering after route changes; repaired History image fallbacks and asset paths.
- Navigation delegation supports buttons appended after initial rendering and preserves query parameters.
- Three.js loads only when shop rendering needs it. Initial minified JS dropped from 2,448.94 kB to about 1,766 kB; CSS and layout remain unchanged.

## Verification
- `node --test tests/*.test.mjs`: 8 passing checks, including unknown historical logos and official-data normalization. Replaced the outdated assumption that Primera has no scorers with an explicit empty-data fixture.
- Production build completed.
- Chromium mobile viewport (412 × 915): 72 routes checked without uncaught JavaScript errors; 32 interaction checks passed across scorer categories, player profiles, History tabs/categories, Competition tabs, TV dates, lower rankings and the registration team picker.
- History tab click checks took approximately 70–760 ms in the local test environment. These are local interaction measurements, not mobile network load guarantees.
- Lower rankings remained unchanged while idle, confirming the redraw loop stopped.

Run the interaction suite after building:

```sh
npm run build
# Requires an installed Playwright browser.
node tests/browser-runtime.mjs
```

The suite also supports `PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE_PATH` for an existing browser installation. Camera OCR, external social sharing and streaming providers require separate device/service verification; they were not exercised by these local browser checks.

## Integration with V474
Preserved the later single player ranking, cached category body updates and the V474 statistics table controls. Integrated runtime fixes on top of main at `30c849e`.
