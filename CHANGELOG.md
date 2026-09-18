# Changelog

## 1.1.4 — 2026-09-18

- Moved the full Custom Source Builder from the homepage to a dedicated `builder.html` page, matching the separate-tool approach used by the DEB → IPA converter.
- Kept the three ready CaseyCZ source cards on the homepage and replaced the embedded Custom Mix controls with a compact card linking to the standalone Builder.
- Preserved Builder filters, saved selection, Mix generation, AltStore/SideStore/LiveContainer install actions, languages, theme and collapsible source/result lists on the new page.
- Extended repository audit checks to the new Builder page and runtime controller.

## 1.1.3 — 2026-09-18

- Made each source card’s app count clickable; it now expands an inline list of apps contained in that source.
- App rows show available name, developer, version and bundle identifier metadata.
- Center-aligned cards, headings, descriptions, badges, buttons, filter controls, Builder content, notices and footer for a more consistent visual layout.

## 1.1.2 — 2026-09-18

- Added LiveContainer consistently to source descriptions, catalog headings and installation guidance across the website and READMEs.
- Reworked package disclosure labels to a compact icon-based content label for sources + apps.
- Added consistent icons to Builder and catalog filters: source type, genre, platform, Mix status, search and selection.
- Added a real LiveContainer compatibility option to the Builder platform filter.
- Changed visible search wording to source-focused text because apps are not shown as a standalone catalog.

## 1.1.1 — 2026-09-18

- Moved Custom Mix below the three ready-source cards and made it span the full Builder width on desktop.
- Added compact official app icons to AltStore, SideStore and LiveContainer installer links.
- Kept Custom Mix controls in a single vertical flow without splitting the card into left/right columns.

## v1.1.0 — 2026-09-17

- Reordered the homepage to Tools → Source Builder → Sources.
- Added LiveContainer to the main iOS Hub identity.
- Reworked Source Builder into four cards: AltStore, SideStore, LiveContainer and Custom Mix.
- Moved Builder filters, search and selection controls into the Custom Mix card.
- Changed “Select compatible” and “Select all shown” to replace the current selection immediately, so clearing first is no longer required.
- Added LiveContainer installation for hosted Mix results.
- Kept source catalog filters/search collapsible to reduce page height on iPhone.

## v1.0.0 — 2026-09-17

- First numbered stable checkpoint of CaseyCZ iOS Hub.
- Checked source catalog, AltStore/SideStore packages, Source Builder, Mix generation and DEB → IPA tool.
- This state is preserved in the `release-v1.0.0` branch.
