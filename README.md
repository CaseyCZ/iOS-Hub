<p align="center">
  <img src="readme-header.svg" alt="CaseyCZ iOS Hub" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/CZ-%C4%8Ce%C5%A1tina-38BDF8?style=for-the-badge&labelColor=0284C7" alt="Čeština" />
  <a href="README_EN.md"><img src="https://img.shields.io/badge/EN-English-172033?style=for-the-badge&labelColor=111827" alt="English" /></a>
</p>

<p align="center">
  Moderní rozcestník pro <strong>iOS aplikace, IPA soubory, AltStore / SideStore zdroje a vlastní Source Builder</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/VERZE-v1.0.1-38BDF8?style=for-the-badge&labelColor=0284C7" alt="CaseyCZ iOS Hub v1.0.1" />
</p>

<p align="center">
  <a href="https://caseycz.github.io/iOS-Hub/"><img src="https://img.shields.io/badge/Web-Otev%C5%99%C3%ADt-38BDF8?style=for-the-badge&labelColor=0284C7&logo=googlechrome&logoColor=white" alt="Otevřít CaseyCZ iOS Hub" /></a>
</p>

## O projektu

**CaseyCZ iOS Hub** je moderní katalog pro iOS sideloading, veřejné AltStore / SideStore zdroje a vlastní kombinované source JSONy.

Web nabízí přehled vybraných veřejných zdrojů, kontrolu jejich dostupnosti a **Source Builder**, který umí spojit kompatibilní AltStore Classic katalogy do jednoho vlastního CaseyCZ Mixu.

## Hlavní funkce

- 📱 připravená sekce pro budoucí CaseyCZ IPA releasy
- 🔗 katalog AltStore Classic, AltStore PAL a SideStore zdrojů
- 🟢 automatická kontrola dostupnosti a JSON struktury
- 🧩 Source Builder pro kombinování kompatibilních Classic zdrojů
- 🧹 deduplikace aplikací podle `bundleIdentifier`
- ➕ přímé otevření zdroje přes AltStore URL scheme
- 📋 kopírování původní i sloučené source URL
- 🇨🇿 / 🇬🇧 české a anglické rozhraní
- 🌙 tmavý / světlý vzhled ve stylu CaseyCZ

## Source Builder

Builder kombinuje menší veřejné Classic zdroje, které lze rozumně sloučit do jednoho JSONu. Velké komunitní katalogy a PAL zdroje se přidávají přímo a do Mixu se nezahrnují.

Automatizace v GitHub Actions pravidelně:

- stáhne povolené zdroje,
- ověří JSON a `apps`,
- spočítá dostupné aplikace,
- vytvoří kombinované soubory v `mix/`,
- aktualizuje stav webu.

## Zdroje

Katalog používá vlastní whitelist v `sources/registry.json`. Repo [awesome-altstore](https://github.com/victordedomenico/awesome-altstore) slouží pouze jako jeden z podkladů pro objevování zdrojů; jednotlivé URL jsou před zařazením kontrolované samostatně.

CaseyCZ iOS Hub cizí IPA soubory nerehostuje. Sloučený source zachovává původní download URL jednotlivých projektů.

## Podpora

<p align="center">
  <a href="https://www.buymeacoffee.com/caseycz"><img src="https://img.shields.io/badge/Podpo%C5%99it%20CaseyCZ-Buy%20Me%20a%20Coffee-38BDF8?style=for-the-badge&labelColor=0284C7&logo=buymeacoffee&logoColor=white" alt="Podpořit CaseyCZ" /></a>
</p>

<p align="center">
  <a href="https://www.buymeacoffee.com/caseycz"><img src="https://caseycz.github.io/support-qr.svg" width="150" alt="QR kód Buy Me a Coffee CaseyCZ" /></a><br>
  <sub>Naskenuj QR kód nebo klikni na tlačítko.</sub>
</p>
