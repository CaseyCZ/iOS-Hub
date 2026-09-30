<p align="center">
  <img src="readme-header.svg" alt="CaseyCZ iOS Hub" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/CZ-%C4%8Ce%C5%A1tina-38BDF8?style=for-the-badge&labelColor=0284C7" alt="Čeština" />
  <a href="README_EN.md"><img src="https://img.shields.io/badge/EN-English-172033?style=for-the-badge&labelColor=111827" alt="English" /></a>
</p>

<p align="center">
  Katalog pro <strong>kompatibilní iOS zdroje, Source Builder a praktické iOS nástroje</strong>.
</p>

<p align="center">
  <a href="https://caseycz.github.io/iOS-Hub/"><img src="https://img.shields.io/badge/Web-Otev%C5%99%C3%ADt-38BDF8?style=for-the-badge&labelColor=0284C7&logo=googlechrome&logoColor=white" alt="Otevřít CaseyCZ iOS Hub" /></a>
</p>

## O projektu

**CaseyCZ iOS Hub** je živý katalog veřejných iOS source repozitářů. Zdroje se pravidelně kontrolují; pokud některý přestane odpovídat, jeho karta zůstane v katalogu označená jako Offline a instalační tlačítka se dočasně vypnou.

## Hlavní funkce

- kompatibilní Classic/PAL iOS zdroje s installer podporou řízenou z jednoho centrálního registru
- filtry podle typu zdroje, žánru a kompatibility s instalátorem
- vyhledávání podle Source a jejích metadat
- samostatná stránka **Custom Source Builder** pro všechny online zdroje
- interaktivní **Help Center** s výběrem metody, diagnostikou chyb, průvodcem konfigurací a odkazy na oficiální dokumentaci
- kontrola zdrojů každých 6 hodin
- EN / CZ / DE / ES / FR, výchozí jazyk EN
- uložený jazyk, vzhled, filtry a výběr Builderu
- **DEB → IPA Converter (Beta)** pro iPhone, iPad, Mac a PC

## Kompatibilní source instalátory

Source Builder nevytváří žádný nový feed ani Mix JSON. Podporované cíle jsou **AltStore Classic, AltStore PAL, SideStore, LiveContainer, FlareStore a Feather**.

Pro hromadný import Builder předá zvolený instalátor a seznam původních Source URL zkratce **iOS Hub Source Import**, která jednotlivé původní Sources otevře ve vybrané aplikaci. Některé instalátory je umí převzít přímo, jiné mohou zobrazit vlastní náhled nebo vyžádat potvrzení. Dole v Builderu proto zůstává i ruční otevření po jedné.

Zkratku lze nainstalovat nebo znovu přidat přes: https://caseycz.github.io/iOS-Hub/shortcut.html

Podpora instalátorů, jejich pořadí, ikony a deep-linky jsou definované centrálně v `src/js/installers.js`, takže další installer není potřeba ručně doplňovat do každé source karty.

CaseyCZ iOS Hub cizí IPA soubory ani cizí Source JSONy nerehostuje. Builder pracuje s původními veřejnými Source URL; volitelný JSON export ukládá pouze vybraný instalátor a seznam těchto původních URL.

## Soukromí a obsah třetích stran

Google Analytics se načítá až po výslovném souhlasu uživatele. Volbu lze kdykoli změnit přes **Cookie settings** a podrobnosti jsou na stránce `privacy.html`.

iOS Hub je nezávislý projekt a není přidružený k AltStore, SideStore, LiveContainer, Feather, FlareStore ani k autorům katalogizovaných Sources, pokud to výslovně neuvádí původní projekt. Registry u každého Source sleduje stav compliance kontroly, důkazní URL a datum kontroly. Všechny aktuální Sources jsou klasifikované v [COMPLIANCE.md](COMPLIANCE.md). Builder používá pouze původní veřejné Source URL: iOS Hub může zkontrolovat jejich dostupnost a formát, ale jejich plný feed ani app metadata nekopíruje, neslučuje, necachuje ani nerehostuje.

## DEB → IPA Beta

Převod probíhá lokálně v prohlížeči bez uploadu `.deb` na server. Funguje pro kompatibilní balíčky obsahující skutečnou `.app` aplikaci.

Ne každý Debian balíček lze bezpečně převést pouze přebalením. Jailbreak tweaky, knihovny, systémové balíčky a aplikace využívající speciální filesystem metadata nebo symlinky mohou vyžadovat desktopový nástroj. Výsledná IPA také není automaticky podepsaná.

## Podpora

<p align="center">
  <a href="https://www.buymeacoffee.com/caseycz"><img src="https://img.shields.io/badge/Podpo%C5%99it%20CaseyCZ-Buy%20Me%20a%20Coffee-38BDF8?style=for-the-badge&labelColor=0284C7&logo=buymeacoffee&logoColor=white" alt="Podpořit CaseyCZ" /></a>
</p>

<p align="center">
  <a href="https://www.buymeacoffee.com/caseycz"><img src="https://caseycz.github.io/support-qr.svg" width="150" alt="QR kód Buy Me a Coffee CaseyCZ" /></a><br>
  <sub>Naskenuj QR kód nebo klikni na tlačítko.</sub>
</p>
