# Changelog

## 1.1.5 — 2026-09-18

- Moved the compact Custom Builder card into the Tools grid beside the DEB → IPA Converter on desktop.
- Kept the three prepared AltStore, SideStore and LiveContainer source cards in the Ready sources section.
- Preserved responsive behavior so the two tool cards stack on narrower screens.
- Fixed the homepage Ready sources section so the prepared AltStore, SideStore and LiveContainer cards render again after the Builder was moved to its standalone page.
- Unified the DEB → IPA Converter and Custom Builder cards: matching icon block, background, centered content and bottom-aligned action buttons.
- Added catalog sorting by source name or app count, with both highest-first and lowest-first app-count options.
- Added a translated bug-report icon in the top bar linking directly to a new GitHub issue.
- Added a new Useful Resources page with curated external tools and links.
- Added the Useful Resources page to navigation across the Hub.
- Expanded Useful Resources with verified-free LocalSend, cobalt, changedetection.io self-hosted, AltStore Classic, SideStore, LiveContainer, Sideloadly, atvloadly and TrollStore links; unverified shortened links were removed.
- Expanded Useful Resources with iloader, Tailscale, WizTree, 7-Zip, Rufus, Raspberry Pi Imager, LeoMoon HotKeyz, iTunes, Visual Studio Community, Node.js, OBS Studio, Stremio, Discord and Telegram, with free-use scope noted where licensing is limited.
- Added a standalone Sideloading Guide with free setup paths, a compatibility matrix, Apple account limits, searchable troubleshooting and official reference links.
- Reordered Useful Resources sections alphabetically in Czech, with Free iOS & tvOS sideloading first.
- Added AltStore Classic Remote AltServers to the Sideloading Guide, including no-computer refresh workflow, compatibility details and troubleshooting.
- Reworked the Sideloading Guide for complete beginners with plain-language choices, AltStore PAL vs Classic guidance, SideStore and LiveContainer explanations, and a clear explanation of what a Source is.
- Refined the beginner guide into intent-based choices with multiple valid routes where appropriate: SideStore vs AltStore Remote refresh, Sideloadly vs AltStore Classic for desktop IPA installs, LiveContainer options and Apple TV methods; action links now use visual icons throughout the guide.
- Replaced invented letter/emoji branding in the Guide and Useful Resources with official app/project icons, reusing the same AltStore, SideStore and LiveContainer artwork already used by source installer buttons.
- Audited all public pages for icon consistency: resource CTAs now repeat each project's official icon, GitHub issue and Buy Me a Coffee actions use their official service artwork, and local CSS/JS references are cache-busted so the updated icons appear immediately after deploy.
- Repaired missing resource icons by replacing fragile favicon hotlinks with stable official project/organization artwork for Stremio, Discord, Telegram, Tailscale, LocalSend, Raspberry Pi, Node.js, OBS and iloader, with fallback URLs for the most important brands.
- Replaced two more fragile favicon URLs with stable official assets for changedetection.io and 7-Zip during the icon audit.
- Moved the most important program icons into local official-asset wrappers so they no longer depend on fragile external hotlinks; this fixes 7-Zip, Stremio, Discord and other resource icons and also makes AltStore/SideStore/LiveContainer icons consistent site-wide.

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
