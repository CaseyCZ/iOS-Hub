<p align="center">
  <img src="readme-header.svg" alt="CaseyCZ iOS Hub" width="100%" />
</p>

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/CZ-%C4%8Ce%C5%A1tina-172033?style=for-the-badge&labelColor=111827" alt="Czech" /></a>
  <img src="https://img.shields.io/badge/EN-English-38BDF8?style=for-the-badge&labelColor=0284C7" alt="English" />
</p>

<p align="center">
  A modern hub for <strong>iOS apps, IPA files, AltStore / SideStore sources and a custom Source Builder</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/VERSION-v1.0.1-38BDF8?style=for-the-badge&labelColor=0284C7" alt="CaseyCZ iOS Hub v1.0.1" />
</p>

<p align="center">
  <a href="https://caseycz.github.io/iOS-Hub/"><img src="https://img.shields.io/badge/Website-Open-38BDF8?style=for-the-badge&labelColor=0284C7&logo=googlechrome&logoColor=white" alt="Open CaseyCZ iOS Hub" /></a>
</p>

## About

**CaseyCZ iOS Hub** is a modern catalog for iOS sideloading, public AltStore / SideStore sources and custom combined source JSON files.

The website provides a curated list of public sources, availability checks and a **Source Builder** that can combine compatible AltStore Classic catalogs into one custom CaseyCZ Mix.

## Main features

- 📱 ready for future CaseyCZ IPA releases
- 🔗 AltStore Classic, AltStore PAL and SideStore source catalog
- 🟢 automated source availability and JSON validation
- 🧩 Source Builder for compatible Classic sources
- 🧹 app deduplication by `bundleIdentifier`
- ➕ one-tap opening through the AltStore URL scheme
- 📋 copy original or merged source URLs
- 🇨🇿 / 🇬🇧 Czech and English UI
- 🌙 CaseyCZ dark / light visual style

## Source Builder

The Builder combines smaller public Classic sources that can reasonably be merged into one JSON file. Large community catalogs and PAL sources are added directly instead of being merged.

GitHub Actions automation regularly:

- downloads allowed sources,
- validates JSON and the `apps` array,
- counts available apps,
- generates combination files in `mix/`,
- refreshes website status data.

## Sources

The catalog uses its own whitelist in `sources/registry.json`. [awesome-altstore](https://github.com/victordedomenico/awesome-altstore) is used only as one discovery reference; each source URL is checked independently before being added.

CaseyCZ iOS Hub does not rehost third-party IPA files. Merged sources preserve the original download URLs from each project.

## Support

<p align="center">
  <a href="https://www.buymeacoffee.com/caseycz"><img src="https://img.shields.io/badge/Support%20CaseyCZ-Buy%20Me%20a%20Coffee-38BDF8?style=for-the-badge&labelColor=0284C7&logo=buymeacoffee&logoColor=white" alt="Support CaseyCZ" /></a>
</p>

<p align="center">
  <a href="https://www.buymeacoffee.com/caseycz"><img src="https://caseycz.github.io/support-qr.svg" width="150" alt="Buy Me a Coffee CaseyCZ QR code" /></a><br>
  <sub>Scan the QR code or click the button.</sub>
</p>
