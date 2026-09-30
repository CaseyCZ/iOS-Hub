<p align="center">
  <img src="readme-header.svg" alt="CaseyCZ iOS Hub" width="100%" />
</p>

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/CZ-%C4%8Ce%C5%A1tina-172033?style=for-the-badge&labelColor=111827" alt="Czech" /></a>
  <img src="https://img.shields.io/badge/EN-English-38BDF8?style=for-the-badge&labelColor=0284C7" alt="English" />
</p>

<p align="center">
  A catalog for <strong>compatible iOS sources, Source Builder and practical iOS tools</strong>.
</p>

<p align="center">
  <a href="https://caseycz.github.io/iOS-Hub/"><img src="https://img.shields.io/badge/Website-Open-38BDF8?style=for-the-badge&labelColor=0284C7&logo=googlechrome&logoColor=white" alt="Open CaseyCZ iOS Hub" /></a>
</p>

## About

**CaseyCZ iOS Hub** is a live catalog of public iOS source repositories. Sources are checked regularly; if one stops responding, its card remains visible as Offline and its install buttons are temporarily disabled.

## Main features

- compatible Classic/PAL iOS sources with installer support driven by one central registry
- filters by source type, genre and installer compatibility
- search by Source name and Source metadata
- a dedicated **Custom Source Builder** page for all online sources
- an interactive **Help Center** with method selection, error diagnosis, setup wizard and links to official documentation
- source checks every 6 hours
- EN / CZ / DE / ES / FR interface with English as the default
- saved language, appearance, filters and Builder selection
- **DEB → IPA Converter (Beta)** for iPhone, iPad, Mac and PC

## Compatible source installers

The Source Builder does not create a combined feed or Mix JSON. Users choose an installer and original Sources, and iOS Hub opens each original Source URL directly in the selected app. Normal updates therefore continue from the original Source.

Installer support, ordering and deep-links are defined centrally in `src/js/installers.js`, so adding another installer does not require editing every source card by hand.

CaseyCZ iOS Hub does not rehost third-party IPA files or third-party Source JSON files. The Builder only passes original public Source URLs to supported installers.

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


## Privacy and third-party content

Every current Source is classified in [COMPLIANCE.md](COMPLIANCE.md). Builder Sources are used as link-only endpoints: iOS Hub may check availability and format, but it does not copy, merge or rehost their full feeds or app metadata for the Builder.
