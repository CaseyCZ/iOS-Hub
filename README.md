<p align="center">
  <img src="readme-header.svg" alt="CaseyCZ iOS Hub" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/CZ-%C4%8Ce%C5%A1tina-38BDF8?style=for-the-badge&labelColor=0284C7" alt="Čeština" />
  <a href="README_EN.md"><img src="https://img.shields.io/badge/EN-English-172033?style=for-the-badge&labelColor=111827" alt="English" /></a>
</p>

<p align="center">
  Moderní katalog pro <strong>AltStore / SideStore zdroje, Source Builder a praktické iOS nástroje</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/VERZE-v1.1.0-38BDF8?style=for-the-badge&labelColor=0284C7" alt="CaseyCZ iOS Hub v1.1.0" />
</p>

<p align="center">
  <a href="https://caseycz.github.io/iOS-Hub/"><img src="https://img.shields.io/badge/Web-Otev%C5%99%C3%ADt-38BDF8?style=for-the-badge&labelColor=0284C7&logo=googlechrome&logoColor=white" alt="Otevřít CaseyCZ iOS Hub" /></a>
</p>

## O projektu

**CaseyCZ iOS Hub** je živý katalog veřejných iOS source repozitářů s automatickou kontrolou dostupnosti. Nefunkční zdroj se na webu nenabízí a po obnovení se může automaticky vrátit.

## Hlavní funkce

- 🔗 katalog AltStore Classic, AltStore PAL a SideStore zdrojů
- 🟢 automatická kontrola dostupnosti a JSON struktury
- 🗂️ dvojité filtrování podle typu zdroje a žánru
- 🧩 Source Builder pro kombinování kompatibilních Classic zdrojů
- 🧹 deduplikace aplikací podle `bundleIdentifier`
- 🛠️ lokální webový převodník **DEB → IPA** pro iPhone, iPad, Mac i PC
- 🔒 DEB převod běží lokálně v prohlížeči bez uploadu souboru
- 🌍 rozhraní EN / CZ / DE / ES / FR, výchozí jazyk je angličtina
- 💾 uložení jazyka, tématu, filtrů a výběru Source Builderu
- 🌙 tmavý / světlý vzhled ve stylu CaseyCZ

## Source Builder

Builder kombinuje menší veřejné Classic zdroje, které lze rozumně sloučit do jednoho JSONu. Velké komunitní katalogy a PAL zdroje se přidávají přímo.

Automatizace v GitHub Actions pravidelně stahuje povolené zdroje, ověřuje jejich JSON a dostupnost, počítá aplikace a aktualizuje veřejný katalog i připravené Mix JSONy.

## DEB → IPA

Webový převodník zpracuje kompatibilní `.deb` obsahující skutečnou iOS `.app`, vytvoří strukturu `Payload/App.app` a zabalí ji jako `.ipa`. Výsledná IPA není automaticky podepsaná a ne každý Debian balíček lze převést — jailbreak tweaky, knihovny a systémové balíčky nejsou běžné aplikace.

## Zdroje

Katalog používá vlastní whitelist v `sources/registry.json`. Veřejné seznamy slouží jako podklady pro objevování dalších zdrojů; jednotlivé URL jsou před zobrazením kontrolované samostatně.

CaseyCZ iOS Hub cizí IPA soubory nerehostuje. Sloučené source JSONy zachovávají původní download URL jednotlivých projektů.

## Podpora

<p align="center">
  <a href="https://www.buymeacoffee.com/caseycz"><img src="https://img.shields.io/badge/Podpo%C5%99it%20CaseyCZ-Buy%20Me%20a%20Coffee-38BDF8?style=for-the-badge&labelColor=0284C7&logo=buymeacoffee&logoColor=white" alt="Podpořit CaseyCZ" /></a>
</p>

<p align="center">
  <a href="https://www.buymeacoffee.com/caseycz"><img src="https://caseycz.github.io/support-qr.svg" width="150" alt="QR kód Buy Me a Coffee CaseyCZ" /></a><br>
  <sub>Naskenuj QR kód nebo klikni na tlačítko.</sub>
</p>
