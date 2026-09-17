<p align="center">
  <img src="readme-header.svg" alt="CaseyCZ iOS Hub" width="100%" />
</p>

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/CZ-%C4%8Ce%C5%A1tina-172033?style=for-the-badge&labelColor=111827" alt="Czech" /></a>
  <img src="https://img.shields.io/badge/EN-English-38BDF8?style=for-the-badge&labelColor=0284C7" alt="English" />
</p>

<p align="center">
  A modern catalog for <strong>AltStore / SideStore sources, Source Builder and practical iOS tools</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/VERSION-v1.1.0-38BDF8?style=for-the-badge&labelColor=0284C7" alt="CaseyCZ iOS Hub v1.1.0" />
</p>

<p align="center">
  <a href="https://caseycz.github.io/iOS-Hub/"><img src="https://img.shields.io/badge/Website-Open-38BDF8?style=for-the-badge&labelColor=0284C7&logo=googlechrome&logoColor=white" alt="Open CaseyCZ iOS Hub" /></a>
</p>

## About

**CaseyCZ iOS Hub** is a live catalog of public iOS source repositories with automated availability checks. Broken sources are hidden from the website and can automatically return when they become healthy again.

## Main features

- 🔗 AltStore Classic, AltStore PAL and SideStore source catalog
- 🟢 automated availability and JSON validation
- 🗂️ two independent filters for source type and genre
- 🧩 Source Builder for compatible Classic sources
- 🧹 app deduplication by `bundleIdentifier`
- 🛠️ local browser-based **DEB → IPA** converter for iPhone, iPad, Mac and PC
- 🔒 DEB conversion runs locally without uploading the file
- 🌍 EN / CZ / DE / ES / FR interface with English as the default
- 💾 saved language, theme, filters and Source Builder selection
- 🌙 CaseyCZ dark / light visual style

## Source Builder

The Builder combines smaller public Classic sources that can reasonably be merged into one JSON file. Large community catalogs and PAL sources are added directly.

GitHub Actions automation regularly downloads allowed sources, validates their JSON and availability, counts apps, and refreshes the public catalog and generated Mix JSON files.

## DEB → IPA

The browser converter processes compatible `.deb` packages containing a real iOS `.app`, creates the required `Payload/App.app` structure and packages the result as `.ipa`. The resulting IPA is not automatically signed, and not every Debian package can be converted — jailbreak tweaks, libraries and system packages are not regular apps.

## Sources

The catalog uses its own whitelist in `sources/registry.json`. Public source lists are used only for discovery; individual URLs are checked independently before they are shown.

CaseyCZ iOS Hub does not rehost third-party IPA files. Generated source JSON files preserve the original download URLs from each project.

## Support

<p align="center">
  <a href="https://www.buymeacoffee.com/caseycz"><img src="https://img.shields.io/badge/Support%20CaseyCZ-Buy%20Me%20a%20Coffee-38BDF8?style=for-the-badge&labelColor=0284C7&logo=buymeacoffee&logoColor=white" alt="Support CaseyCZ" /></a>
</p>

<p align="center">
  <a href="https://www.buymeacoffee.com/caseycz"><img src="https://caseycz.github.io/support-qr.svg" width="150" alt="Buy Me a Coffee CaseyCZ QR code" /></a><br>
  <sub>Scan the QR code or click the button.</sub>
</p>
