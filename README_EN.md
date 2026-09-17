<p align="center">
  <img src="readme-header.svg" alt="CaseyCZ iOS Hub" width="100%" />
</p>

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/CZ-%C4%8Ce%C5%A1tina-172033?style=for-the-badge&labelColor=111827" alt="Czech" /></a>
  <img src="https://img.shields.io/badge/EN-English-38BDF8?style=for-the-badge&labelColor=0284C7" alt="English" />
</p>

<p align="center">
  A catalog for <strong>AltStore / SideStore sources, Source Builder and practical iOS tools</strong>.
</p>

<p align="center">
  <a href="https://caseycz.github.io/iOS-Hub/"><img src="https://img.shields.io/badge/Website-Open-38BDF8?style=for-the-badge&labelColor=0284C7&logo=googlechrome&logoColor=white" alt="Open CaseyCZ iOS Hub" /></a>
</p>

## About

**CaseyCZ iOS Hub** is a live catalog of public iOS source repositories. Sources are checked regularly, and unavailable sources are temporarily hidden from the website.

## Main features

- AltStore Classic, AltStore PAL and SideStore sources
- filters by source type, genre, platform and Mix compatibility
- search by source or app name
- one Source Builder for all online sources
- automated `PASS / TRY` status
- ready-to-add **CaseyCZ AltStore Source** and **CaseyCZ SideStore Source**
- app deduplication by `bundleIdentifier`
- source checks every 6 hours
- EN / CZ / DE / ES / FR interface with English as the default
- saved language, appearance, filters and Builder selection
- **DEB → IPA Converter (Beta)** for iPhone, iPad, Mac and PC

## AltStore and SideStore

The ready-to-add CaseyCZ sources are generated automatically from currently available compatible sources. Stable builds are preferred in the default packages; Nightly feeds remain available for manual selection in the Builder.

CaseyCZ iOS Hub does not rehost third-party IPA files. Generated source JSON files preserve the original public download URLs from each project.

## DEB → IPA Beta

Conversion runs locally in the browser without uploading the `.deb` file to a server. It is intended for compatible packages containing a real `.app` application.

Not every Debian package can be safely converted by repackaging alone. Jailbreak tweaks, libraries, system packages and apps that rely on special filesystem metadata or symlinks may require a desktop conversion tool. The resulting IPA is not automatically signed.

## Support

<p align="center">
  <a href="https://www.buymeacoffee.com/caseycz"><img src="https://img.shields.io/badge/Support%20CaseyCZ-Buy%20Me%20a%20Coffee-38BDF8?style=for-the-badge&labelColor=0284C7&logo=buymeacoffee&logoColor=white" alt="Support CaseyCZ" /></a>
</p>

<p align="center">
  <a href="https://www.buymeacoffee.com/caseycz"><img src="https://caseycz.github.io/support-qr.svg" width="150" alt="Buy Me a Coffee CaseyCZ QR code" /></a><br>
  <sub>Scan the QR code or click the button.</sub>
</p>
