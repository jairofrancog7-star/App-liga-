# Competition refinement — 2026-09-24

## Ownership and audit

- `main.js` retains `#/competition`, primary tabs and application state. Tab clicks update only the content through V40, without replacing the shell or calling the full render/scroll reset.
- V12 previously replaced all siblings after the primary tabs for standings, fixtures and bracket. Those four entry points now yield to the V40 controller. Other V12 screens remain unchanged.
- V40 previously maintained three duplicated standings arrays, a second Veteranos standings snapshot, fabricated recent form, and a rules tab containing another table. V40 now consumes `competition-data.js`, with one category/round/mode/stage state and no team constants.
- V40 CSS previously hid the topbar and primary tabs when the standings-only body class appeared, then restored them through later rules. That section-specific body class and stylesheet overrides have been removed. V69 and V77 retain the existing shared shell; the new V40 content selectors do not match the competing V43/V44/V55/V76 rules.
- V43, V44 and V55 style the retired V12/V40 content selectors; V69 owns shared header geometry; V76/V77 restore and color the old content; V94 re-overrides the date-strip spacing. No additional `!important` layer was added. Their other-page rules remain untouched.
- V103 operates on Home/monthly calendar, not the new Competition content.
- V4 and V105 appended large tool blocks after Competition. They now yield on this route; the contextual dialog provides Competition actions.
- V176 remains the sole table exporter. Its automatic Top 4 qualification labels have been removed. It uses the same normalized rows and logo resolver as the mobile table, and supplies the other publication functions.
- V161 retains the administrator number and existing publications panel. Sharing an asset reuses this module. It never silently sends a message or claims a file is attached by a `wa.me` link.
- Match Center accepts the official category-qualified match ID. Team detail/comparison prefers the explicitly selected category for teams with duplicate names.

## Data integrity

The live repository source is preferred, with a dated local snapshot as offline fallback. The source capture date is shown. Missing scores stay null, including a dash opposite a numeric score. Only complete official results enter goal/outcome statistics; the UI explicitly identifies that subset. Standings points are preserved, including negative values and sanctions. Recent form is shown only when all played matches represented in the official row are available and dated. Unpublished scorers, standings and knockout rounds produce no-data states. No assumed qualifiers, teams or knockout matches are generated.

The inspected live snapshot (2026-09-23) has five categories, no Veteranos 35+ standings/fixtures, no Primera scorers table and no knockout stages. Official tie-break criteria have not been loaded, so the requested explicit no-data message is used.

## Verification

- `node --test tests/competition-data.test.mjs`: five integrity tests.
- DOM integration: category survives section changes; topbar/tab elements retain identity; no-data and rules states work.
- Native Canvas smoke tests: standings (1400 px), results/calendar (1080 px, dynamic height), single result/team (1080 × 1350), category stats and scorers. Logo-failure fallbacks and CSV negative points checked.
- The cloud browser blocks the local test URL. A live browser check is required after deployment; strict screenshot tolerance must not be claimed without a matching viewport overlay.

## Sharing

Generating and sharing are separate gestures so the Android share sheet retains user activation. The prepared `File` is passed to `navigator.canShare` and `navigator.share`. When file sharing is unavailable, the PNG can be downloaded; WhatsApp falls back to the existing administrator panel. Cancelling sharing does not send anything.
