import { SUPPORTED_LANGUAGES, applyTranslations, normalizeLanguage, t } from './i18n.js?v=1.1.5-20260929-guide-methods1';
import { sideloadTool, sideloadToolForRole, sideloadToolURL, troubleshootingSideloadTools } from './installers.js?v=1.1.5-20260929-installers20';

const root = document.documentElement;
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };

const GUIDE_COPY = {
  en: {
    assistantEyebrow:'QUICK CHOICE', assistantTitle:'What do you want to do?', assistantDesc:'Pick your goal. iOS Hub will point you to the most relevant method and then you can open the detailed guide.',
    goalIphone:'Install IPA and refresh from iPhone', goalRefresh:'My refresh does not work', goalMany:'I want many IPA apps', goalDesktop:'Install mainly from a computer', goalTv:'Install apps on Apple TV', goalPermanent:'Permanent install on supported iOS',
    recommendationLabel:'RECOMMENDATION',
    sideInstallerTitle:'Install SideStore without a PC on iOS 27', sideInstallerDesc:'SideInstaller installs SideStore or SideStore + LiveContainer fully on-device on iOS/iPadOS 27; partial 17–26 support with an existing pairing file. SideInstaller v1 adds partial iOS 17–26 support when you already have a pairing file created with a computer.', sideInstallerSafety:'Use only sideinstaller.net or the official FrizzleM/SideInstaller GitHub repository when entering Apple account credentials.', sideInstallerOpen:'Open official SideInstaller ↗',
    sideInstallerBest:'On-device SideStore / LiveContainer setup', sideInstallerDevice:'iOS/iPadOS 27', sideInstallerComputer:'No PC on iOS/iPadOS 27; iOS 17–26 requires an existing pairing file created with a computer', sideInstallerRefresh:'Installer only; refreshing is then handled by SideStore',
    troubleChipRefresh:'Refresh', troubleChipLogin:'Apple ID / login', troubleChipPairing:'Pairing', troubleChipCertificate:'Certificate', troubleChipLimits:'App limits', troubleChipLiveContainer:'LiveContainer', troubleChipAltServer:'AltServer', troubleChipAll:'All',
    troubleLoginQ:'Apple ID login fails, HTTP 503 or 2FA does not work', troubleLoginA:'For SideStore sign-in issues, first try another Anisette Server. If the Apple verification code does not arrive, request one manually from Apple Account settings. SideInstaller v1.0.0 also documents fixes for HTTP 503, SMS/call 2FA and reusable session IDs.',
    troubleAutoRefreshQ:'LiveContainer + SideStore does not refresh automatically', troubleAutoRefreshA:'First make sure Wi-Fi and LocalDevVPN are active and that a manual Refresh All works in the built-in SideStore. The official LiveContainer LC+SS guide says the auto-refresh Shortcut can be used by replacing SideStore’s Refresh All Apps action with LiveContainer’s action.',
    troublePairingExpireQ:'SideStore pairing stopped working after an iOS update or reset', troublePairingExpireA:'SideStore documents that pairing files can expire after an update or reset, and sometimes unexpectedly. Update iloader, delete the stored pairing, pair and trust the device again, place the new pairing file for SideStore, reconnect LocalDevVPN and refresh.',
    troubleInvalidIpaQ:'SideStore error 1005 / 1007 — app not found or invalid IPA', troubleInvalidIpaA:'Error 1005 means SideStore could not find the app file at the provided URL. Error 1007 means the downloaded file is not a standard IPA. Re-download from the original source or try another verified source.',
communityChip:'iOS 27 / Shortcut',communityLabel:'COMMUNITY WORKAROUND', communityShortcutQ:'iOS 27: Shortcut refresh does not run reliably', communityShortcutA:'Community reports suggest first confirming that manual Refresh All works. For Shortcuts, keep Refresh All Apps as the final refresh action, avoid turning LocalDevVPN off too early, and if one app still refuses to refresh try long-pressing it in SideStore and choosing Resign. These are community workarounds, not official SideStore requirements.', communityVpnQ:'LocalDevVPN connects but refresh still fails on iOS 27', communityVpnA:'A community workaround reported on Reddit is to set Tunnel IP to 10.7.0.2/30 and Device IP to 10.7.0.1/32 in LocalDevVPN. This is not an official SideStore fix and does not help every device, so use it only after the official Wi-Fi, LocalDevVPN, pairing and DNS-blocker checks.',troubleNightlyQ:'SideStore nightly is unstable or suddenly broke', troubleNightlyA:'SideStore official troubleshooting says nightly builds may contain unstable bleeding-edge changes. If a problem appears only on nightly, switch to the latest stable build before deeper troubleshooting.',
    troubleSideInstallerInstallQ:'SideInstaller cannot install SideStore', troubleSideInstallerInstallA:'Use the current official SideInstaller build and check the exact iOS version first. On iOS 27 the setup can run on-device; iOS 17–26 needs an existing pairing file. If Apple sign-in returns HTTP 503 or certificates are revoked, check the current SideInstaller release notes before retrying.',
    troubleFeatherQ:'Feather cannot install an app or says integrity cannot be verified', troubleFeatherA:'Check the certificate pair first. Feather documents revoked or expired certificates, a certificate that does not include your device UDID, and a damaged IPA as common causes. If you use the idevice installation method, also verify the pairing file, LocalDevVPN and that Heartbeat is green.',
    troubleFlareQ:'FlareStore signs the IPA but the install prompt fails', troubleFlareA:'Verify that a signing certificate is imported in FlareStore. If the install prompt does not appear or you get a domain lookup error, allow *.flarestore.vip and localhost.flarestore.vip through your VPN, DNS or ad blocker and retry the install.',
    troubleSideloadlyQ:'Sideloadly fails with Anisette, provisioning or signing errors', troubleSideloadlyA:'Start with the official Sideloadly FAQ for the exact message. Remote Anisette server errors can require retrying later or switching Anisette mode; invalid IPA paths, provisioning-profile errors and invalid signing identity each have separate documented checks.',
    communitySideloadlyMacQ:'macOS 27: Sideloadly reports Anisette failed: No OTP', communitySideloadlyMacA:'A recent community workaround is to switch Sideloadly Advanced Options → Anisette Authentication from Local to Remote. This is a community workaround for the current macOS 27 behavior, not an official requirement, so check the official FAQ and newer releases first.',
    troubleAtvloadlyQ:'atvloadly cannot find or install to Apple TV', troubleAtvloadlyA:'Use the official atvloadly FAQ. Turn off VPN, restart Apple TV, enter pairing mode again and confirm mDNS/Avahi discovery works. Docker installs may need privileged mode. After a tvOS upgrade, pairing may need to be recreated.',
    troubleImpactorQ:'Impactor cannot detect the device or installation verification fails', troubleImpactorA:'On Windows, make sure Apple device drivers from iTunes are available. On Linux, check usbmuxd and reconnect the device before restarting Impactor. Pairing-file installation requires USB. For verification errors such as 0xe8008018, also check that the computer and device time are correct and sign in again.',
    troubleTrollInstallQ:'TrollStore cannot install an IPA or shows install error 175 / ldid', troubleTrollInstallA:'First confirm your exact iOS version is supported and update TrollStore. Install error 175 is an ldid signing failure and can also be caused by an IPA binary that TrollStore cannot process. Use the official issue tracker with the exact TrollStore version, iOS version and install log if the error remains.',
    troublePalQ:'AltStore PAL will not install, download or add a Source', troublePalA:'Use the official AltStore PAL troubleshooting page. Check the supported region and iOS version, use Safari for marketplace installation, disable a VPN if downloads return NSURLError, and update AltStore PAL if a Source reports that the installed version is unsupported.',
reportHelpTitle:'Still not working?', reportHelpDesc:'Open a pre-filled GitHub report with the selected problem so it is easier to diagnose.', reportHelpButton:'Report this problem ↗'
  },
  cs: {
    assistantEyebrow:'RYCHLÁ VOLBA', assistantTitle:'Co chceš udělat?', assistantDesc:'Vyber svůj cíl. iOS Hub ti doporučí nejvhodnější cestu a potom můžeš otevřít podrobný návod.',
    goalIphone:'Instalovat IPA a obnovovat z iPhonu', goalRefresh:'Nefunguje mi refresh', goalMany:'Chci hodně IPA aplikací', goalDesktop:'Instalovat hlavně z počítače', goalTv:'Instalovat aplikace na Apple TV', goalPermanent:'Trvalá instalace na podporovaném iOS',
    recommendationLabel:'DOPORUČENÁ CESTA',
    sideInstallerTitle:'SideStore bez PC na iOS 27', sideInstallerDesc:'SideInstaller umí na iOS/iPadOS 27 nainstalovat SideStore nebo SideStore + LiveContainer přímo v zařízení. SideInstaller v1 přidává částečnou podporu iOS 17–26, pokud už máš pairing soubor vytvořený pomocí počítače.', sideInstallerSafety:'Při zadávání Apple účtu používej pouze sideinstaller.net nebo oficiální GitHub FrizzleM/SideInstaller.', sideInstallerOpen:'Otevřít oficiální SideInstaller ↗',
    sideInstallerBest:'Instalace SideStore / LiveContainer přímo v zařízení', sideInstallerDevice:'iOS/iPadOS 27', sideInstallerComputer:'Na iOS/iPadOS 27 bez PC; iOS 17–26 vyžaduje existující pairing soubor vytvořený pomocí počítače', sideInstallerRefresh:'Je to instalátor; další obnovování řeší SideStore',
    troubleChipRefresh:'Refresh', troubleChipLogin:'Apple ID / přihlášení', troubleChipPairing:'Pairing', troubleChipCertificate:'Certifikát', troubleChipLimits:'Limity aplikací', troubleChipLiveContainer:'LiveContainer', troubleChipAltServer:'AltServer', troubleChipAll:'Vše',
    troubleLoginQ:'Selže přihlášení Apple ID, HTTP 503 nebo 2FA', troubleLoginA:'U problémů s přihlášením v SideStore nejdřív změň Anisette Server. Pokud nepřijde ověřovací kód Apple, vyžádej si ho ručně v nastavení Apple účtu. SideInstaller v1.0.0 navíc uvádí opravu HTTP 503, podporu 2FA přes SMS/volání a opakované použití session ID.',
    troubleAutoRefreshQ:'LiveContainer + SideStore se automaticky neobnovuje', troubleAutoRefreshA:'Nejdřív ověř Wi-Fi, zapnutý LocalDevVPN a že v zabudovaném SideStore funguje ruční Refresh All. Oficiální LC+SS návod LiveContaineru uvádí, že pro auto-refresh Shortcut se má akce SideStore Refresh All Apps nahradit akcí LiveContaineru.',
    troublePairingExpireQ:'SideStore pairing přestal fungovat po aktualizaci nebo resetu iOS', troublePairingExpireA:'SideStore uvádí, že pairing soubor může po aktualizaci nebo resetu expirovat a někdy i nečekaně. Aktualizuj iloader, smaž uložený pairing, zařízení znovu spáruj a potvrď důvěru, vlož nový pairing soubor pro SideStore, připoj LocalDevVPN a proveď refresh.',
    troubleInvalidIpaQ:'SideStore chyba 1005 / 1007 — aplikace nenalezena nebo neplatná IPA', troubleInvalidIpaA:'Chyba 1005 znamená, že SideStore nenašel soubor aplikace na zadané URL. Chyba 1007 znamená, že stažený soubor není standardní IPA. Stáhni aplikaci znovu z původního zdroje nebo zkus jiný ověřený zdroj.',
communityChip:'iOS 27 / Shortcut',communityLabel:'KOMUNITNÍ ŘEŠENÍ', communityShortcutQ:'iOS 27: Shortcut pro refresh nefunguje spolehlivě', communityShortcutA:'Podle zkušeností komunity nejdřív ověř, že ruční Refresh All funguje. Ve Shortcutu nech Refresh All Apps jako poslední refresh akci, nevypínej LocalDevVPN příliš brzy a pokud se jedna aplikace stále neobnoví, zkus v SideStore dlouhé podržení aplikace → Resign. Jde o komunitní workaroundy, ne oficiální požadavky SideStore.', communityVpnQ:'LocalDevVPN je připojená, ale refresh na iOS 27 stále selhává', communityVpnA:'Na Redditu se objevuje komunitní workaround: v LocalDevVPN nastavit Tunnel IP na 10.7.0.2/30 a Device IP na 10.7.0.1/32. Není to oficiální oprava SideStore a nepomáhá na každém zařízení, proto ji zkoušej až po oficiální kontrole Wi-Fi, LocalDevVPN, pairingu a DNS blokátorů.',troubleNightlyQ:'SideStore nightly je nestabilní nebo náhle přestal fungovat', troubleNightlyA:'Oficiální troubleshooting SideStore upozorňuje, že nightly buildy mohou obsahovat nestabilní nové změny. Pokud se problém objevuje jen na nightly, před další diagnostikou přejdi na nejnovější stable build.',
    troubleSideInstallerInstallQ:'SideInstaller nedokáže nainstalovat SideStore', troubleSideInstallerInstallA:'Použij aktuální oficiální SideInstaller a nejdřív ověř přesnou verzi iOS. Na iOS 27 může instalace proběhnout přímo v zařízení; iOS 17–26 potřebuje existující pairing soubor. Pokud přihlášení Apple vrací HTTP 503 nebo jsou certifikáty revokované, před dalším pokusem zkontroluj aktuální release notes SideInstalleru.',
    troubleFeatherQ:'Feather nedokáže nainstalovat aplikaci nebo hlásí neověřenou integritu', troubleFeatherA:'Nejdřív zkontroluj certifikát. Feather mezi časté příčiny uvádí revokovaný nebo expirovaný certifikát, certifikát bez UDID tvého zařízení a poškozenou IPA. Pokud používáš instalaci přes idevice, ověř také pairing soubor, LocalDevVPN a že je Heartbeat zelený.',
    troubleFlareQ:'FlareStore IPA podepíše, ale instalační výzva selže', troubleFlareA:'Ověř, že je ve FlareStore importovaný podpisový certifikát. Pokud se instalační výzva neukáže nebo dostaneš chybu domain lookup, povol *.flarestore.vip a localhost.flarestore.vip ve VPN, DNS nebo blokátoru reklam a instalaci zopakuj.',
    troubleSideloadlyQ:'Sideloadly selže na Anisette, provisioning nebo podpisu', troubleSideloadlyA:'Začni přesnou chybou v oficiálním FAQ Sideloadly. Chyby Remote Anisette mohou vyžadovat pozdější opakování nebo změnu Anisette režimu; neplatná cesta k IPA, provisioning profil a neplatná podpisová identita mají vlastní kontroly.',
    communitySideloadlyMacQ:'macOS 27: Sideloadly hlásí Anisette failed: No OTP', communitySideloadlyMacA:'Aktuální komunitní workaround je v Sideloadly přepnout Advanced Options → Anisette Authentication z Local na Remote. Jde o komunitní řešení současného chování macOS 27, ne oficiální požadavek, proto nejdřív zkontroluj oficiální FAQ a novější verzi.',
    troubleAtvloadlyQ:'atvloadly nenajde Apple TV nebo na ni nedokáže instalovat', troubleAtvloadlyA:'Použij oficiální FAQ atvloadly. Vypni VPN, restartuj Apple TV, znovu otevři režim párování a ověř mDNS/Avahi discovery. Docker může potřebovat privileged režim. Po aktualizaci tvOS může být nutné Apple TV znovu spárovat.',
    troubleImpactorQ:'Impactor nevidí zařízení nebo instalace selže při ověření', troubleImpactorA:'Ve Windows ověř Apple ovladače z iTunes. Na Linuxu zkontroluj usbmuxd, připoj zařízení a restartuj Impactor. Instalace pairing souboru vyžaduje USB. U chyb ověření jako 0xe8008018 zkontroluj také správný čas na počítači i zařízení a znovu se přihlas.',
    troubleTrollInstallQ:'TrollStore nedokáže nainstalovat IPA nebo hlásí error 175 / ldid', troubleTrollInstallA:'Nejdřív ověř podporu přesné verze iOS a aktualizuj TrollStore. Error 175 je chyba podpisu přes ldid a může ji způsobit i IPA s binárkou, kterou TrollStore neumí zpracovat. Pokud chyba zůstane, použij oficiální issue tracker a přilož verzi TrollStore, iOS a instalační log.',
    troublePalQ:'AltStore PAL nejde nainstalovat, stáhnout nebo přidat Source', troublePalA:'Použij oficiální troubleshooting AltStore PAL. Ověř podporovaný region a verzi iOS, marketplace instaluj přes Safari, při NSURLError zkus vypnout VPN a pokud Source hlásí nepodporovanou verzi AltStore, aktualizuj AltStore PAL.',
reportHelpTitle:'Pořád to nejde?', reportHelpDesc:'Otevři předvyplněné hlášení na GitHubu s vybraným problémem, aby šla chyba rychleji dohledat.', reportHelpButton:'Nahlásit tento problém ↗'
  },
  de: {
    assistantEyebrow:'SCHNELLAUSWAHL', assistantTitle:'Was möchtest du tun?', assistantDesc:'Wähle dein Ziel. iOS Hub zeigt dir den passendsten Weg und danach kannst du die ausführliche Anleitung öffnen.',
    goalIphone:'IPA installieren und vom iPhone aktualisieren', goalRefresh:'Mein Refresh funktioniert nicht', goalMany:'Ich möchte viele IPA-Apps', goalDesktop:'Hauptsächlich vom Computer installieren', goalTv:'Apps auf Apple TV installieren', goalPermanent:'Dauerhafte Installation auf unterstütztem iOS',
    recommendationLabel:'EMPFEHLUNG',
    sideInstallerTitle:'SideStore ohne PC auf iOS 27 installieren', sideInstallerDesc:'SideInstaller installiert SideStore oder SideStore + LiveContainer unter iOS/iPadOS 27 vollständig auf dem Gerät. SideInstaller v1 unterstützt iOS 17–26 teilweise, wenn bereits eine mit einem Computer erstellte Pairing-Datei vorhanden ist.', sideInstallerSafety:'Bei der Eingabe deines Apple-Accounts nur sideinstaller.net oder das offizielle GitHub-Repository FrizzleM/SideInstaller verwenden.', sideInstallerOpen:'Offiziellen SideInstaller öffnen ↗',
    sideInstallerBest:'SideStore / LiveContainer direkt auf dem Gerät einrichten', sideInstallerDevice:'iOS/iPadOS 27', sideInstallerComputer:'Unter iOS/iPadOS 27 kein PC; iOS 17–26 benötigt eine vorhandene, mit einem Computer erstellte Pairing-Datei', sideInstallerRefresh:'Nur Installer; die Aktualisierung übernimmt danach SideStore',
    troubleChipRefresh:'Refresh', troubleChipLogin:'Apple ID / Login', troubleChipPairing:'Pairing', troubleChipCertificate:'Zertifikat', troubleChipLimits:'App-Limits', troubleChipLiveContainer:'LiveContainer', troubleChipAltServer:'AltServer', troubleChipAll:'Alle',
    troubleLoginQ:'Apple-ID-Anmeldung, HTTP 503 oder 2FA schlägt fehl', troubleLoginA:'Bei SideStore-Anmeldeproblemen zuerst einen anderen Anisette-Server wählen. Wenn kein Apple-Bestätigungscode ankommt, ihn manuell in den Apple-Account-Einstellungen anfordern. SideInstaller v1.0.0 dokumentiert außerdem Korrekturen für HTTP 503, SMS/Anruf-2FA und wiederverwendbare Session-IDs.',
    troubleAutoRefreshQ:'LiveContainer + SideStore aktualisiert nicht automatisch', troubleAutoRefreshA:'Prüfe zuerst Wi-Fi, LocalDevVPN und ob ein manuelles Refresh All im eingebauten SideStore funktioniert. Laut offizieller LC+SS-Dokumentation kann der Auto-Refresh-Shortcut verwendet werden, indem die SideStore-Aktion Refresh All Apps durch die LiveContainer-Aktion ersetzt wird.',
    troublePairingExpireQ:'SideStore-Pairing funktioniert nach iOS-Update oder Reset nicht mehr', troublePairingExpireA:'SideStore dokumentiert, dass Pairing-Dateien nach einem Update oder Reset und manchmal unerwartet ablaufen können. iloader aktualisieren, gespeichertes Pairing löschen, Gerät erneut koppeln und vertrauen, neue Pairing-Datei für SideStore ablegen, LocalDevVPN verbinden und aktualisieren.',
    troubleInvalidIpaQ:'SideStore Fehler 1005 / 1007 — App nicht gefunden oder ungültige IPA', troubleInvalidIpaA:'Fehler 1005 bedeutet, dass SideStore die App-Datei unter der angegebenen URL nicht finden konnte. Fehler 1007 bedeutet, dass die heruntergeladene Datei keine Standard-IPA ist. Lade sie erneut von der Originalquelle oder einer anderen verifizierten Quelle.',
communityChip:'iOS 27 / Shortcut',communityLabel:'COMMUNITY-WORKAROUND', communityShortcutQ:'iOS 27: Shortcut-Refresh läuft nicht zuverlässig', communityShortcutA:'Berichte aus der Community empfehlen zuerst zu prüfen, ob Refresh All manuell funktioniert. Im Shortcut sollte Refresh All Apps die letzte Refresh-Aktion sein; LocalDevVPN nicht zu früh deaktivieren. Wenn eine einzelne App weiter nicht aktualisiert wird, in SideStore lange drücken und Resign wählen. Das sind Community-Workarounds, keine offiziellen SideStore-Anforderungen.', communityVpnQ:'LocalDevVPN ist verbunden, aber Refresh schlägt unter iOS 27 weiter fehl', communityVpnA:'Ein auf Reddit gemeldeter Community-Workaround setzt in LocalDevVPN Tunnel IP auf 10.7.0.2/30 und Device IP auf 10.7.0.1/32. Das ist kein offizieller SideStore-Fix und hilft nicht auf jedem Gerät. Erst nach den offiziellen Prüfungen für Wi-Fi, LocalDevVPN, Pairing und DNS-Blocker testen.',troubleNightlyQ:'SideStore Nightly ist instabil oder funktioniert plötzlich nicht mehr', troubleNightlyA:'Die offizielle SideStore-Fehlerbehebung weist darauf hin, dass Nightly-Builds instabile neue Änderungen enthalten können. Tritt das Problem nur im Nightly auf, wechsle zuerst zum neuesten Stable-Build.',
    troubleSideInstallerInstallQ:'SideInstaller kann SideStore nicht installieren', troubleSideInstallerInstallA:'Verwende den aktuellen offiziellen SideInstaller und prüfe zuerst die genaue iOS-Version. Unter iOS 27 kann das Setup direkt auf dem Gerät laufen; iOS 17–26 benötigt eine vorhandene Pairing-Datei. Bei HTTP 503 oder widerrufenen Zertifikaten zuerst die aktuellen SideInstaller-Release-Notes prüfen.',
    troubleFeatherQ:'Feather kann eine App nicht installieren oder die Integrität nicht verifizieren', troubleFeatherA:'Prüfe zuerst das Zertifikatspaar. Feather nennt widerrufene oder abgelaufene Zertifikate, ein Zertifikat ohne Geräte-UDID und eine beschädigte IPA als häufige Ursachen. Bei der idevice-Methode auch Pairing-Datei, LocalDevVPN und einen grünen Heartbeat prüfen.',
    troubleFlareQ:'FlareStore signiert die IPA, aber die Installationsabfrage schlägt fehl', troubleFlareA:'Prüfe, ob ein Signaturzertifikat in FlareStore importiert ist. Wenn keine Installationsabfrage erscheint oder ein Domain-Lookup-Fehler kommt, *.flarestore.vip und localhost.flarestore.vip in VPN, DNS oder Werbeblocker erlauben.',
    troubleSideloadlyQ:'Sideloadly scheitert mit Anisette-, Provisioning- oder Signaturfehlern', troubleSideloadlyA:'Beginne mit der exakten Meldung in der offiziellen Sideloadly-FAQ. Remote-Anisette-Fehler können einen späteren Versuch oder einen Wechsel des Anisette-Modus erfordern; IPA-Pfad, Provisioning-Profil und Signaturidentität haben eigene Prüfungen.',
    communitySideloadlyMacQ:'macOS 27: Sideloadly meldet Anisette failed: No OTP', communitySideloadlyMacA:'Ein aktueller Community-Workaround ist Advanced Options → Anisette Authentication von Local auf Remote umzustellen. Das ist ein Community-Workaround für das aktuelle macOS-27-Verhalten, keine offizielle Anforderung. Zuerst FAQ und neuere Releases prüfen.',
    troubleAtvloadlyQ:'atvloadly findet Apple TV nicht oder kann nicht installieren', troubleAtvloadlyA:'Nutze die offizielle atvloadly-FAQ. VPN ausschalten, Apple TV neu starten, Pairing-Modus erneut öffnen und mDNS/Avahi prüfen. Docker kann den privilegierten Modus benötigen. Nach einem tvOS-Update kann neues Pairing nötig sein.',
    troubleImpactorQ:'Impactor erkennt das Gerät nicht oder die Installationsprüfung schlägt fehl', troubleImpactorA:'Unter Windows Apple-Gerätetreiber über iTunes prüfen. Unter Linux usbmuxd prüfen, Gerät verbinden und Impactor neu starten. Pairing-Dateien benötigen USB. Bei 0xe8008018 auch korrekte Uhrzeit auf Computer und Gerät prüfen und erneut anmelden.',
    troubleTrollInstallQ:'TrollStore kann eine IPA nicht installieren oder zeigt Fehler 175 / ldid', troubleTrollInstallA:'Prüfe zuerst die unterstützte iOS-Version und aktualisiere TrollStore. Fehler 175 ist ein ldid-Signaturfehler und kann auch durch eine nicht verarbeitbare IPA-Binärdatei entstehen. Bei weiterem Fehler den offiziellen Issue-Tracker mit Versionen und Installationslog verwenden.',
    troublePalQ:'AltStore PAL lässt sich nicht installieren, laden oder eine Source hinzufügen', troublePalA:'Nutze die offizielle AltStore-PAL-Fehlerbehebung. Region und iOS-Version prüfen, Marketplace-Installation in Safari durchführen, bei NSURLError VPN deaktivieren und AltStore PAL aktualisieren, wenn eine Source die installierte Version nicht unterstützt.',
reportHelpTitle:'Funktioniert es immer noch nicht?', reportHelpDesc:'Öffne einen vorausgefüllten GitHub-Bericht mit dem ausgewählten Problem.', reportHelpButton:'Problem melden ↗'
  },
  es: {
    assistantEyebrow:'ELECCIÓN RÁPIDA', assistantTitle:'¿Qué quieres hacer?', assistantDesc:'Elige tu objetivo. iOS Hub te mostrará la ruta más adecuada y después podrás abrir la guía detallada.',
    goalIphone:'Instalar IPA y renovarlas desde el iPhone', goalRefresh:'Mi renovación no funciona', goalMany:'Quiero muchas apps IPA', goalDesktop:'Instalar principalmente desde un ordenador', goalTv:'Instalar apps en Apple TV', goalPermanent:'Instalación permanente en iOS compatible',
    recommendationLabel:'RECOMENDACIÓN',
    sideInstallerTitle:'Instalar SideStore sin PC en iOS 27', sideInstallerDesc:'SideInstaller instala SideStore o SideStore + LiveContainer completamente desde el dispositivo en iOS/iPadOS 27. SideInstaller v1 añade compatibilidad parcial con iOS 17–26 si ya tienes un archivo de pairing creado con un ordenador.', sideInstallerSafety:'Al introducir tu cuenta Apple usa solo sideinstaller.net o el repositorio oficial FrizzleM/SideInstaller en GitHub.', sideInstallerOpen:'Abrir SideInstaller oficial ↗',
    sideInstallerBest:'Configurar SideStore / LiveContainer desde el dispositivo', sideInstallerDevice:'iOS/iPadOS 27', sideInstallerComputer:'Sin PC en iOS/iPadOS 27; iOS 17–26 necesita un archivo de pairing existente creado con un ordenador', sideInstallerRefresh:'Solo instala; después la renovación la gestiona SideStore',
    troubleChipRefresh:'Renovación', troubleChipLogin:'Apple ID / acceso', troubleChipPairing:'Emparejamiento', troubleChipCertificate:'Certificado', troubleChipLimits:'Límites de apps', troubleChipLiveContainer:'LiveContainer', troubleChipAltServer:'AltServer', troubleChipAll:'Todo',
    troubleLoginQ:'Falla el acceso con Apple ID, HTTP 503 o 2FA', troubleLoginA:'Para problemas de acceso en SideStore, prueba primero otro servidor Anisette. Si no llega el código de verificación de Apple, solicítalo manualmente en los ajustes de la cuenta Apple. SideInstaller v1.0.0 también documenta correcciones para HTTP 503, 2FA por SMS/llamada y reutilización de sesiones.',
    troubleAutoRefreshQ:'LiveContainer + SideStore no se renueva automáticamente', troubleAutoRefreshA:'Comprueba primero Wi-Fi, LocalDevVPN y que Refresh All funcione manualmente en el SideStore integrado. La guía oficial LC+SS de LiveContainer indica que el Shortcut de auto-refresh puede usarse sustituyendo la acción Refresh All Apps de SideStore por la acción de LiveContainer.',
    troublePairingExpireQ:'El emparejamiento de SideStore dejó de funcionar tras actualizar o restablecer iOS', troublePairingExpireA:'SideStore documenta que los archivos de emparejamiento pueden caducar tras una actualización o restablecimiento y, a veces, inesperadamente. Actualiza iloader, borra el pairing guardado, vuelve a emparejar y confiar en el dispositivo, coloca el nuevo archivo para SideStore, conecta LocalDevVPN y renueva.',
    troubleInvalidIpaQ:'Error 1005 / 1007 de SideStore — app no encontrada o IPA no válida', troubleInvalidIpaA:'El error 1005 significa que SideStore no encontró el archivo de la app en la URL indicada. El error 1007 significa que el archivo descargado no es una IPA estándar. Vuelve a descargarlo desde la fuente original o prueba otra fuente verificada.',
communityChip:'iOS 27 / Shortcut',communityLabel:'SOLUCIÓN DE LA COMUNIDAD', communityShortcutQ:'iOS 27: el Shortcut de renovación no funciona de forma fiable', communityShortcutA:'Los informes de la comunidad recomiendan comprobar primero que Refresh All funciona manualmente. En el Shortcut deja Refresh All Apps como última acción de renovación, no desactives LocalDevVPN demasiado pronto y, si una app sigue sin renovarse, mantén pulsada la app en SideStore y elige Resign. Son soluciones de la comunidad, no requisitos oficiales de SideStore.', communityVpnQ:'LocalDevVPN está conectado pero la renovación sigue fallando en iOS 27', communityVpnA:'Un workaround comunitario publicado en Reddit consiste en configurar Tunnel IP como 10.7.0.2/30 y Device IP como 10.7.0.1/32 en LocalDevVPN. No es una solución oficial de SideStore y no funciona en todos los dispositivos; úsalo solo después de las comprobaciones oficiales de Wi-Fi, LocalDevVPN, pairing y bloqueadores DNS.',troubleNightlyQ:'SideStore nightly es inestable o dejó de funcionar de repente', troubleNightlyA:'La guía oficial de SideStore advierte que las builds nightly pueden incluir cambios experimentales inestables. Si el problema solo aparece en nightly, cambia primero a la última versión estable.',
    troubleSideInstallerInstallQ:'SideInstaller no puede instalar SideStore', troubleSideInstallerInstallA:'Usa la versión oficial actual de SideInstaller y comprueba primero la versión exacta de iOS. En iOS 27 la configuración puede hacerse en el dispositivo; iOS 17–26 necesita un archivo de pairing existente. Si aparece HTTP 503 o certificados revocados, revisa primero las notas de la versión actual.',
    troubleFeatherQ:'Feather no puede instalar una app o no puede verificar su integridad', troubleFeatherA:'Comprueba primero el par de certificados. Feather indica como causas comunes certificados revocados o caducados, un certificado sin el UDID del dispositivo y una IPA dañada. Con el método idevice comprueba también el archivo de pairing, LocalDevVPN y que Heartbeat esté en verde.',
    troubleFlareQ:'FlareStore firma la IPA pero falla el aviso de instalación', troubleFlareA:'Comprueba que haya un certificado de firma importado en FlareStore. Si no aparece el aviso de instalación o hay un error de domain lookup, permite *.flarestore.vip y localhost.flarestore.vip en VPN, DNS o bloqueador y vuelve a intentarlo.',
    troubleSideloadlyQ:'Sideloadly falla con errores de Anisette, provisioning o firma', troubleSideloadlyA:'Empieza por el mensaje exacto en la FAQ oficial de Sideloadly. Los errores de Remote Anisette pueden requerir reintentar más tarde o cambiar el modo; la ruta IPA, el perfil de provisioning y la identidad de firma tienen comprobaciones separadas.',
    communitySideloadlyMacQ:'macOS 27: Sideloadly muestra Anisette failed: No OTP', communitySideloadlyMacA:'Un workaround reciente de la comunidad es cambiar Advanced Options → Anisette Authentication de Local a Remote. Es una solución comunitaria para el comportamiento actual de macOS 27, no un requisito oficial; comprueba primero la FAQ y versiones nuevas.',
    troubleAtvloadlyQ:'atvloadly no encuentra Apple TV o no puede instalar', troubleAtvloadlyA:'Usa la FAQ oficial de atvloadly. Desactiva VPN, reinicia Apple TV, vuelve al modo de pairing y comprueba mDNS/Avahi. Docker puede necesitar modo privilegiado. Después de actualizar tvOS puede ser necesario emparejar de nuevo.',
    troubleImpactorQ:'Impactor no detecta el dispositivo o falla la verificación de instalación', troubleImpactorA:'En Windows comprueba los drivers Apple de iTunes. En Linux revisa usbmuxd, conecta el dispositivo y reinicia Impactor. La instalación del archivo de pairing requiere USB. Para 0xe8008018 comprueba también la hora correcta y vuelve a iniciar sesión.',
    troubleTrollInstallQ:'TrollStore no puede instalar una IPA o muestra error 175 / ldid', troubleTrollInstallA:'Primero confirma que tu versión exacta de iOS es compatible y actualiza TrollStore. El error 175 es un fallo de firma de ldid y también puede deberse a una binaria IPA que TrollStore no puede procesar. Usa el issue tracker oficial con versiones y log si continúa.',
    troublePalQ:'AltStore PAL no se instala, descarga o añade una Source', troublePalA:'Usa la solución de problemas oficial de AltStore PAL. Comprueba región y versión de iOS, instala el marketplace desde Safari, desactiva VPN si aparece NSURLError y actualiza AltStore PAL si una Source indica que tu versión no es compatible.',
reportHelpTitle:'¿Sigue sin funcionar?', reportHelpDesc:'Abre un informe de GitHub pre-rellenado con el problema seleccionado.', reportHelpButton:'Reportar este problema ↗'
  },
  fr: {
    assistantEyebrow:'CHOIX RAPIDE', assistantTitle:'Que voulez-vous faire ?', assistantDesc:'Choisissez votre objectif. iOS Hub vous indiquera la méthode la plus adaptée, puis vous pourrez ouvrir le guide détaillé.',
    goalIphone:'Installer des IPA et les actualiser depuis l’iPhone', goalRefresh:'Mon actualisation ne fonctionne pas', goalMany:'Je veux beaucoup d’apps IPA', goalDesktop:'Installer surtout depuis un ordinateur', goalTv:'Installer des apps sur Apple TV', goalPermanent:'Installation permanente sur iOS compatible',
    recommendationLabel:'RECOMMANDATION',
    sideInstallerTitle:'Installer SideStore sans PC sur iOS 27', sideInstallerDesc:'SideInstaller installe SideStore ou SideStore + LiveContainer entièrement sur l’appareil sous iOS/iPadOS 27. SideInstaller v1 ajoute une prise en charge partielle d’iOS 17–26 si vous disposez déjà d’un fichier d’appairage créé avec un ordinateur.', sideInstallerSafety:'Pour saisir votre compte Apple, utilisez uniquement sideinstaller.net ou le dépôt GitHub officiel FrizzleM/SideInstaller.', sideInstallerOpen:'Ouvrir SideInstaller officiel ↗',
    sideInstallerBest:'Configurer SideStore / LiveContainer sur l’appareil', sideInstallerDevice:'iOS/iPadOS 27', sideInstallerComputer:'Pas de PC sous iOS/iPadOS 27 ; iOS 17–26 nécessite un fichier d’appairage existant créé avec un ordinateur', sideInstallerRefresh:'Installateur uniquement ; l’actualisation est ensuite gérée par SideStore',
    troubleChipRefresh:'Actualisation', troubleChipLogin:'Apple ID / connexion', troubleChipPairing:'Appairage', troubleChipCertificate:'Certificat', troubleChipLimits:'Limites d’apps', troubleChipLiveContainer:'LiveContainer', troubleChipAltServer:'AltServer', troubleChipAll:'Tout',
    troubleLoginQ:'Échec de connexion Apple ID, HTTP 503 ou 2FA', troubleLoginA:'Pour les problèmes de connexion SideStore, essayez d’abord un autre serveur Anisette. Si le code de vérification Apple n’arrive pas, demandez-le manuellement dans les réglages du compte Apple. SideInstaller v1.0.0 documente aussi des correctifs pour HTTP 503, la 2FA SMS/appel et la réutilisation des sessions.',
    troubleAutoRefreshQ:'LiveContainer + SideStore ne s’actualise pas automatiquement', troubleAutoRefreshA:'Vérifiez d’abord le Wi-Fi, LocalDevVPN et qu’un Refresh All manuel fonctionne dans SideStore intégré. Le guide officiel LC+SS de LiveContainer indique que le Shortcut d’auto-refresh peut être utilisé en remplaçant l’action Refresh All Apps de SideStore par celle de LiveContainer.',
    troublePairingExpireQ:'L’appairage SideStore ne fonctionne plus après une mise à jour ou réinitialisation iOS', troublePairingExpireA:'SideStore indique que les fichiers d’appairage peuvent expirer après une mise à jour ou réinitialisation, parfois de façon inattendue. Mettez iloader à jour, supprimez l’ancien appairage, réappairez et faites confiance à l’appareil, placez le nouveau fichier pour SideStore, reconnectez LocalDevVPN et actualisez.',
    troubleInvalidIpaQ:'Erreur SideStore 1005 / 1007 — app introuvable ou IPA invalide', troubleInvalidIpaA:'L’erreur 1005 signifie que SideStore n’a pas trouvé le fichier de l’app à l’URL indiquée. L’erreur 1007 signifie que le fichier téléchargé n’est pas une IPA standard. Retéléchargez depuis la source d’origine ou essayez une autre source vérifiée.',
communityChip:'iOS 27 / Shortcut',communityLabel:'SOLUTION COMMUNAUTAIRE', communityShortcutQ:'iOS 27 : le Shortcut d’actualisation ne fonctionne pas de façon fiable', communityShortcutA:'Les retours de la communauté conseillent d’abord de vérifier que Refresh All fonctionne manuellement. Dans le Shortcut, gardez Refresh All Apps comme dernière action d’actualisation, ne désactivez pas LocalDevVPN trop tôt et, si une app refuse encore de s’actualiser, faites un appui long sur l’app dans SideStore puis choisissez Resign. Ce sont des solutions communautaires, pas des exigences officielles SideStore.', communityVpnQ:'LocalDevVPN est connecté mais l’actualisation échoue encore sous iOS 27', communityVpnA:'Un workaround communautaire signalé sur Reddit consiste à régler Tunnel IP sur 10.7.0.2/30 et Device IP sur 10.7.0.1/32 dans LocalDevVPN. Ce n’est pas un correctif officiel SideStore et cela ne fonctionne pas sur tous les appareils ; essayez-le seulement après les vérifications officielles Wi-Fi, LocalDevVPN, pairing et bloqueurs DNS.',troubleNightlyQ:'SideStore nightly est instable ou a soudainement cessé de fonctionner', troubleNightlyA:'Le dépannage officiel SideStore indique que les builds nightly peuvent contenir des changements récents instables. Si le problème n’apparaît que sur nightly, revenez d’abord à la dernière version stable.',
    troubleSideInstallerInstallQ:'SideInstaller ne peut pas installer SideStore', troubleSideInstallerInstallA:'Utilisez la version officielle actuelle de SideInstaller et vérifiez d’abord la version exacte d’iOS. Sous iOS 27 la configuration peut se faire sur l’appareil ; iOS 17–26 nécessite un fichier d’appairage existant. Pour HTTP 503 ou des certificats révoqués, consultez d’abord les notes de version.',
    troubleFeatherQ:'Feather ne peut pas installer une app ou vérifier son intégrité', troubleFeatherA:'Vérifiez d’abord la paire de certificats. Feather cite comme causes fréquentes un certificat révoqué ou expiré, un certificat sans l’UDID de l’appareil et une IPA endommagée. Avec la méthode idevice, vérifiez aussi le fichier d’appairage, LocalDevVPN et un Heartbeat vert.',
    troubleFlareQ:'FlareStore signe l’IPA mais la demande d’installation échoue', troubleFlareA:'Vérifiez qu’un certificat de signature est importé dans FlareStore. Si la demande d’installation n’apparaît pas ou qu’une erreur de résolution de domaine survient, autorisez *.flarestore.vip et localhost.flarestore.vip dans le VPN, DNS ou bloqueur.',
    troubleSideloadlyQ:'Sideloadly échoue avec Anisette, provisioning ou signature', troubleSideloadlyA:'Commencez par le message exact dans la FAQ officielle Sideloadly. Les erreurs Remote Anisette peuvent nécessiter de réessayer plus tard ou de changer de mode ; chemin IPA, profil de provisioning et identité de signature ont des vérifications séparées.',
    communitySideloadlyMacQ:'macOS 27 : Sideloadly affiche Anisette failed: No OTP', communitySideloadlyMacA:'Un workaround communautaire récent consiste à passer Advanced Options → Anisette Authentication de Local à Remote. C’est une solution communautaire pour le comportement actuel de macOS 27, pas une exigence officielle ; vérifiez d’abord la FAQ et les nouvelles versions.',
    troubleAtvloadlyQ:'atvloadly ne trouve pas Apple TV ou ne peut pas installer', troubleAtvloadlyA:'Utilisez la FAQ officielle atvloadly. Désactivez le VPN, redémarrez Apple TV, relancez le mode d’appairage et vérifiez mDNS/Avahi. Docker peut nécessiter le mode privilégié. Après une mise à jour tvOS, un nouvel appairage peut être nécessaire.',
    troubleImpactorQ:'Impactor ne détecte pas l’appareil ou la vérification d’installation échoue', troubleImpactorA:'Sous Windows, vérifiez les pilotes Apple fournis par iTunes. Sous Linux, vérifiez usbmuxd, connectez l’appareil puis redémarrez Impactor. Le fichier d’appairage nécessite USB. Pour 0xe8008018, vérifiez aussi l’heure correcte et reconnectez-vous.',
    troubleTrollInstallQ:'TrollStore ne peut pas installer une IPA ou affiche erreur 175 / ldid', troubleTrollInstallA:'Vérifiez d’abord la compatibilité exacte d’iOS et mettez TrollStore à jour. L’erreur 175 est un échec de signature ldid et peut aussi venir d’un binaire IPA que TrollStore ne sait pas traiter. Utilisez le tracker officiel avec versions et journal si le problème persiste.',
    troublePalQ:'AltStore PAL ne s’installe pas, ne télécharge pas ou n’ajoute pas une Source', troublePalA:'Utilisez le dépannage officiel AltStore PAL. Vérifiez région et version iOS, installez le marketplace via Safari, désactivez le VPN en cas de NSURLError et mettez AltStore PAL à jour si une Source indique que la version installée n’est pas prise en charge.',
reportHelpTitle:'Toujours en panne ?', reportHelpDesc:'Ouvrez un rapport GitHub prérempli avec le problème sélectionné.', reportHelpButton:'Signaler ce problème ↗'
  }
};

const HELP_COPY = {
  en: {
    pageEyebrow:'HELP CENTER · GUIDES · FIXES', pageTitle:'Sideloading Help Center', pageDesc:'Choose the right sideloading method, diagnose a problem or describe your setup and get a focused path in a few taps.',
    centerEyebrow:'IOS HUB HELP CENTER', centerTitle:'How can we help?', centerDesc:'Start with one of the three paths below. You can change direction at any time without losing the rest of the guide.', toolScopeEyebrow:'FOCUSED HELP', toolScopeTitle:'Help with a selected installer', toolScopeDesc:'Already know which installer you use? Select it for focused help. If not, leave Help me choose selected and iOS Hub will guide you.', toolScopeAll:'Help me choose',
    modeChooseTitle:'Choose a method', modeChooseDesc:'Tell us what you want to do', modeFixTitle:'Fix a problem', modeFixDesc:'Search by symptom or error', modeSetupTitle:'My setup', modeSetupDesc:'Build a recommendation from your device',
    chooseTitle:'What do you want to do?', chooseDesc:'Pick the closest goal. We will show a practical starting point and the next three steps.',
    fixTitle:'What is not working?', fixDesc:'Paste part of an error message or pick a common problem. We will narrow the troubleshooting list below.', fixPlaceholder:'Paste an error: 503, pairing, certificate, refresh…',
    fixRefresh:'Refresh', fixLogin:'Apple ID / 503', fixPairing:'Pairing', fixCertificate:'Certificate', fixLimits:'App limits', fixLiveContainer:'LiveContainer', fixAltServer:'AltServer', fixReady:'Choose a problem or paste an error above.', fixPrivacy:'Everything here is processed locally in your browser.', fixShow:'Show matching fixes ↓', fixCount:'Found {n} matching fixes.',
    setupTitle:'Tell us about your setup', setupDesc:'Four quick choices are enough. The result stays on this page and does not send device information anywhere.', setupDevice:'Device', deviceIphone:'iPhone / iPad', deviceTv:'Apple TV', setupVersion:'System version', versionOlder:'Older / supported legacy', versionUnknown:'Not sure', setupComputer:'Computer access', computerNone:'I want no PC', computerSetup:'PC only for setup', computerAvailable:'PC is fine', setupNeed:'Main goal', needIpa:'Install my own IPA', needMany:'Run many apps', needMarketplace:'Alternative marketplace', needPermanent:'Permanent install', setupResultLabel:'YOUR PATH', setupReset:'Start over',
    diagnosisLabel:'LIKELY MATCH', diagnosisNext:'What to do now', diagnosisShowAll:'Show full troubleshooting ↓', diagnosisCopy:'Copy help link', diagnosisCopied:'Link copied', sourceOfficial:'OFFICIAL DOCS', sourceCommunity:'COMMUNITY WORKAROUND', diagnosisOfficialNote:'Based on the official troubleshooting documentation.', diagnosisCommunityNote:'Community workaround — try the official checks first.',triedTitle:'What have you already tried?', triedDesc:'Mark completed checks. The next recommendation will avoid repeating them when possible.', triedReset:'Clear', triedWifi:'Wi-Fi checked', triedVpn:'LocalDevVPN reconnected', triedRestart:'Restarted apps / device', triedPairing:'New pairing file', triedStable:'Tried stable build', triedLogin:'Signed in again', triedCertificate:'Certificate re-imported', triedResign:'Tried Resign / Refresh All', diagnosisDidntHelp:'This did not help →', diagnosisNoMore:'No other matching fix',officialSources:'Official docs used',jumpLabel:'Jump to:', jumpBasics:'Basics', jumpMethods:'Installation methods', jumpSources:'Source installers', jumpCompatibility:'Compatibility', jumpTroubleshooting:'Troubleshooting'
  },
  cs: {
    pageEyebrow:'CENTRUM POMOCI · NÁVODY · ŘEŠENÍ', pageTitle:'Centrum pomoci se sideloadingem', pageDesc:'Vyber správnou metodu, najdi příčinu problému nebo popiš svoji konfiguraci a během pár klepnutí dostaneš konkrétní postup.',
    centerEyebrow:'IOS HUB CENTRUM POMOCI', centerTitle:'S čím potřebuješ pomoct?', centerDesc:'Začni jednou ze tří cest níže. Kdykoliv můžeš přepnout jinam a zbytek průvodce zůstane dostupný.', toolScopeEyebrow:'ZAMĚŘENÁ POMOC', toolScopeTitle:'Pomoc s vybraným instalátorem', toolScopeDesc:'Víš, který instalátor používáš? Vyber ho pro cílenou pomoc. Pokud ne, nech Pomoz mi vybrat a iOS Hub tě provede výběrem.', toolScopeAll:'Pomoz mi vybrat',
    modeChooseTitle:'Vybrat metodu', modeChooseDesc:'Řekni, co chceš udělat', modeFixTitle:'Vyřešit problém', modeFixDesc:'Hledej podle chyby nebo příznaku', modeSetupTitle:'Moje konfigurace', modeSetupDesc:'Doporučení podle tvého zařízení',
    chooseTitle:'Co chceš udělat?', chooseDesc:'Vyber nejbližší cíl. Ukážeme ti praktický začátek a tři další kroky.',
    fixTitle:'Co nefunguje?', fixDesc:'Vlož část chybové hlášky nebo vyber častý problém. Zúžíme seznam řešení níže.', fixPlaceholder:'Vlož chybu: 503, pairing, certificate, refresh…',
    fixRefresh:'Refresh', fixLogin:'Apple ID / 503', fixPairing:'Pairing', fixCertificate:'Certifikát', fixLimits:'Limity aplikací', fixLiveContainer:'LiveContainer', fixAltServer:'AltServer', fixReady:'Vyber problém nebo vlož chybu výše.', fixPrivacy:'Vše se zpracovává jen lokálně v prohlížeči.', fixShow:'Ukázat odpovídající řešení ↓', fixCount:'Nalezeno odpovídajících řešení: {n}.',
    setupTitle:'Popiš svoji konfiguraci', setupDesc:'Stačí čtyři rychlé volby. Výsledek zůstává na této stránce a informace o zařízení se nikam neposílají.', setupDevice:'Zařízení', deviceIphone:'iPhone / iPad', deviceTv:'Apple TV', setupVersion:'Verze systému', versionOlder:'Starší / podporovaný legacy', versionUnknown:'Nevím', setupComputer:'Přístup k počítači', computerNone:'Nechci PC', computerSetup:'PC jen pro nastavení', computerAvailable:'PC mi nevadí', setupNeed:'Hlavní cíl', needIpa:'Instalovat vlastní IPA', needMany:'Používat hodně aplikací', needMarketplace:'Alternativní marketplace', needPermanent:'Trvalá instalace', setupResultLabel:'TVÁ CESTA', setupReset:'Začít znovu',
    diagnosisLabel:'PRAVDĚPODOBNÁ SHODA', diagnosisNext:'Co udělat teď', diagnosisShowAll:'Zobrazit celé řešení problémů ↓', diagnosisCopy:'Kopírovat odkaz na pomoc', diagnosisCopied:'Odkaz zkopírován', sourceOfficial:'OFICIÁLNÍ DOKUMENTACE', sourceCommunity:'KOMUNITNÍ ŘEŠENÍ', diagnosisOfficialNote:'Vychází z oficiální dokumentace řešení problémů.', diagnosisCommunityNote:'Komunitní workaround — nejdřív vyzkoušej oficiální postup.',triedTitle:'Co už jsi vyzkoušel?', triedDesc:'Označ hotové kontroly. Další doporučení se je pokusí neopakovat.', triedReset:'Vymazat', triedWifi:'Wi-Fi zkontrolována', triedVpn:'LocalDevVPN znovu připojena', triedRestart:'Restart aplikací / zařízení', triedPairing:'Nový pairing soubor', triedStable:'Vyzkoušen stable build', triedLogin:'Znovu přihlášeno', triedCertificate:'Certifikát znovu importován', triedResign:'Vyzkoušen Resign / Refresh All', diagnosisDidntHelp:'Tohle nepomohlo →', diagnosisNoMore:'Žádné další odpovídající řešení',officialSources:'Použité oficiální návody',jumpLabel:'Přejít na:', jumpBasics:'Základy', jumpMethods:'Instalační metody', jumpSources:'Source instalátory', jumpCompatibility:'Kompatibilita', jumpTroubleshooting:'Řešení problémů'
  },
  de: {
    pageEyebrow:'HILFECENTER · ANLEITUNGEN · LÖSUNGEN', pageTitle:'Sideloading-Hilfecenter', pageDesc:'Wähle die passende Methode, diagnostiziere ein Problem oder beschreibe dein Setup und erhalte mit wenigen Klicks einen gezielten Weg.',
    centerEyebrow:'IOS HUB HILFECENTER', centerTitle:'Wobei können wir helfen?', centerDesc:'Starte mit einem der drei Wege. Du kannst jederzeit wechseln, ohne den restlichen Guide zu verlieren.', toolScopeEyebrow:'GEZIELTE HILFE', toolScopeTitle:'Hilfe für einen ausgewählten Installer', toolScopeDesc:'Wenn du deinen Installer kennst, wähle ihn für gezielte Hilfe. Sonst lass Hilf mir wählen ausgewählt und iOS Hub führt dich durch die Auswahl.', toolScopeAll:'Hilf mir wählen',
    modeChooseTitle:'Methode wählen', modeChooseDesc:'Sag uns, was du tun möchtest', modeFixTitle:'Problem beheben', modeFixDesc:'Nach Symptom oder Fehler suchen', modeSetupTitle:'Mein Setup', modeSetupDesc:'Empfehlung anhand deines Geräts',
    chooseTitle:'Was möchtest du tun?', chooseDesc:'Wähle das passendste Ziel. Wir zeigen einen praktischen Startpunkt und die nächsten drei Schritte.',
    fixTitle:'Was funktioniert nicht?', fixDesc:'Füge einen Teil der Fehlermeldung ein oder wähle ein häufiges Problem. Wir grenzen die Lösungen unten ein.', fixPlaceholder:'Fehler einfügen: 503, Pairing, Zertifikat, Refresh…',
    fixRefresh:'Refresh', fixLogin:'Apple ID / 503', fixPairing:'Pairing', fixCertificate:'Zertifikat', fixLimits:'App-Limits', fixLiveContainer:'LiveContainer', fixAltServer:'AltServer', fixReady:'Wähle ein Problem oder füge oben einen Fehler ein.', fixPrivacy:'Alles wird lokal im Browser verarbeitet.', fixShow:'Passende Lösungen anzeigen ↓', fixCount:'{n} passende Lösungen gefunden.',
    setupTitle:'Beschreibe dein Setup', setupDesc:'Vier kurze Entscheidungen reichen. Das Ergebnis bleibt auf dieser Seite und sendet keine Gerätedaten.', setupDevice:'Gerät', deviceIphone:'iPhone / iPad', deviceTv:'Apple TV', setupVersion:'Systemversion', versionOlder:'Älter / unterstütztes Legacy', versionUnknown:'Nicht sicher', setupComputer:'Computerzugang', computerNone:'Ich will keinen PC', computerSetup:'PC nur fürs Setup', computerAvailable:'PC ist okay', setupNeed:'Hauptziel', needIpa:'Eigene IPA installieren', needMany:'Viele Apps ausführen', needMarketplace:'Alternativer Marketplace', needPermanent:'Dauerhafte Installation', setupResultLabel:'DEIN WEG', setupReset:'Neu starten',
    diagnosisLabel:'WAHRSCHEINLICHER TREFFER', diagnosisNext:'Was du jetzt tun solltest', diagnosisShowAll:'Komplette Fehlerbehebung anzeigen ↓', diagnosisCopy:'Hilfelink kopieren', diagnosisCopied:'Link kopiert', sourceOfficial:'OFFIZIELLE DOKU', sourceCommunity:'COMMUNITY-WORKAROUND', diagnosisOfficialNote:'Basiert auf der offiziellen Fehlerbehebungs-Dokumentation.', diagnosisCommunityNote:'Community-Workaround — zuerst die offiziellen Prüfungen durchführen.',triedTitle:'Was hast du bereits ausprobiert?', triedDesc:'Markiere erledigte Prüfungen. Die nächste Empfehlung versucht Wiederholungen zu vermeiden.', triedReset:'Leeren', triedWifi:'Wi-Fi geprüft', triedVpn:'LocalDevVPN neu verbunden', triedRestart:'Apps / Gerät neu gestartet', triedPairing:'Neue Pairing-Datei', triedStable:'Stable-Build getestet', triedLogin:'Erneut angemeldet', triedCertificate:'Zertifikat neu importiert', triedResign:'Resign / Refresh All getestet', diagnosisDidntHelp:'Das hat nicht geholfen →', diagnosisNoMore:'Keine weitere passende Lösung',officialSources:'Verwendete offizielle Doku',jumpLabel:'Springen zu:', jumpBasics:'Grundlagen', jumpMethods:'Installationsmethoden', jumpSources:'Source-Installer', jumpCompatibility:'Kompatibilität', jumpTroubleshooting:'Fehlerbehebung'
  },
  es: {
    pageEyebrow:'CENTRO DE AYUDA · GUÍAS · SOLUCIONES', pageTitle:'Centro de ayuda de sideloading', pageDesc:'Elige el método adecuado, diagnostica un problema o describe tu configuración y obtén una ruta concreta en pocos toques.',
    centerEyebrow:'CENTRO DE AYUDA IOS HUB', centerTitle:'¿En qué podemos ayudarte?', centerDesc:'Empieza con una de las tres rutas. Puedes cambiar en cualquier momento sin perder el resto de la guía.', toolScopeEyebrow:'AYUDA ENFOCADA', toolScopeTitle:'Ayuda con un instalador seleccionado', toolScopeDesc:'Si ya sabes qué instalador usas, selecciónalo para obtener ayuda específica. Si no, deja Ayúdame a elegir y iOS Hub te guiará.', toolScopeAll:'Ayúdame a elegir',
    modeChooseTitle:'Elegir método', modeChooseDesc:'Dinos qué quieres hacer', modeFixTitle:'Resolver un problema', modeFixDesc:'Buscar por síntoma o error', modeSetupTitle:'Mi configuración', modeSetupDesc:'Recomendación según tu dispositivo',
    chooseTitle:'¿Qué quieres hacer?', chooseDesc:'Elige el objetivo más cercano. Mostraremos un punto de partida práctico y los tres pasos siguientes.',
    fixTitle:'¿Qué no funciona?', fixDesc:'Pega parte del mensaje de error o elige un problema común. Reduciremos la lista de soluciones de abajo.', fixPlaceholder:'Pega un error: 503, pairing, certificado, refresh…',
    fixRefresh:'Refresh', fixLogin:'Apple ID / 503', fixPairing:'Pairing', fixCertificate:'Certificado', fixLimits:'Límites de apps', fixLiveContainer:'LiveContainer', fixAltServer:'AltServer', fixReady:'Elige un problema o pega un error arriba.', fixPrivacy:'Todo se procesa localmente en tu navegador.', fixShow:'Mostrar soluciones coincidentes ↓', fixCount:'Se encontraron {n} soluciones.',
    setupTitle:'Describe tu configuración', setupDesc:'Cuatro elecciones rápidas son suficientes. El resultado permanece en esta página y no envía datos del dispositivo.', setupDevice:'Dispositivo', deviceIphone:'iPhone / iPad', deviceTv:'Apple TV', setupVersion:'Versión del sistema', versionOlder:'Anterior / legacy compatible', versionUnknown:'No estoy seguro', setupComputer:'Acceso a ordenador', computerNone:'No quiero PC', computerSetup:'PC solo para configurar', computerAvailable:'PC está bien', setupNeed:'Objetivo principal', needIpa:'Instalar mi propia IPA', needMany:'Usar muchas apps', needMarketplace:'Marketplace alternativo', needPermanent:'Instalación permanente', setupResultLabel:'TU RUTA', setupReset:'Empezar de nuevo',
    diagnosisLabel:'COINCIDENCIA PROBABLE', diagnosisNext:'Qué hacer ahora', diagnosisShowAll:'Mostrar toda la solución de problemas ↓', diagnosisCopy:'Copiar enlace de ayuda', diagnosisCopied:'Enlace copiado', sourceOfficial:'DOCUMENTACIÓN OFICIAL', sourceCommunity:'SOLUCIÓN DE LA COMUNIDAD', diagnosisOfficialNote:'Basado en la documentación oficial de solución de problemas.', diagnosisCommunityNote:'Solución de la comunidad — prueba primero las comprobaciones oficiales.',triedTitle:'¿Qué has probado ya?', triedDesc:'Marca las comprobaciones realizadas. La siguiente recomendación intentará no repetirlas.', triedReset:'Borrar', triedWifi:'Wi-Fi comprobada', triedVpn:'LocalDevVPN reconectado', triedRestart:'Apps / dispositivo reiniciados', triedPairing:'Nuevo archivo de pairing', triedStable:'Probada versión estable', triedLogin:'Sesión iniciada de nuevo', triedCertificate:'Certificado reimportado', triedResign:'Probado Resign / Refresh All', diagnosisDidntHelp:'Esto no ayudó →', diagnosisNoMore:'No hay otra solución coincidente',officialSources:'Documentación oficial usada',jumpLabel:'Ir a:', jumpBasics:'Conceptos básicos', jumpMethods:'Métodos de instalación', jumpSources:'Instaladores de Sources', jumpCompatibility:'Compatibilidad', jumpTroubleshooting:'Solución de problemas'
  },
  fr: {
    pageEyebrow:'CENTRE D’AIDE · GUIDES · SOLUTIONS', pageTitle:'Centre d’aide au sideloading', pageDesc:'Choisissez la bonne méthode, diagnostiquez un problème ou décrivez votre configuration et obtenez un parcours ciblé en quelques gestes.',
    centerEyebrow:'CENTRE D’AIDE IOS HUB', centerTitle:'Comment pouvons-nous vous aider ?', centerDesc:'Commencez par l’un des trois parcours. Vous pouvez changer à tout moment sans perdre le reste du guide.', toolScopeEyebrow:'AIDE CIBLÉE', toolScopeTitle:'Aide pour un installateur sélectionné', toolScopeDesc:'Si vous connaissez votre installateur, sélectionnez-le pour une aide ciblée. Sinon, laissez Aidez-moi à choisir et iOS Hub vous guidera.', toolScopeAll:'Aidez-moi à choisir',
    modeChooseTitle:'Choisir une méthode', modeChooseDesc:'Dites ce que vous voulez faire', modeFixTitle:'Résoudre un problème', modeFixDesc:'Rechercher par symptôme ou erreur', modeSetupTitle:'Ma configuration', modeSetupDesc:'Recommandation selon votre appareil',
    chooseTitle:'Que voulez-vous faire ?', chooseDesc:'Choisissez l’objectif le plus proche. Nous afficherons un point de départ pratique et les trois étapes suivantes.',
    fixTitle:'Qu’est-ce qui ne fonctionne pas ?', fixDesc:'Collez une partie du message d’erreur ou choisissez un problème courant. Nous réduirons la liste des solutions ci-dessous.', fixPlaceholder:'Collez une erreur : 503, pairing, certificat, refresh…',
    fixRefresh:'Refresh', fixLogin:'Apple ID / 503', fixPairing:'Pairing', fixCertificate:'Certificat', fixLimits:'Limites d’apps', fixLiveContainer:'LiveContainer', fixAltServer:'AltServer', fixReady:'Choisissez un problème ou collez une erreur ci-dessus.', fixPrivacy:'Tout est traité localement dans votre navigateur.', fixShow:'Afficher les solutions correspondantes ↓', fixCount:'{n} solutions correspondantes trouvées.',
    setupTitle:'Décrivez votre configuration', setupDesc:'Quatre choix rapides suffisent. Le résultat reste sur cette page et n’envoie aucune donnée sur l’appareil.', setupDevice:'Appareil', deviceIphone:'iPhone / iPad', deviceTv:'Apple TV', setupVersion:'Version du système', versionOlder:'Ancien / legacy compatible', versionUnknown:'Je ne sais pas', setupComputer:'Accès à un ordinateur', computerNone:'Je ne veux pas de PC', computerSetup:'PC seulement pour configurer', computerAvailable:'Un PC me convient', setupNeed:'Objectif principal', needIpa:'Installer mes propres IPA', needMany:'Utiliser beaucoup d’apps', needMarketplace:'Marketplace alternatif', needPermanent:'Installation permanente', setupResultLabel:'VOTRE PARCOURS', setupReset:'Recommencer',
    diagnosisLabel:'CORRESPONDANCE PROBABLE', diagnosisNext:'Que faire maintenant', diagnosisShowAll:'Afficher tout le dépannage ↓', diagnosisCopy:'Copier le lien d’aide', diagnosisCopied:'Lien copié', sourceOfficial:'DOCUMENTATION OFFICIELLE', sourceCommunity:'SOLUTION COMMUNAUTAIRE', diagnosisOfficialNote:'Basé sur la documentation officielle de dépannage.', diagnosisCommunityNote:'Solution communautaire — essayez d’abord les vérifications officielles.',triedTitle:'Qu’avez-vous déjà essayé ?', triedDesc:'Cochez les vérifications effectuées. La recommandation suivante essaiera de ne pas les répéter.', triedReset:'Effacer', triedWifi:'Wi-Fi vérifié', triedVpn:'LocalDevVPN reconnecté', triedRestart:'Apps / appareil redémarrés', triedPairing:'Nouveau fichier pairing', triedStable:'Build stable essayé', triedLogin:'Reconnecté au compte', triedCertificate:'Certificat réimporté', triedResign:'Resign / Refresh All essayé', diagnosisDidntHelp:'Cela n’a pas aidé →', diagnosisNoMore:'Aucune autre solution correspondante',officialSources:'Documentation officielle utilisée',jumpLabel:'Aller à :', jumpBasics:'Bases', jumpMethods:'Méthodes d’installation', jumpSources:'Installateurs de Sources', jumpCompatibility:'Compatibilité', jumpTroubleshooting:'Dépannage'
  }
};

const SETUP_RESULTS = {
  en: {
    tv:{title:'Apple TV: Sideloadly or atvloadly',text:'For Apple TV, use Sideloadly from Windows/macOS or atvloadly when you want a self-hosted Linux/OpenWrt workflow.',steps:['Choose desktop or self-hosted.','Pair the Apple TV.','Install and refresh through that tool.'],primary:'Open Sideloadly ↗',secondary:'atvloadly ↗'},
    marketplace:{title:'AltStore PAL — supported region + iOS 18+',text:'AltStore PAL currently requires iOS/iPadOS 18.0 or later, physical presence in the European Union, Japan or Brazil, and an App Store account from the same supported region. It needs no computer and marketplace apps do not use the normal 7-day refresh cycle.',steps:['Confirm iOS/iPadOS 18.0+ in Settings → General → About.','Confirm you are physically in the EU, Japan or Brazil and signed into a matching App Store account.','Install AltStore PAL from the official download page.'],primary:'Open AltStore PAL download ↗',secondary:'AltStore Classic ↗'},
    marketplaceCheck:{title:'Check the exact iOS version before AltStore PAL',text:'Your selected range includes both unsupported and supported versions. AltStore PAL currently requires iOS/iPadOS 18.0+ plus a supported region and matching App Store account.',steps:['Check the exact iOS/iPadOS version.','If you are on iOS/iPadOS 18.0+, check the EU/Japan/Brazil regional requirements.','If you are on iOS/iPadOS 17, use AltStore Classic or another sideloading path instead.'],primary:'Check AltStore PAL requirements ↗',secondary:'AltStore Classic ↗'},
    marketplaceUnsupported:{title:'AltStore PAL requires iOS/iPadOS 18.0+',text:'The selected legacy system range does not meet AltStore PAL’s current iOS/iPadOS 18.0+ requirement. Use AltStore Classic or another compatible sideloading method instead.',steps:['Check the exact system version.','Use AltStore Classic if you specifically want AltStore.','Otherwise choose another sideloading goal in this wizard.'],primary:'Open AltStore Classic ↗',secondary:'AltStore PAL requirements ↗'},
    permanent:{title:'Check TrollStore compatibility first',text:'Permanent IPA installation is only available on specific supported iOS/iPadOS versions. Verify your exact version before doing anything else.',steps:['Check your exact OS version.','Compare it with the official TrollStore support list.','If unsupported, use SideStore, LiveContainer or Sideloadly instead.'],primary:'Open TrollStore ↗'},
    sideinstaller:{title:'iOS 27 without a PC: SideInstaller → SideStore',text:'On iOS/iPadOS 27, SideInstaller can perform the initial SideStore setup directly on-device. SideStore then handles normal installs and refreshes.',steps:['Use only the official SideInstaller source.','Install SideStore on-device.','Enable LocalDevVPN when installing or refreshing.'],primary:'Open SideInstaller ↗',secondary:'SideStore docs ↗'},
    sideinstallerMany:{title:'iOS 27 without a PC: SideInstaller → LiveContainer + SideStore',text:'For many guest apps with no PC on iOS 27, use the combined LiveContainer + SideStore route installed through SideInstaller.',steps:['Install the combined LC+SS build.','Confirm the signing certificate and LocalDevVPN.','Refresh SideStore/container; run guest apps in LiveContainer.'],primary:'Open SideInstaller ↗',secondary:'LC+SS guide ↗'},
    livecontainer:{title:'LiveContainer + SideStore',text:'For many IPA apps, LiveContainer keeps guest apps inside one container while SideStore handles signing and refresh.',steps:['Install LC+SS with a supported setup method.','Import the signing certificate correctly.','Keep Wi-Fi and LocalDevVPN ready for refresh.'],primary:'Open LC+SS guide ↗',secondary:'Troubleshooting ↓',secondaryUrl:'#troubleshooting'},
    sideloadly:{title:'Sideloadly',text:'If using a computer is fine, Sideloadly is the most direct desktop workflow for installing your own IPA files.',steps:['Install Sideloadly on Windows or macOS.','Connect and trust the device.','Use Wi-Fi/USB re-signing when needed.'],primary:'Open Sideloadly ↗'},
    pairingNeeded:{title:'iOS 17–26 without a PC: pairing file required',text:'SideInstaller v1 partially supports iOS 17–26, but only when you already have a pairing file created with a computer. If you do not have one yet, you need access to a computer once.',steps:['Check whether you already have a valid pairing file.','If not, create one with iloader on a computer.','Then use SideInstaller or SideStore with that pairing data.'],primary:'SideInstaller v1 release ↗',url:'https://github.com/FrizzleM/SideInstaller/releases/tag/v1.0.0',secondary:'SideStore pairing guide ↗'},
    checkVersionNoPc:{title:'Check your iOS version first',text:'The no-PC path depends on the exact system version. On iOS 27, SideInstaller works fully on-device. On iOS 17–26, SideInstaller v1 works only when an existing pairing file is available.',steps:['Open Settings → General → About.','Check the exact iOS/iPadOS version.','Choose iOS 27 or iOS 17–26 in this wizard.'],primary:'Návod k instalaci SideStore ↗'},
    sidestore:{title:'SideStore after one-time setup',text:'If you only want the computer for initial setup, SideStore is a strong fit. On older versions without an existing pairing file, first setup still needs pairing data from a computer.',steps:['Complete the initial pairing/setup.','Enable LocalDevVPN on the device.','Install and refresh from SideStore afterwards.'],primary:'Open SideStore docs ↗',secondary:'Troubleshooting ↓',secondaryUrl:'#troubleshooting'}
  },
  cs: {
    tv:{title:'Apple TV: Sideloadly nebo atvloadly',text:'Pro Apple TV použij Sideloadly z Windows/macOS nebo atvloadly, pokud chceš vlastní službu na Linuxu/OpenWrt.',steps:['Vyber desktop nebo self-hosted cestu.','Spáruj Apple TV.','Instaluj a obnovuj přes zvolený nástroj.'],primary:'Otevřít Sideloadly ↗',secondary:'atvloadly ↗'},
    marketplace:{title:'AltStore PAL — podporovaný region + iOS 18+',text:'AltStore PAL aktuálně vyžaduje iOS/iPadOS 18.0 nebo novější, fyzickou přítomnost v EU, Japonsku nebo Brazílii a App Store účet ze stejného podporovaného regionu. Počítač nepotřebuje a marketplace aplikace nemají běžný 7denní refresh.',steps:['Ověř iOS/iPadOS 18.0+ v Nastavení → Obecné → Informace.','Ověř, že jsi fyzicky v EU, Japonsku nebo Brazílii a používáš odpovídající App Store účet.','Nainstaluj AltStore PAL z oficiální stránky.'],primary:'Otevřít AltStore PAL ↗',secondary:'AltStore Classic ↗'},
    marketplaceCheck:{title:'Před AltStore PAL ověř přesnou verzi iOS',text:'Vybraný rozsah obsahuje podporované i nepodporované verze. AltStore PAL aktuálně vyžaduje iOS/iPadOS 18.0+ a zároveň podporovaný region s odpovídajícím App Store účtem.',steps:['Zjisti přesnou verzi iOS/iPadOS.','Na iOS/iPadOS 18.0+ ověř podmínky pro EU/Japonsko/Brazílii.','Na iOS/iPadOS 17 použij AltStore Classic nebo jinou cestu sideloadingu.'],primary:'Požadavky AltStore PAL ↗',secondary:'AltStore Classic ↗'},
    marketplaceUnsupported:{title:'AltStore PAL vyžaduje iOS/iPadOS 18.0+',text:'Vybraný starší systém nesplňuje aktuální požadavek AltStore PAL na iOS/iPadOS 18.0+. Použij AltStore Classic nebo jinou kompatibilní metodu sideloadingu.',steps:['Ověř přesnou verzi systému.','Pokud chceš AltStore, použij AltStore Classic.','Jinak v průvodci zvol jiný cíl.'],primary:'Otevřít AltStore Classic ↗',secondary:'Požadavky AltStore PAL ↗'},
    permanent:{title:'Nejdřív ověř kompatibilitu TrollStore',text:'Trvalá instalace IPA funguje jen na konkrétních podporovaných verzích iOS/iPadOS. Nejdřív ověř přesnou verzi systému.',steps:['Zjisti přesnou verzi systému.','Porovnej ji s oficiální podporou TrollStore.','Pokud podporovaná není, použij SideStore, LiveContainer nebo Sideloadly.'],primary:'Otevřít TrollStore ↗'},
    sideinstaller:{title:'iOS 27 bez PC: SideInstaller → SideStore',text:'Na iOS/iPadOS 27 umí SideInstaller provést první instalaci SideStore přímo v zařízení. SideStore pak řeší běžné instalace a obnovování.',steps:['Použij jen oficiální SideInstaller.','Nainstaluj SideStore přímo v zařízení.','Při instalaci a refreshi zapni LocalDevVPN.'],primary:'Otevřít SideInstaller ↗',secondary:'SideStore návod ↗'},
    sideinstallerMany:{title:'iOS 27 bez PC: SideInstaller → LiveContainer + SideStore',text:'Pro hodně hostovaných aplikací bez PC na iOS 27 použij společnou variantu LiveContainer + SideStore nainstalovanou přes SideInstaller.',steps:['Nainstaluj společný LC+SS build.','Ověř podpisový certifikát a LocalDevVPN.','Obnovuj SideStore/kontejner a hostované aplikace spouštěj v LiveContaineru.'],primary:'Otevřít SideInstaller ↗',secondary:'LC+SS návod ↗'},
    livecontainer:{title:'LiveContainer + SideStore',text:'Pro hodně IPA aplikací drží LiveContainer hostované aplikace v jednom kontejneru a SideStore řeší podpis a refresh.',steps:['Nainstaluj LC+SS podporovanou metodou.','Správně importuj podpisový certifikát.','Pro refresh měj připravenou Wi-Fi a LocalDevVPN.'],primary:'Otevřít LC+SS návod ↗',secondary:'Řešení problémů ↓',secondaryUrl:'#troubleshooting'},
    sideloadly:{title:'Sideloadly',text:'Pokud ti nevadí používat počítač, Sideloadly je nejpřímější desktopová cesta pro instalaci vlastních IPA.',steps:['Nainstaluj Sideloadly ve Windows nebo macOS.','Připoj zařízení a potvrď důvěru.','Podle potřeby používej obnovování přes Wi-Fi/USB.'],primary:'Otevřít Sideloadly ↗'},
    pairingNeeded:{title:'iOS 17–26 bez PC: je potřeba pairing soubor',text:'SideInstaller v1 podporuje iOS 17–26 částečně, ale jen pokud už máš pairing soubor vytvořený pomocí počítače. Pokud ho ještě nemáš, potřebuješ jednorázově přístup k počítači.',steps:['Ověř, jestli už máš platný pairing soubor.','Pokud ne, vytvoř ho přes iloader na počítači.','Potom použij SideInstaller nebo SideStore s těmito pairing daty.'],primary:'Návod k instalaci SideStore ↗',url:'https://docs.sidestore.io/docs/installation/prerequisites',secondary:'Návod k pairingu SideStore ↗'},
    checkVersionNoPc:{title:'Nejdřív zjisti přesnou verzi iOS',text:'Cesta bez PC závisí na přesné verzi systému. Na iOS 27 funguje SideInstaller kompletně přímo v zařízení. Na iOS 17–26 funguje SideInstaller v1 jen s už existujícím pairing souborem.',steps:['Otevři Nastavení → Obecné → Informace.','Zjisti přesnou verzi iOS/iPadOS.','V průvodci pak vyber iOS 27 nebo iOS 17–26.'],primary:'Návod k instalaci SideStore ↗'},
    sidestore:{title:'SideStore po jednorázovém nastavení',text:'Pokud chceš počítač jen při prvním nastavení, SideStore je vhodná cesta. Na starších verzích bez existujícího pairing souboru stále potřebuješ pro první instalaci pairing data z počítače.',steps:['Dokonči první pairing a instalaci.','Zapni v zařízení LocalDevVPN.','Pak instaluj a obnovuj přímo ze SideStore.'],primary:'Otevřít SideStore návod ↗',secondary:'Řešení problémů ↓',secondaryUrl:'#troubleshooting'}
  },
  de: {
    tv:{title:'Apple TV: Sideloadly oder atvloadly',text:'Für Apple TV nutze Sideloadly unter Windows/macOS oder atvloadly für einen selbst gehosteten Linux/OpenWrt-Workflow.',steps:['Desktop oder Self-Hosted wählen.','Apple TV koppeln.','Über das gewählte Tool installieren und aktualisieren.'],primary:'Sideloadly öffnen ↗',secondary:'atvloadly ↗'},
    marketplace:{title:'AltStore PAL — unterstützte Region + iOS 18+',text:'AltStore PAL benötigt derzeit iOS/iPadOS 18.0 oder neuer, einen physischen Standort in der EU, Japan oder Brasilien und einen App-Store-Account aus derselben unterstützten Region. Ein Computer ist nicht nötig und Marketplace-Apps benötigen keinen normalen 7-Tage-Refresh.',steps:['iOS/iPadOS 18.0+ unter Einstellungen → Allgemein → Info prüfen.','Standort in EU/Japan/Brasilien und passenden App-Store-Account prüfen.','AltStore PAL von der offiziellen Download-Seite installieren.'],primary:'AltStore PAL öffnen ↗',secondary:'AltStore Classic ↗'},
    marketplaceCheck:{title:'Vor AltStore PAL die genaue iOS-Version prüfen',text:'Der gewählte Bereich enthält unterstützte und nicht unterstützte Versionen. AltStore PAL benötigt derzeit iOS/iPadOS 18.0+ sowie eine unterstützte Region mit passendem App-Store-Account.',steps:['Genaue iOS/iPadOS-Version prüfen.','Unter iOS/iPadOS 18.0+ die Anforderungen für EU/Japan/Brasilien prüfen.','Unter iOS/iPadOS 17 AltStore Classic oder einen anderen Sideloading-Weg verwenden.'],primary:'AltStore-PAL-Anforderungen ↗',secondary:'AltStore Classic ↗'},
    marketplaceUnsupported:{title:'AltStore PAL benötigt iOS/iPadOS 18.0+',text:'Der gewählte ältere Systembereich erfüllt die aktuelle iOS/iPadOS-18.0+-Anforderung von AltStore PAL nicht. Verwende AltStore Classic oder eine andere kompatible Sideloading-Methode.',steps:['Genaue Systemversion prüfen.','Für AltStore AltStore Classic verwenden.','Andernfalls im Assistenten ein anderes Ziel wählen.'],primary:'AltStore Classic öffnen ↗',secondary:'AltStore-PAL-Anforderungen ↗'},
    permanent:{title:'Zuerst TrollStore-Kompatibilität prüfen',text:'Dauerhafte IPA-Installation funktioniert nur auf bestimmten unterstützten iOS/iPadOS-Versionen. Prüfe zuerst deine genaue Version.',steps:['Genaue OS-Version prüfen.','Mit der offiziellen TrollStore-Liste vergleichen.','Falls nicht unterstützt, SideStore, LiveContainer oder Sideloadly verwenden.'],primary:'TrollStore öffnen ↗'},
    sideinstaller:{title:'iOS 27 ohne PC: SideInstaller → SideStore',text:'Unter iOS/iPadOS 27 kann SideInstaller die erste SideStore-Installation direkt auf dem Gerät durchführen. Danach übernimmt SideStore Installation und Refresh.',steps:['Nur den offiziellen SideInstaller verwenden.','SideStore direkt auf dem Gerät installieren.','Für Installation und Refresh LocalDevVPN aktivieren.'],primary:'SideInstaller öffnen ↗',secondary:'SideStore-Doku ↗'},
    sideinstallerMany:{title:'iOS 27 ohne PC: SideInstaller → LiveContainer + SideStore',text:'Für viele Gast-Apps ohne PC unter iOS 27 nutze die kombinierte LiveContainer + SideStore-Variante über SideInstaller.',steps:['Kombinierten LC+SS-Build installieren.','Signaturzertifikat und LocalDevVPN prüfen.','SideStore/Container aktualisieren und Gast-Apps in LiveContainer starten.'],primary:'SideInstaller öffnen ↗',secondary:'LC+SS-Doku ↗'},
    livecontainer:{title:'LiveContainer + SideStore',text:'Für viele IPA-Apps hält LiveContainer Gast-Apps in einem Container, während SideStore Signierung und Refresh übernimmt.',steps:['LC+SS mit einer unterstützten Methode installieren.','Signaturzertifikat korrekt importieren.','Wi-Fi und LocalDevVPN für Refresh bereithalten.'],primary:'LC+SS-Doku öffnen ↗',secondary:'Fehlerbehebung ↓',secondaryUrl:'#troubleshooting'},
    sideloadly:{title:'Sideloadly',text:'Wenn ein Computer okay ist, ist Sideloadly der direkteste Desktop-Weg für eigene IPA-Dateien.',steps:['Sideloadly unter Windows oder macOS installieren.','Gerät verbinden und vertrauen.','Bei Bedarf über Wi-Fi/USB neu signieren.'],primary:'Sideloadly öffnen ↗'},
    pairingNeeded:{title:'iOS 17–26 ohne PC: Pairing-Datei erforderlich',text:'SideInstaller v1 unterstützt iOS 17–26 teilweise, aber nur mit einer bereits auf einem Computer erstellten Pairing-Datei. Wenn noch keine vorhanden ist, brauchst du einmal Zugang zu einem Computer.',steps:['Prüfen, ob bereits eine gültige Pairing-Datei vorhanden ist.','Falls nicht, mit iloader auf einem Computer erstellen.','Danach SideInstaller oder SideStore mit diesen Pairing-Daten verwenden.'],primary:'SideInstaller v1 Release ↗',url:'https://docs.sidestore.io/docs/installation/prerequisites',secondary:'SideStore Pairing-Anleitung ↗'},
    checkVersionNoPc:{title:'Zuerst die genaue iOS-Version prüfen',text:'Der Weg ohne PC hängt von der genauen Systemversion ab. Unter iOS 27 funktioniert SideInstaller vollständig auf dem Gerät. Unter iOS 17–26 funktioniert SideInstaller v1 nur mit einer bereits vorhandenen Pairing-Datei.',steps:['Einstellungen → Allgemein → Info öffnen.','Genaue iOS/iPadOS-Version prüfen.','Danach im Assistenten iOS 27 oder iOS 17–26 auswählen.'],primary:'SideStore-Setup-Anleitung ↗'},
    sidestore:{title:'SideStore nach einmaligem Setup',text:'Wenn du den Computer nur für die Einrichtung verwenden möchtest, passt SideStore gut. Auf älteren Versionen ohne vorhandene Pairing-Datei werden für die erste Einrichtung weiterhin Pairing-Daten vom Computer benötigt.',steps:['Erstes Pairing/Setup abschließen.','LocalDevVPN auf dem Gerät aktivieren.','Danach direkt in SideStore installieren und aktualisieren.'],primary:'SideStore-Doku öffnen ↗',secondary:'Fehlerbehebung ↓',secondaryUrl:'#troubleshooting'}
  },
  es: {
    tv:{title:'Apple TV: Sideloadly o atvloadly',text:'Para Apple TV usa Sideloadly desde Windows/macOS o atvloadly si prefieres un flujo autoalojado en Linux/OpenWrt.',steps:['Elige escritorio o autoalojado.','Empareja el Apple TV.','Instala y renueva con la herramienta elegida.'],primary:'Abrir Sideloadly ↗',secondary:'atvloadly ↗'},
    marketplace:{title:'AltStore PAL — región compatible + iOS 18+',text:'AltStore PAL requiere actualmente iOS/iPadOS 18.0 o posterior, estar físicamente en la UE, Japón o Brasil y usar una cuenta de App Store de la misma región compatible. No necesita ordenador y las apps del marketplace no usan el ciclo normal de renovación de 7 días.',steps:['Comprueba iOS/iPadOS 18.0+ en Ajustes → General → Información.','Comprueba ubicación en UE/Japón/Brasil y una cuenta de App Store compatible.','Instala AltStore PAL desde la página oficial.'],primary:'Abrir AltStore PAL ↗',secondary:'AltStore Classic ↗'},
    marketplaceCheck:{title:'Comprueba la versión exacta de iOS antes de AltStore PAL',text:'El rango elegido contiene versiones compatibles y no compatibles. AltStore PAL requiere actualmente iOS/iPadOS 18.0+ y una región compatible con una cuenta de App Store correspondiente.',steps:['Comprueba la versión exacta de iOS/iPadOS.','En iOS/iPadOS 18.0+, comprueba los requisitos de UE/Japón/Brasil.','En iOS/iPadOS 17, usa AltStore Classic u otra ruta de sideloading.'],primary:'Requisitos de AltStore PAL ↗',secondary:'AltStore Classic ↗'},
    marketplaceUnsupported:{title:'AltStore PAL requiere iOS/iPadOS 18.0+',text:'El rango de sistema antiguo seleccionado no cumple el requisito actual de AltStore PAL de iOS/iPadOS 18.0+. Usa AltStore Classic u otro método de sideloading compatible.',steps:['Comprueba la versión exacta del sistema.','Si quieres AltStore, usa AltStore Classic.','En caso contrario, elige otro objetivo en el asistente.'],primary:'Abrir AltStore Classic ↗',secondary:'Requisitos de AltStore PAL ↗'},
    permanent:{title:'Comprueba primero la compatibilidad de TrollStore',text:'La instalación permanente de IPA solo funciona en versiones concretas y compatibles de iOS/iPadOS. Verifica tu versión exacta antes de continuar.',steps:['Comprueba tu versión exacta.','Compárala con la lista oficial de TrollStore.','Si no es compatible, usa SideStore, LiveContainer o Sideloadly.'],primary:'Abrir TrollStore ↗'},
    sideinstaller:{title:'iOS 27 sin PC: SideInstaller → SideStore',text:'En iOS/iPadOS 27, SideInstaller puede realizar la instalación inicial de SideStore directamente en el dispositivo. Después SideStore gestiona instalaciones y renovaciones.',steps:['Usa solo SideInstaller oficial.','Instala SideStore en el dispositivo.','Activa LocalDevVPN al instalar o renovar.'],primary:'Abrir SideInstaller ↗',secondary:'Guía de SideStore ↗'},
    sideinstallerMany:{title:'iOS 27 sin PC: SideInstaller → LiveContainer + SideStore',text:'Para muchas apps invitadas sin PC en iOS 27, usa la combinación LiveContainer + SideStore instalada con SideInstaller.',steps:['Instala el build combinado LC+SS.','Comprueba el certificado y LocalDevVPN.','Renueva SideStore/contenedor y ejecuta las apps invitadas en LiveContainer.'],primary:'Abrir SideInstaller ↗',secondary:'Guía LC+SS ↗'},
    livecontainer:{title:'LiveContainer + SideStore',text:'Para muchas apps IPA, LiveContainer mantiene las apps invitadas dentro de un contenedor y SideStore gestiona firma y renovación.',steps:['Instala LC+SS con un método compatible.','Importa correctamente el certificado de firma.','Ten Wi-Fi y LocalDevVPN listos para renovar.'],primary:'Abrir guía LC+SS ↗',secondary:'Solución de problemas ↓',secondaryUrl:'#troubleshooting'},
    sideloadly:{title:'Sideloadly',text:'Si usar un ordenador te parece bien, Sideloadly es la ruta de escritorio más directa para instalar tus propias IPA.',steps:['Instala Sideloadly en Windows o macOS.','Conecta y confía en el dispositivo.','Renueva por Wi-Fi/USB cuando sea necesario.'],primary:'Abrir Sideloadly ↗'},
    pairingNeeded:{title:'iOS 17–26 sin PC: se necesita archivo de pairing',text:'SideInstaller v1 ofrece compatibilidad parcial con iOS 17–26, pero solo si ya tienes un archivo de pairing creado con un ordenador. Si todavía no lo tienes, necesitas acceso a un ordenador una vez.',steps:['Comprueba si ya tienes un archivo de pairing válido.','Si no, créalo con iloader en un ordenador.','Después usa SideInstaller o SideStore con esos datos de pairing.'],primary:'Release v1 de SideInstaller ↗',url:'https://docs.sidestore.io/docs/installation/prerequisites',secondary:'Guía de pairing SideStore ↗'},
    checkVersionNoPc:{title:'Comprueba primero tu versión exacta de iOS',text:'La ruta sin PC depende de la versión exacta. En iOS 27, SideInstaller funciona completamente en el dispositivo. En iOS 17–26, SideInstaller v1 solo funciona si ya existe un archivo de pairing.',steps:['Abre Ajustes → General → Información.','Comprueba la versión exacta de iOS/iPadOS.','Después elige iOS 27 o iOS 17–26 en este asistente.'],primary:'Guía de configuración de SideStore ↗'},
    sidestore:{title:'SideStore tras una configuración inicial',text:'Si solo quieres usar el ordenador para la configuración inicial, SideStore encaja bien. En versiones antiguas sin un archivo de emparejamiento existente, la primera configuración aún necesita datos de emparejamiento desde un ordenador.',steps:['Completa el emparejamiento/configuración inicial.','Activa LocalDevVPN en el dispositivo.','Después instala y renueva directamente desde SideStore.'],primary:'Abrir guía SideStore ↗',secondary:'Solución de problemas ↓',secondaryUrl:'#troubleshooting'}
  },
  fr: {
    tv:{title:'Apple TV : Sideloadly ou atvloadly',text:'Pour Apple TV, utilisez Sideloadly sous Windows/macOS ou atvloadly pour un workflow auto-hébergé Linux/OpenWrt.',steps:['Choisir bureau ou auto-hébergé.','Appairer l’Apple TV.','Installer et actualiser avec l’outil choisi.'],primary:'Ouvrir Sideloadly ↗',secondary:'atvloadly ↗'},
    marketplace:{title:'AltStore PAL — région prise en charge + iOS 18+',text:'AltStore PAL nécessite actuellement iOS/iPadOS 18.0 ou plus récent, une présence physique dans l’UE, au Japon ou au Brésil et un compte App Store de la même région prise en charge. Aucun ordinateur n’est nécessaire et les apps du marketplace n’utilisent pas le cycle normal de refresh de 7 jours.',steps:['Vérifier iOS/iPadOS 18.0+ dans Réglages → Général → Informations.','Vérifier la présence en UE/Japon/Brésil et un compte App Store correspondant.','Installer AltStore PAL depuis la page officielle.'],primary:'Ouvrir AltStore PAL ↗',secondary:'AltStore Classic ↗'},
    marketplaceCheck:{title:'Vérifiez la version exacte d’iOS avant AltStore PAL',text:'La plage sélectionnée contient des versions prises en charge et non prises en charge. AltStore PAL nécessite actuellement iOS/iPadOS 18.0+ ainsi qu’une région prise en charge avec un compte App Store correspondant.',steps:['Vérifier la version exacte d’iOS/iPadOS.','Sous iOS/iPadOS 18.0+, vérifier les conditions UE/Japon/Brésil.','Sous iOS/iPadOS 17, utiliser AltStore Classic ou une autre méthode de sideloading.'],primary:'Prérequis AltStore PAL ↗',secondary:'AltStore Classic ↗'},
    marketplaceUnsupported:{title:'AltStore PAL nécessite iOS/iPadOS 18.0+',text:'La plage système legacy sélectionnée ne respecte pas l’exigence actuelle d’AltStore PAL : iOS/iPadOS 18.0+. Utilisez AltStore Classic ou une autre méthode de sideloading compatible.',steps:['Vérifier la version exacte du système.','Pour AltStore, utiliser AltStore Classic.','Sinon choisir un autre objectif dans l’assistant.'],primary:'Ouvrir AltStore Classic ↗',secondary:'Prérequis AltStore PAL ↗'},
    permanent:{title:'Vérifier d’abord la compatibilité TrollStore',text:'L’installation permanente d’IPA ne fonctionne que sur certaines versions iOS/iPadOS prises en charge. Vérifiez votre version exacte avant de continuer.',steps:['Vérifier la version exacte du système.','La comparer à la liste officielle TrollStore.','Si elle n’est pas prise en charge, utiliser SideStore, LiveContainer ou Sideloadly.'],primary:'Ouvrir TrollStore ↗'},
    sideinstaller:{title:'iOS 27 sans PC : SideInstaller → SideStore',text:'Sous iOS/iPadOS 27, SideInstaller peut effectuer l’installation initiale de SideStore directement sur l’appareil. SideStore gère ensuite installations et actualisations.',steps:['Utiliser uniquement SideInstaller officiel.','Installer SideStore sur l’appareil.','Activer LocalDevVPN pour installer ou actualiser.'],primary:'Ouvrir SideInstaller ↗',secondary:'Guide SideStore ↗'},
    sideinstallerMany:{title:'iOS 27 sans PC : SideInstaller → LiveContainer + SideStore',text:'Pour de nombreuses apps invitées sans PC sous iOS 27, utilisez la combinaison LiveContainer + SideStore installée via SideInstaller.',steps:['Installer le build combiné LC+SS.','Vérifier le certificat de signature et LocalDevVPN.','Actualiser SideStore/conteneur et lancer les apps invitées dans LiveContainer.'],primary:'Ouvrir SideInstaller ↗',secondary:'Guide LC+SS ↗'},
    livecontainer:{title:'LiveContainer + SideStore',text:'Pour de nombreuses apps IPA, LiveContainer garde les apps invitées dans un seul conteneur tandis que SideStore gère signature et actualisation.',steps:['Installer LC+SS avec une méthode prise en charge.','Importer correctement le certificat de signature.','Garder Wi-Fi et LocalDevVPN prêts pour l’actualisation.'],primary:'Ouvrir le guide LC+SS ↗',secondary:'Dépannage ↓',secondaryUrl:'#troubleshooting'},
    sideloadly:{title:'Sideloadly',text:'Si utiliser un ordinateur vous convient, Sideloadly est la voie bureau la plus directe pour installer vos propres IPA.',steps:['Installer Sideloadly sous Windows ou macOS.','Connecter l’appareil et lui faire confiance.','Ressigner via Wi-Fi/USB si nécessaire.'],primary:'Ouvrir Sideloadly ↗'},
    pairingNeeded:{title:'iOS 17–26 sans PC : fichier d’appairage requis',text:'SideInstaller v1 prend partiellement en charge iOS 17–26, mais uniquement avec un fichier d’appairage déjà créé sur un ordinateur. Si vous n’en avez pas encore, un accès ponctuel à un ordinateur est nécessaire.',steps:['Vérifier si vous avez déjà un fichier d’appairage valide.','Sinon, le créer avec iloader sur un ordinateur.','Ensuite utiliser SideInstaller ou SideStore avec ces données d’appairage.'],primary:'Release v1 SideInstaller ↗',url:'https://docs.sidestore.io/docs/installation/prerequisites',secondary:'Guide d’appairage SideStore ↗'},
    checkVersionNoPc:{title:'Vérifiez d’abord la version exacte d’iOS',text:'Le parcours sans PC dépend de la version exacte du système. Sous iOS 27, SideInstaller fonctionne entièrement sur l’appareil. Sous iOS 17–26, SideInstaller v1 fonctionne uniquement si un fichier d’appairage existe déjà.',steps:['Ouvrir Réglages → Général → Informations.','Vérifier la version exacte d’iOS/iPadOS.','Choisir ensuite iOS 27 ou iOS 17–26 dans cet assistant.'],primary:'Guide de configuration SideStore ↗'},
    sidestore:{title:'SideStore après une configuration unique',text:'Si vous voulez utiliser l’ordinateur uniquement pour la configuration initiale, SideStore convient bien. Sur les anciennes versions sans fichier d’appairage existant, la première configuration nécessite encore des données d’appairage créées sur ordinateur.',steps:['Terminer l’appairage/configuration initiale.','Activer LocalDevVPN sur l’appareil.','Ensuite installer et actualiser directement depuis SideStore.'],primary:'Ouvrir le guide SideStore ↗',secondary:'Dépannage ↓',secondaryUrl:'#troubleshooting'}
  }
};

const SETUP_RESULT_ROUTES = Object.freeze({
  tv: Object.freeze({
    primary: Object.freeze({role:'apple-tv', index:0, purpose:'guide'}),
    secondary: Object.freeze({role:'apple-tv', index:1, purpose:'guide'})
  }),
  marketplace: Object.freeze({
    primary: Object.freeze({role:'marketplace', index:0, purpose:'download'}),
    secondary: Object.freeze({role:'marketplace-fallback', index:0, purpose:'classicGuide'})
  }),
  marketplaceCheck: Object.freeze({
    primary: Object.freeze({role:'marketplace', index:0, purpose:'requirements'}),
    secondary: Object.freeze({role:'marketplace-fallback', index:0, purpose:'classicGuide'})
  }),
  marketplaceUnsupported: Object.freeze({
    primary: Object.freeze({role:'marketplace-fallback', index:0, purpose:'classicGuide'}),
    secondary: Object.freeze({role:'marketplace', index:0, purpose:'requirements'})
  }),
  permanent: Object.freeze({
    primary: Object.freeze({role:'permanent', index:0, purpose:'guide'})
  }),
  sideinstaller: Object.freeze({
    primary: Object.freeze({role:'on-device-setup', index:0, purpose:'guide'}),
    secondary: Object.freeze({role:'setup-refresh', index:0, purpose:'guide'})
  }),
  sideinstallerMany: Object.freeze({
    primary: Object.freeze({role:'many-apps-setup', index:0, purpose:'guide'}),
    secondary: Object.freeze({role:'many-apps-setup', index:1, purpose:'lcSideStore'})
  }),
  livecontainer: Object.freeze({
    primary: Object.freeze({role:'many-apps', index:0, purpose:'lcSideStore'})
  }),
  sideloadly: Object.freeze({
    primary: Object.freeze({role:'desktop-install', index:0, purpose:'guide'})
  }),
  pairingNeeded: Object.freeze({
    secondary: Object.freeze({role:'pairing-guide', index:0, purpose:'pairing'})
  }),
  checkVersionNoPc: Object.freeze({
    primary: Object.freeze({role:'setup-refresh', index:0, purpose:'prerequisites'})
  }),
  sidestore: Object.freeze({
    primary: Object.freeze({role:'setup-refresh', index:0, purpose:'guide'})
  })
});

function routeToolURL(config, fallback) {
  if (!config) return fallback;
  const tool = sideloadToolForRole(config.role, config.index || 0);
  return tool ? (sideloadToolURL(tool.id, config.purpose || 'guide') || fallback) : fallback;
}

function setupResultToolURL(resultKey, slot, fallback) {
  return routeToolURL(SETUP_RESULT_ROUTES[resultKey]?.[slot], fallback);
}

function preferredScrollBehavior() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function helpCopyForLanguage() {
  return HELP_COPY[root.lang] || HELP_COPY.en;
}

function setupResultsForLanguage() {
  return SETUP_RESULTS[root.lang] || SETUP_RESULTS.en;
}

let activeHelpMode = 'choose';
let selectedTroubleToolId = '';
const setupState = { device:null, version:null, computer:null, need:null };
const diagnosisState = { tried:new Set(), dismissed:new Set(), currentKey:null };

function selectedTroubleshootingTool() {
  if (!selectedTroubleToolId) return null;
  return troubleshootingSideloadTools().find(tool => tool.id === selectedTroubleToolId) || null;
}

function guideTroubleshootingTools() {
  const orderFor = tool => {
    const catalogOrder = Number(tool?.catalogPriority);
    if (tool?.catalogPriority !== null && tool?.catalogPriority !== undefined && Number.isFinite(catalogOrder)) {
      return catalogOrder;
    }
    const resourceOrder = Number(tool?.resourceOrder);
    return 1000 + (Number.isFinite(resourceOrder) ? resourceOrder : 999);
  };

  return [...troubleshootingSideloadTools()].sort((a, b) => {
    const orderDiff = orderFor(a) - orderFor(b);
    if (orderDiff) return orderDiff;
    return String(a.label || a.id).localeCompare(String(b.label || b.id));
  });
}

function scopedTroubleshootingTools() {
  const selected = selectedTroubleshootingTool();
  return selected ? [selected] : guideTroubleshootingTools();
}

function updateToolScopeDisplay() {
  const selected = selectedTroubleshootingTool();
  const copy = helpCopyForLanguage();
  const label = $('#guideToolScopeLabel');
  const icon = $('#guideToolScopeIcon');
  const allIcon = $('#guideToolScopeAllIcon');
  if (label) label.textContent = selected?.label || copy.toolScopeAll;
  if (icon) {
    icon.hidden = !selected?.icon;
    icon.src = selected?.icon || '';
  }
  if (allIcon) allIcon.hidden = Boolean(selected?.icon);
  $$('[data-guide-tool-scope]').forEach(option => {
    const active = (option.dataset.guideToolScope || '') === (selected?.id || '');
    option.classList.toggle('active', active);
    option.setAttribute('aria-selected', String(active));
  });
}

function renderToolScopePicker() {
  const menu = $('#guideToolScopeMenu');
  if (!menu) return;
  menu.replaceChildren();

  const addOption = (tool = null) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'guide-tool-scope-option';
    button.dataset.guideToolScope = tool?.id || '';
    button.setAttribute('role', 'option');
    button.setAttribute('aria-selected', 'false');

    if (tool?.icon) {
      const icon = document.createElement('img');
      icon.className = 'guide-tool-scope-icon';
      icon.src = tool.icon;
      icon.alt = '';
      icon.loading = 'lazy';
      icon.referrerPolicy = 'no-referrer';
      button.appendChild(icon);
    } else {
      const icon = document.createElement('span');
      icon.className = 'guide-tool-scope-all-icon';
      icon.textContent = '✨';
      icon.setAttribute('aria-hidden', 'true');
      button.appendChild(icon);
    }

    const label = document.createElement('span');
    label.dataset.toolScopeOptionLabel = tool ? 'tool' : 'all';
    label.textContent = tool?.label || helpCopyForLanguage().toolScopeAll;
    button.appendChild(label);
    menu.appendChild(button);
  };

  addOption();
  guideTroubleshootingTools().forEach(addOption);
  updateToolScopeDisplay();
}

function closeToolScopePicker() {
  const button = $('#guideToolScopeButton');
  const menu = $('#guideToolScopeMenu');
  if (button) button.setAttribute('aria-expanded', 'false');
  if (menu) menu.hidden = true;
}

function toggleToolScopePicker() {
  const button = $('#guideToolScopeButton');
  const menu = $('#guideToolScopeMenu');
  if (!button || !menu) return;
  const opening = menu.hidden;
  menu.hidden = !opening;
  button.setAttribute('aria-expanded', String(opening));
  if (opening) requestAnimationFrame(() => menu.querySelector('[aria-selected="true"]')?.focus());
}

function syncToolScopeDeepLink() {
  const url = new URL(window.location.href);
  if (selectedTroubleToolId) url.searchParams.set('tool', selectedTroubleToolId);
  else url.searchParams.delete('tool');
  history.replaceState(null, '', url.pathname + url.search + url.hash);
}

function setToolScope(toolId, syncUrl = true) {
  const requested = String(toolId || '').trim();
  const valid = requested && troubleshootingSideloadTools().some(tool => tool.id === requested);
  selectedTroubleToolId = valid ? requested : '';
  diagnosisState.dismissed.clear();
  diagnosisState.currentKey = null;
  closeToolScopePicker();
  updateToolScopeDisplay();
  renderOfficialToolReferences();
  filterTroubleshooting();
  updateAssistantTroubleSummary();
  if ($('#assistantTroubleSearch')?.value.trim()) renderAssistantDiagnosis(false);
  updateReportLink();
  if (syncUrl) syncToolScopeDeepLink();
}

function hydrateGuideToolRegistryReferences() {
  $$('[data-guide-tool-link]').forEach(link => {
    const toolId = link.dataset.guideToolLink || '';
    const purpose = link.dataset.guideToolPurpose || 'guide';
    const href = sideloadToolURL(toolId, purpose);
    if (href) link.href = href;
  });

  $$('[data-guide-tool-icon]').forEach(icon => {
    const tool = sideloadTool(icon.dataset.guideToolIcon || '');
    if (!tool?.icon) return;
    icon.src = tool.icon;
  });
}

function appendToolReference(container, tool, purpose, className = '', withIcon = false) {
  const href = sideloadToolURL(tool.id, purpose);
  if (!container || !href) return;
  const link = document.createElement('a');
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  if (className) link.className = className;
  link.dataset.toolReference = tool.id;

  if (withIcon && tool.icon) {
    const icon = document.createElement('img');
    icon.className = 'brand-link-icon';
    icon.src = tool.icon;
    icon.alt = '';
    icon.loading = 'lazy';
    icon.referrerPolicy = 'no-referrer';
    link.appendChild(icon);
  }

  const label = document.createElement('span');
  label.textContent = `${tool.label} ↗`;
  link.appendChild(label);
  container.appendChild(link);
}

function renderOfficialToolReferences() {
  const tools = scopedTroubleshootingTools();

  const help = $('#officialHelpSources');
  if (help) {
    help.querySelectorAll('[data-tool-reference]').forEach(node => node.remove());
    tools.forEach(tool => appendToolReference(help, tool, 'troubleshooting'));
  }

  const references = $('#guideOfficialLinks');
  if (references) {
    references.replaceChildren();
    tools.forEach(tool => appendToolReference(references, tool, 'guide', 'btn small secondary brand-link', true));
  }
}

function applyHelpCopy() {
  const copy = helpCopyForLanguage();
  $$('[data-help-copy]').forEach(node => {
    const value = copy[node.dataset.helpCopy];
    if (value) node.textContent = value;
  });
  $$('[data-help-placeholder]').forEach(node => {
    const value = copy[node.dataset.helpPlaceholder];
    if (value) node.placeholder = value;
  });
  $$('[data-help-aria-label]').forEach(node => {
    const value = copy[node.dataset.helpAriaLabel];
    if (value) node.setAttribute('aria-label', value);
  });
  const allScopeLabel = $('[data-tool-scope-option-label="all"]');
  if (allScopeLabel) allScopeLabel.textContent = copy.toolScopeAll;
  updateToolScopeDisplay();
  updateAssistantTroubleSummary();
  if (Object.values(setupState).every(Boolean)) renderSetupResult();
  if (!$('#assistantDiagnosis')?.hidden) renderAssistantDiagnosis(false);
}

function setHelpMode(mode) {
  if (!['choose','fix','setup'].includes(mode)) return;
  activeHelpMode = mode;
  $$('[data-guide-mode]').forEach(button => {
    const active = button.dataset.guideMode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  $$('[data-guide-panel]').forEach(panel => {
    const active = panel.dataset.guidePanel === mode;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });
}

function handleHelpTabKeydown(event) {
  const current = event.target.closest('[data-guide-mode]');
  if (!current || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;

  const tabs = [...document.querySelectorAll('[data-guide-mode]')];
  const index = tabs.indexOf(current);
  if (index < 0) return;

  event.preventDefault();
  let nextIndex = index;
  if (event.key === 'Home') nextIndex = 0;
  else if (event.key === 'End') nextIndex = tabs.length - 1;
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
  else nextIndex = (index + 1) % tabs.length;

  const next = tabs[nextIndex];
  setHelpMode(next.dataset.guideMode);
  next.focus();
}

function triedButtonForKey(key) {
  return [...document.querySelectorAll('.assistant-tried-options [data-tried-key]')].find(button => button.dataset.triedKey === key) || null;
}

function diagnosisTriedTags() {
  return [...diagnosisState.tried].flatMap(key => {
    const button = triedButtonForKey(key);
    return (button?.dataset.triedTags || '').toLowerCase().split(/\s+/).filter(Boolean);
  });
}

function troubleTermMatches(haystack, term) {
  if (!term) return false;
  if (/^[a-z0-9_-]+$/i.test(term)) {
    const tokens = haystack.match(/[a-z0-9_-]+/gi) || [];
    return tokens.includes(term);
  }
  return haystack.includes(term);
}

function normalizeTroubleToolText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function troubleshootingToolAliases(tool) {
  if (!tool) return [];
  return [...new Set([
    tool.id,
    tool.label,
    tool.resourceName,
    tool.creditName
  ].map(normalizeTroubleToolText).filter(Boolean))];
}

function troubleshootingToolForQuery(query) {
  const normalizedQuery = normalizeTroubleToolText(query);
  if (!normalizedQuery) return null;

  const matches = troubleshootingSideloadTools().flatMap(tool => {
    return troubleshootingToolAliases(tool)
      .filter(alias => normalizedQuery.includes(alias))
      .map(alias => ({tool, alias}));
  });

  matches.sort((a, b) => b.alias.length - a.alias.length);
  return matches[0]?.tool || null;
}

function scopedTroubleQuery(rawQuery, normalizedTerms) {
  const tool = selectedTroubleshootingTool() || troubleshootingToolForQuery(rawQuery);
  const toolTerm = normalizeTroubleToolText(tool?.label || tool?.id);
  return [toolTerm, normalizedTerms].filter(Boolean).join(' ').trim();
}

function getTroubleMatches(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  const terms = [...new Set(q.split(/\s+/).filter(Boolean))];
  const triedTags = diagnosisTriedTags();
  const preferredTool = selectedTroubleshootingTool() || troubleshootingToolForQuery(q);
  const preferredToolTerms = new Set(
    troubleshootingToolAliases(preferredTool)
      .flatMap(alias => alias.split(/\s+/).filter(Boolean))
  );
  const symptomTerms = terms.filter(term => !preferredToolTerms.has(term));

  return [...document.querySelectorAll('.trouble-item')]
    .filter(item => !selectedTroubleToolId || !item.dataset.tool || item.dataset.tool === selectedTroubleToolId)
    .map((item, index) => {
      const searchHaystack = (item.dataset.search || '').toLowerCase();
      const textHaystack = (item.textContent || '').toLowerCase();
      const haystack = [searchHaystack, textHaystack].join(' ');
      const scoreTerms = scoreTermsToUse => scoreTermsToUse.reduce((sum, term) => {
        if (troubleTermMatches(searchHaystack, term)) return sum + (/[0-9]/.test(term) ? 4 : 2);
        if (troubleTermMatches(textHaystack, term)) return sum + (/[0-9]/.test(term) ? 3 : 1);
        return sum;
      }, 0);
      const baseScore = scoreTerms(terms);
      const symptomScore = scoreTerms(symptomTerms);
      const toolBoost = preferredTool && item.dataset.tool === preferredTool.id && symptomScore > 0 ? 12 : 0;
      const competingToolPenalty = preferredTool && item.dataset.tool && item.dataset.tool !== preferredTool.id ? 0.75 : 0;
      const triedPenalty = triedTags.reduce((sum, tag) => sum + (haystack.includes(tag) ? 0.35 : 0), 0);
      const communityPenalty = item.classList.contains('community-item') ? 0.15 : 0;
      return {
        item,
        score:baseScore + toolBoost - competingToolPenalty - triedPenalty - communityPenalty,
        baseScore,
        index,
        key:item.dataset.search || String(index)
      };
    })
    .filter(match => match.baseScore > 0)
    .sort((a,b) => b.score - a.score || b.baseScore - a.baseScore || a.index - b.index);
}

function troubleMatchCount(query) {
  return getTroubleMatches(query).length;
}

function splitDiagnosisSteps(text) {
  const normalized = (text || '').replace(/\s+/g,' ').trim();
  if (!normalized) return [];
  const parts = (normalized.match(/[^.!?]+[.!?]?/g) || [])
    .map(part => part.trim())
    .filter(part => part.length > 18);
  return (parts.length ? parts : [normalized]).slice(0,3);
}

function extractKnownError(raw) {
  const text = String(raw || '');
  const code = text.match(/\b(?:1004|1005|1006|1007|1009|1412|1414|2009|503)\b/i);
  if (code) return code[0].toUpperCase();
  if (/minimuxer\s*(?:error\s*)?27/i.test(text)) return 'minimuxer 27';
  return '';
}

function helpUrlForFix(raw) {
  const url = new URL(window.location.href);
  url.searchParams.delete('setup');
  const cleanRaw = String(raw || '').trim();
  const resolved = cleanRaw ? resolvedTroubleQuery(cleanRaw) : '';
  const token = cleanRaw
    ? (extractKnownError(cleanRaw) || diagnosisState.currentKey || (resolved !== cleanRaw.toLowerCase() ? resolved : ''))
    : '';
  if (token) url.searchParams.set('fix', token);
  else url.searchParams.delete('fix');
  if (diagnosisState.tried.size) url.searchParams.set('tried', [...diagnosisState.tried].join(','));
  else url.searchParams.delete('tried');
  url.hash = '';
  return url;
}

function syncFixDeepLink(raw) {
  const url = helpUrlForFix(raw);
  history.replaceState(null,'',url.pathname + url.search + url.hash);
}

function renderAssistantDiagnosis(syncUrl = false) {
  const input = $('#assistantTroubleSearch');
  const box = $('#assistantDiagnosis');
  if (!input || !box) return;

  const raw = input.value.trim();
  if (!raw) {
    box.hidden = true;
    diagnosisState.currentKey = null;
    if (syncUrl) syncFixDeepLink('');
    return;
  }

  const query = resolvedTroubleQuery(raw);
  const allMatches = getTroubleMatches(query);
  let matches = allMatches.filter(match => !diagnosisState.dismissed.has(match.key));
  if (!matches.length && allMatches.length) {
    diagnosisState.dismissed.clear();
    matches = allMatches;
  }
  const match = matches[0];
  if (!match) {
    box.hidden = true;
    diagnosisState.currentKey = null;
    if (syncUrl) syncFixDeepLink(raw);
    return;
  }

  const item = match.item;
  diagnosisState.currentKey = match.key;
  const copy = helpCopyForLanguage();
  const isCommunity = item.classList.contains('community-item');
  const title = item.querySelector('summary')?.textContent?.trim() || raw;
  const answer = item.querySelector('.trouble-answer')?.textContent?.trim() || '';
  const docs = [...item.querySelectorAll('.trouble-docs a')];
  const steps = splitDiagnosisSteps(answer);
  const source = $('#assistantDiagnosisSource');
  const code = $('#assistantDiagnosisCode');

  source.className = 'trouble-source-badge ' + (isCommunity ? 'community' : 'official');
  source.textContent = isCommunity ? copy.sourceCommunity : copy.sourceOfficial;
  $('#assistantDiagnosisTitle').textContent = title;
  $('#assistantDiagnosisText').textContent = isCommunity ? copy.diagnosisCommunityNote : copy.diagnosisOfficialNote;
  $('#assistantDiagnosisSteps').innerHTML = steps.map(step => `<li>${step}</li>`).join('');
  $('#assistantDiagnosisDocs').innerHTML = docs.map(link => {
    const href = link.getAttribute('href') || '#';
    const label = link.textContent.trim();
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  }).join('');

  const errorCode = extractKnownError(raw);
  if (errorCode) {
    code.textContent = errorCode;
    code.hidden = false;
  } else {
    code.hidden = true;
    code.textContent = '';
  }

  const nextButton = $('#assistantDiagnosisDidntHelp');
  const remaining = allMatches.filter(candidate => candidate.key !== match.key && !diagnosisState.dismissed.has(candidate.key));
  if (nextButton) {
    nextButton.disabled = remaining.length === 0;
    nextButton.textContent = remaining.length ? copy.diagnosisDidntHelp : copy.diagnosisNoMore;
  }

  box.dataset.query = query;
  box.hidden = false;
  updateReportLink();
  if (syncUrl) syncFixDeepLink(raw);
}

function toggleTriedCheck(button) {
  const key = button?.dataset.triedKey;
  if (!key) return;
  if (diagnosisState.tried.has(key)) diagnosisState.tried.delete(key);
  else diagnosisState.tried.add(key);
  button.classList.toggle('active', diagnosisState.tried.has(key));
  button.setAttribute('aria-pressed', String(diagnosisState.tried.has(key)));
  diagnosisState.dismissed.clear();
  renderAssistantDiagnosis(true);
}

function resetTriedChecks() {
  diagnosisState.tried.clear();
  diagnosisState.dismissed.clear();
  $$('.assistant-tried-options button').forEach(button => {
    button.classList.remove('active');
    button.setAttribute('aria-pressed','false');
  });
  renderAssistantDiagnosis(true);
}

function showNextDiagnosis() {
  if (!diagnosisState.currentKey) return;
  diagnosisState.dismissed.add(diagnosisState.currentKey);
  renderAssistantDiagnosis(true);
  $('#assistantDiagnosis')?.scrollIntoView({behavior:preferredScrollBehavior(),block:'nearest'});
}

async function copyDiagnosisLink() {
  const input = $('#assistantTroubleSearch');
  const button = $('#assistantDiagnosisCopy');
  if (!input || !button) return;
  const url = helpUrlForFix(input.value).toString();
  let copied = false;
  try {
    await navigator.clipboard.writeText(url);
    copied = true;
  } catch (_) {
    const textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.setAttribute('readonly','');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try { copied = document.execCommand('copy'); } catch (_) {}
    textarea.remove();
  }
  if (copied) {
    const copy = helpCopyForLanguage();
    const original = copy.diagnosisCopy;
    button.textContent = copy.diagnosisCopied;
    setTimeout(() => { button.textContent = original; }, 1400);
  }
}

function resolvedTroubleQuery(raw) {
  const q = (raw || '').trim().toLowerCase();
  if (!q) return '';
  if (/1005|1007|invalid.?ipa|app.?not.?found/.test(q)) return scopedTroubleQuery(q, '1005 1007 invalid format ipa app not found');
  if (/1412|anisette/.test(q)) return scopedTroubleQuery(q, 'apple login anisette 1412');
  if (/1004|503|2fa|two.?factor|apple.?id|sign.?in|login|verification.?code/.test(q)) return scopedTroubleQuery(q, 'apple login 503 2fa 1004 verification code');
  if (/1006|udid|pair|pairing/.test(q)) return scopedTroubleQuery(q, 'pairing 1006 udid');
  if (/1009|2009|maximum.*app|app.?id|3.?app|limit/.test(q)) return scopedTroubleQuery(q, '3 app limit app ids 1009 2009');
  if (/10\.7\.0\.2|10\.7\.0\.1|tunnel.?ip|device.?ip/.test(q)) return scopedTroubleQuery(q, '10.7.0.2/30 10.7.0.1/32 localdevvpn tunnel device ip workaround');
  if (/shortcut|resign|long.?press|background.*sidestore/.test(q)) return scopedTroubleQuery(q, 'ios 27 shortcut resign long press background refresh all');
  if (/1414|minimuxer.*27|afc|vpn|localdevvpn/.test(q)) return scopedTroubleQuery(q, 'refresh 1414 minimuxer 27 afc localdevvpn');
  if (/altserver|server not found|remote server/.test(q)) return scopedTroubleQuery(q, 'altserver');
  if (/install|installation|instal|nainstal/.test(q)) return scopedTroubleQuery(q, 'install ipa app');
  if (/cert|certificate|provision/.test(q)) {
    const certificateTerms = ['certificate', 'provision', 'provisioning'];
    if (/revoked|revoke/.test(q)) certificateTerms.push('revoked');
    if (/expired|expire/.test(q)) certificateTerms.push('expired');
    if (/mismatch|missing|import/.test(q)) certificateTerms.push('mismatch', 'missing', 'import');
    return scopedTroubleQuery(q, certificateTerms.join(' '));
  }
  if (/livecontainer|jit|jitless|invalid.?signature|entitlement/.test(q)) return scopedTroubleQuery(q, 'livecontainer jit jitless invalid signature entitlements');
  if (/refresh|expire|expir|7.?day|7.?dn|renew|neobnov|obnovit|obnova/.test(q)) return scopedTroubleQuery(q, 'refresh');
  const selected = selectedTroubleshootingTool();
  const selectedTerm = normalizeTroubleToolText(selected?.label || selected?.id);
  return [selectedTerm, q].filter(Boolean).join(' ').trim();
}

function updateAssistantTroubleSummary() {
  const input = $('#assistantTroubleSearch');
  const summary = $('#assistantTroubleCount');
  if (!input || !summary) return;
  const raw = input.value.trim();
  const copy = helpCopyForLanguage();
  if (!raw) {
    summary.textContent = copy.fixReady;
    return;
  }
  const count = troubleMatchCount(resolvedTroubleQuery(raw));
  summary.textContent = copy.fixCount.replace('{n}', String(count));
}

function updateSetupProgress() {
  const answered = Object.values(setupState).filter(Boolean).length;
  const bar = $('#setupProgressBar');
  const text = $('#setupProgressText');
  if (bar) bar.style.width = `${answered * 25}%`;
  if (text) text.textContent = `${answered} / 4`;
  $$('.setup-question').forEach(question => {
    question.classList.toggle('answered', Boolean(setupState[question.dataset.setupQuestion]));
  });
  if (answered === 4) {
    renderSetupResult();
    syncSetupDeepLink();
  }
}

function selectSetupOption(button) {
  const key = button.dataset.setupKey;
  const value = button.dataset.setupValue;
  if (!Object.prototype.hasOwnProperty.call(setupState, key)) return;
  setupState[key] = value;
  $$('[data-setup-key="' + key + '"]').forEach(item => item.classList.toggle('active', item === button));
  updateSetupProgress();
}

function chooseSetupResultKey() {
  if (setupState.device === 'tv') return 'tv';
  if (setupState.need === 'marketplace') {
    if (setupState.version === 'older') return 'marketplaceUnsupported';
    if (setupState.version === '17-26' || setupState.version === 'unknown') return 'marketplaceCheck';
    return 'marketplace';
  }
  if (setupState.need === 'permanent') return 'permanent';
  if (setupState.version === '27' && setupState.computer === 'none') return setupState.need === 'many' ? 'sideinstallerMany' : 'sideinstaller';
  if (setupState.version === '17-26' && setupState.computer === 'none') return 'pairingNeeded';
  if (setupState.version === 'unknown' && setupState.computer === 'none') return 'checkVersionNoPc';
  if (setupState.need === 'many') return 'livecontainer';
  if (setupState.computer === 'available') return 'sideloadly';
  return 'sidestore';
}

function renderSetupResult() {
  if (!Object.values(setupState).every(Boolean)) return;
  const resultKey = chooseSetupResultKey();
  const result = setupResultsForLanguage()[resultKey] || SETUP_RESULTS.en[resultKey];
  const box = $('#setupResult');
  if (!result || !box) return;
  $('#setupResultTitle').textContent = result.title;
  $('#setupResultText').textContent = result.text;
  $('#setupResultSteps').innerHTML = result.steps.map((step,index) => `<div><span>${index + 1}</span><p>${step}</p></div>`).join('');
  const badges = [
    setupState.device === 'tv' ? 'Apple TV' : 'iPhone / iPad',
    setupState.version === 'unknown' ? '?' : (setupState.version === 'older' ? 'Legacy' : 'iOS ' + setupState.version),
    setupState.computer === 'none' ? 'NO PC' : (setupState.computer === 'setup' ? 'SETUP PC' : 'PC OK')
  ];
  $('#setupResultBadges').innerHTML = badges.map(value => `<span class="pill mode">${value}</span>`).join('');
  setRecommendationLink(
    $('#setupResultPrimary'),
    result.primary,
    setupResultToolURL(resultKey, 'primary', result.url)
  );
  setRecommendationLink(
    $('#setupResultSecondary'),
    result.secondary,
    setupResultToolURL(resultKey, 'secondary', result.secondaryUrl)
  );
  box.hidden = false;
  box.scrollIntoView({behavior:preferredScrollBehavior(),block:'nearest'});
  updateReportLink();
}

function resetSetup() {
  Object.keys(setupState).forEach(key => { setupState[key] = null; });
  $$('[data-setup-key]').forEach(button => button.classList.remove('active'));
  $('#setupResult').hidden = true;
  const url = new URL(window.location.href);
  url.searchParams.delete('setup');
  history.replaceState(null,'',url.pathname + url.search + url.hash);
  updateSetupProgress();
}

function syncSetupDeepLink() {
  if (!Object.values(setupState).every(Boolean)) return;
  const url = new URL(window.location.href);
  url.searchParams.delete('fix');
  url.searchParams.delete('tried');
  url.searchParams.set('setup', [setupState.device, setupState.version, setupState.computer, setupState.need].join(','));
  url.hash = '';
  history.replaceState(null,'',url.pathname + url.search + url.hash);
}

function loadSetupDeepLink(value) {
  const parts = String(value || '').split(',');
  if (parts.length !== 4) return false;
  const [device,version,computer,need] = parts;
  const allowed = {
    device:['iphone','tv'],
    version:['27','17-26','older','unknown'],
    computer:['none','setup','available'],
    need:['ipa','many','marketplace','permanent']
  };
  const values = {device,version,computer,need};
  if (!Object.entries(values).every(([key,val]) => allowed[key].includes(val))) return false;

  Object.assign(setupState, values);
  Object.entries(values).forEach(([key,val]) => {
    $$('[data-setup-key="' + key + '"]').forEach(button => {
      button.classList.toggle('active', button.dataset.setupValue === val);
    });
  });
  updateSetupProgress();
  return true;
}

const GUIDE_RECOMMENDATIONS = {
  en: {
    iphone:{title:'SideStore for on-device refresh',text:'For your own IPA files with the least computer use after setup, start with SideStore. On iOS/iPadOS 27, SideInstaller can perform the initial SideStore or SideStore + LiveContainer setup directly on-device.',steps:['Connect Wi-Fi and LocalDevVPN.','Use SideInstaller on iOS/iPadOS 27, or the regular SideStore setup on other supported versions.','Refresh before the free signing period expires.'],primary:'Open SideStore docs ↗',secondary:'SideInstaller ↗'},
    refresh:{title:'Start with LocalDevVPN and a manual refresh',text:'Most refresh troubleshooting starts by proving that a manual refresh works first. Then narrow the problem to pairing, certificate, login or the specific automation you use.',steps:['Connect to Wi-Fi.','Turn on LocalDevVPN.','Run a manual refresh, then use the troubleshooting filters below.'],primary:'Open troubleshooting ↓',url:'#troubleshooting'},
    many:{title:'LiveContainer + SideStore',text:'Use LiveContainer when you need many guest IPA apps without consuming a normal free-account app slot for each guest app.',steps:['Install the combined LC+SS setup.','Import or share the signing certificate correctly.','Refresh the container / SideStore; guest apps run inside LiveContainer.'],primary:'Open LiveContainer guide ↗',secondary:'Troubleshooting ↓',secondaryUrl:'#troubleshooting'},
    desktop:{title:'Sideloadly',text:'If you mainly install from Windows or macOS, Sideloadly is the direct desktop route and can re-sign apps when your device is reachable.',steps:['Install Sideloadly on Windows or macOS.','Connect the device by USB for setup.','Use Wi-Fi/USB auto-refresh if it fits your workflow.'],primary:'Open Sideloadly ↗'},
    tv:{title:'Sideloadly or atvloadly for Apple TV',text:'Use Sideloadly for the straightforward desktop path. Choose atvloadly when you specifically want a self-hosted Linux/OpenWrt workflow.',steps:['Choose desktop or self-hosted setup.','Pair the Apple TV.','Install and maintain your IPA through the selected tool.'],primary:'Open Sideloadly ↗',secondary:'atvloadly ↗'},
    permanent:{title:'Check TrollStore compatibility first',text:'TrollStore can permanently install IPA files only on supported iOS/iPadOS versions. Do not assume a newer version is compatible.',steps:['Check your exact iOS/iPadOS version.','Compare it with the official TrollStore support information.','Use another sideloading route if your version is not supported.'],primary:'Open TrollStore ↗'}
  },
  cs: {
    iphone:{title:'SideStore pro obnovování přímo z iPhonu',text:'Pro vlastní IPA s minimální potřebou počítače po prvním nastavení začni SideStorem. Na iOS/iPadOS 27 umí SideInstaller první instalaci SideStore nebo SideStore + LiveContainer provést přímo v zařízení.',steps:['Připoj Wi-Fi a zapni LocalDevVPN.','Na iOS/iPadOS 27 můžeš použít SideInstaller, na ostatních podporovaných verzích běžnou instalaci SideStore.','Aplikace obnovuj ještě před vypršením bezplatného podpisu.'],primary:'Otevřít SideStore návod ↗',secondary:'SideInstaller ↗'},
    refresh:{title:'Začni LocalDevVPN a ručním refreshem',text:'Nejdřív ověř, že ruční obnova vůbec funguje. Pak lze problém zúžit na pairing, certifikát, přihlášení nebo konkrétní automatizaci.',steps:['Připoj se k Wi-Fi.','Zapni LocalDevVPN.','Spusť ruční refresh a potom použij filtry řešení problémů níže.'],primary:'Otevřít řešení problémů ↓',url:'#troubleshooting'},
    many:{title:'LiveContainer + SideStore',text:'LiveContainer použij, pokud chceš hodně hostovaných IPA aplikací bez samostatného běžného slotu bezplatného účtu pro každou z nich.',steps:['Nainstaluj společnou kombinaci LC+SS.','Správně importuj nebo sdílej podepisovací certifikát.','Obnovuj kontejner / SideStore; hostované aplikace běží uvnitř LiveContaineru.'],primary:'Otevřít LiveContainer návod ↗',secondary:'Řešení problémů ↓',secondaryUrl:'#troubleshooting'},
    desktop:{title:'Sideloadly',text:'Pokud instaluješ hlavně z Windows nebo macOS, Sideloadly je nejpřímější desktopová cesta a umí aplikace znovu podepisovat, když je zařízení dostupné.',steps:['Nainstaluj Sideloadly ve Windows nebo macOS.','Pro první nastavení připoj zařízení přes USB.','Pokud ti to vyhovuje, použij automatické obnovení přes Wi-Fi/USB.'],primary:'Otevřít Sideloadly ↗'},
    tv:{title:'Sideloadly nebo atvloadly pro Apple TV',text:'Sideloadly je jednoduchá desktopová cesta. atvloadly použij, pokud chceš vlastní službu na Linuxu/OpenWrt.',steps:['Vyber desktop nebo self-hosted variantu.','Spáruj Apple TV.','IPA instaluj a udržuj přes zvolený nástroj.'],primary:'Otevřít Sideloadly ↗',secondary:'atvloadly ↗'},
    permanent:{title:'Nejdřív ověř kompatibilitu TrollStore',text:'TrollStore umí trvalou instalaci IPA jen na podporovaných verzích iOS/iPadOS. U novější verze kompatibilitu nepředpokládej.',steps:['Zjisti přesnou verzi iOS/iPadOS.','Porovnej ji s oficiální podporou TrollStore.','Pokud není podporovaná, použij jinou metodu sideloadingu.'],primary:'Otevřít TrollStore ↗'}
  }
};


GUIDE_RECOMMENDATIONS.de = {
  iphone:{title:'SideStore für Refresh direkt auf dem iPhone',text:'Für eigene IPA-Dateien mit möglichst wenig Computernutzung nach der Einrichtung starte mit SideStore. Unter iOS/iPadOS 27 kann SideInstaller die erste Installation von SideStore oder SideStore + LiveContainer direkt auf dem Gerät durchführen.',steps:['Mit Wi-Fi verbinden und LocalDevVPN aktivieren.','Unter iOS/iPadOS 27 SideInstaller verwenden, auf anderen unterstützten Versionen das normale SideStore-Setup.','Vor Ablauf der kostenlosen Signatur aktualisieren.'],primary:'SideStore-Doku öffnen ↗',secondary:'SideInstaller ↗'},
  refresh:{title:'Mit LocalDevVPN und manuellem Refresh beginnen',text:'Bei Refresh-Problemen zuerst prüfen, ob ein manueller Refresh funktioniert. Danach lässt sich das Problem auf Pairing, Zertifikat, Login oder die verwendete Automation eingrenzen.',steps:['Mit Wi-Fi verbinden.','LocalDevVPN einschalten.','Manuell aktualisieren und danach die Fehlerfilter unten verwenden.'],primary:'Fehlerbehebung öffnen ↓',url:'#troubleshooting'},
  many:{title:'LiveContainer + SideStore',text:'Nutze LiveContainer, wenn du viele Gast-IPA-Apps benötigst, ohne für jede Gast-App einen normalen App-Slot des kostenlosen Accounts zu belegen.',steps:['Die kombinierte LC+SS-Variante installieren.','Das Signaturzertifikat korrekt importieren oder teilen.','Container / SideStore aktualisieren; Gast-Apps laufen in LiveContainer.'],primary:'LiveContainer-Anleitung öffnen ↗',secondary:'Fehlerbehebung ↓',secondaryUrl:'#troubleshooting'},
  desktop:{title:'Sideloadly',text:'Wenn du hauptsächlich unter Windows oder macOS installierst, ist Sideloadly der direkte Desktop-Weg und kann Apps neu signieren, sobald dein Gerät erreichbar ist.',steps:['Sideloadly unter Windows oder macOS installieren.','Gerät für die Einrichtung per USB verbinden.','Optional Auto-Refresh über Wi-Fi/USB verwenden.'],primary:'Sideloadly öffnen ↗'},
  tv:{title:'Sideloadly oder atvloadly für Apple TV',text:'Nutze Sideloadly für den einfachen Desktop-Weg. Wähle atvloadly, wenn du ausdrücklich einen selbst gehosteten Linux/OpenWrt-Workflow möchtest.',steps:['Desktop oder Self-Hosted wählen.','Apple TV koppeln.','IPA mit dem gewählten Tool installieren und pflegen.'],primary:'Sideloadly öffnen ↗',secondary:'atvloadly ↗'},
  permanent:{title:'Zuerst TrollStore-Kompatibilität prüfen',text:'TrollStore kann IPA-Dateien nur auf unterstützten iOS/iPadOS-Versionen dauerhaft installieren. Eine neuere Version nicht automatisch als kompatibel ansehen.',steps:['Genaue iOS/iPadOS-Version prüfen.','Mit den offiziellen TrollStore-Angaben vergleichen.','Bei fehlender Unterstützung einen anderen Sideloading-Weg verwenden.'],primary:'TrollStore öffnen ↗'}
};
GUIDE_RECOMMENDATIONS.es = {
  iphone:{title:'SideStore para renovar desde el iPhone',text:'Para tus propios IPA con el mínimo uso de ordenador tras la configuración, empieza con SideStore. En iOS/iPadOS 27, SideInstaller puede hacer la instalación inicial de SideStore o SideStore + LiveContainer directamente en el dispositivo.',steps:['Conecta Wi-Fi y activa LocalDevVPN.','En iOS/iPadOS 27 usa SideInstaller; en otras versiones compatibles usa la configuración normal de SideStore.','Renueva antes de que caduque la firma gratuita.'],primary:'Abrir guía SideStore ↗',secondary:'SideInstaller ↗'},
  refresh:{title:'Empieza con LocalDevVPN y una renovación manual',text:'Para diagnosticar la renovación, primero demuestra que Refresh All funciona manualmente. Después limita el problema a pairing, certificado, inicio de sesión o automatización.',steps:['Conéctate a Wi-Fi.','Activa LocalDevVPN.','Haz una renovación manual y luego usa los filtros de solución de problemas.'],primary:'Abrir solución de problemas ↓',url:'#troubleshooting'},
  many:{title:'LiveContainer + SideStore',text:'Usa LiveContainer cuando necesites muchas apps IPA invitadas sin gastar un slot normal de la cuenta gratuita por cada app invitada.',steps:['Instala la configuración combinada LC+SS.','Importa o comparte correctamente el certificado de firma.','Renueva el contenedor / SideStore; las apps invitadas se ejecutan en LiveContainer.'],primary:'Abrir guía LiveContainer ↗',secondary:'Solución de problemas ↓',secondaryUrl:'#troubleshooting'},
  desktop:{title:'Sideloadly',text:'Si instalas principalmente desde Windows o macOS, Sideloadly es la ruta de escritorio directa y puede volver a firmar apps cuando el dispositivo está disponible.',steps:['Instala Sideloadly en Windows o macOS.','Conecta el dispositivo por USB para la configuración.','Usa auto-refresh por Wi-Fi/USB si encaja con tu flujo.'],primary:'Abrir Sideloadly ↗'},
  tv:{title:'Sideloadly o atvloadly para Apple TV',text:'Usa Sideloadly para la ruta sencilla de escritorio. Elige atvloadly si quieres específicamente un flujo autoalojado en Linux/OpenWrt.',steps:['Elige escritorio o autoalojado.','Empareja el Apple TV.','Instala y mantén tu IPA con la herramienta elegida.'],primary:'Abrir Sideloadly ↗',secondary:'atvloadly ↗'},
  permanent:{title:'Comprueba primero la compatibilidad de TrollStore',text:'TrollStore solo puede instalar IPA permanentemente en versiones compatibles de iOS/iPadOS. No des por hecho que una versión más nueva es compatible.',steps:['Comprueba tu versión exacta de iOS/iPadOS.','Compárala con la información oficial de TrollStore.','Si no es compatible, usa otra ruta de sideloading.'],primary:'Abrir TrollStore ↗'}
};
GUIDE_RECOMMENDATIONS.fr = {
  iphone:{title:'SideStore pour actualiser depuis l’iPhone',text:'Pour vos propres IPA avec le moins possible d’utilisation de l’ordinateur après la configuration, commencez par SideStore. Sous iOS/iPadOS 27, SideInstaller peut effectuer l’installation initiale de SideStore ou SideStore + LiveContainer directement sur l’appareil.',steps:['Connecter le Wi-Fi et activer LocalDevVPN.','Sous iOS/iPadOS 27 utiliser SideInstaller ; sur les autres versions compatibles utiliser la configuration SideStore normale.','Actualiser avant l’expiration de la signature gratuite.'],primary:'Ouvrir le guide SideStore ↗',secondary:'SideInstaller ↗'},
  refresh:{title:'Commencer par LocalDevVPN et un refresh manuel',text:'Pour diagnostiquer un problème de refresh, vérifiez d’abord qu’un Refresh All manuel fonctionne. Ensuite, ciblez le pairing, le certificat, la connexion ou l’automatisation utilisée.',steps:['Se connecter au Wi-Fi.','Activer LocalDevVPN.','Faire un refresh manuel puis utiliser les filtres de dépannage ci-dessous.'],primary:'Ouvrir le dépannage ↓',url:'#troubleshooting'},
  many:{title:'LiveContainer + SideStore',text:'Utilisez LiveContainer lorsque vous avez besoin de nombreuses apps IPA invitées sans consommer un slot normal du compte gratuit pour chaque app invitée.',steps:['Installer la configuration combinée LC+SS.','Importer ou partager correctement le certificat de signature.','Actualiser le conteneur / SideStore ; les apps invitées s’exécutent dans LiveContainer.'],primary:'Ouvrir le guide LiveContainer ↗',secondary:'Dépannage ↓',secondaryUrl:'#troubleshooting'},
  desktop:{title:'Sideloadly',text:'Si vous installez surtout depuis Windows ou macOS, Sideloadly est la voie bureau directe et peut re-signer les apps lorsque votre appareil est accessible.',steps:['Installer Sideloadly sous Windows ou macOS.','Connecter l’appareil en USB pour la configuration.','Utiliser l’auto-refresh Wi-Fi/USB si cela convient à votre usage.'],primary:'Ouvrir Sideloadly ↗'},
  tv:{title:'Sideloadly ou atvloadly pour Apple TV',text:'Utilisez Sideloadly pour la voie bureau simple. Choisissez atvloadly si vous souhaitez spécifiquement un workflow Linux/OpenWrt auto-hébergé.',steps:['Choisir bureau ou auto-hébergé.','Appairer l’Apple TV.','Installer et maintenir l’IPA avec l’outil choisi.'],primary:'Ouvrir Sideloadly ↗',secondary:'atvloadly ↗'},
  permanent:{title:'Vérifier d’abord la compatibilité TrollStore',text:'TrollStore ne peut installer des IPA de façon permanente que sur les versions iOS/iPadOS prises en charge. Ne supposez pas qu’une version plus récente est compatible.',steps:['Vérifier la version exacte d’iOS/iPadOS.','La comparer aux informations officielles TrollStore.','Utiliser une autre méthode de sideloading si elle n’est pas prise en charge.'],primary:'Ouvrir TrollStore ↗'}
};

const GUIDE_RECOMMENDATION_ROUTES = Object.freeze({
  iphone: Object.freeze({
    primary: Object.freeze({role:'iphone-refresh', index:0}),
    secondary: Object.freeze({role:'iphone-refresh', index:1})
  }),
  many: Object.freeze({
    primary: Object.freeze({role:'many-apps', index:0})
  }),
  desktop: Object.freeze({
    primary: Object.freeze({role:'desktop-install', index:0})
  }),
  tv: Object.freeze({
    primary: Object.freeze({role:'apple-tv', index:0}),
    secondary: Object.freeze({role:'apple-tv', index:1})
  }),
  permanent: Object.freeze({
    primary: Object.freeze({role:'permanent', index:0})
  })
});

function recommendationToolURL(goal, slot, fallback) {
  return routeToolURL(GUIDE_RECOMMENDATION_ROUTES[goal]?.[slot], fallback);
}

function copyForLanguage() {
  return GUIDE_COPY[root.lang] || GUIDE_COPY.en;
}

function recommendationsForLanguage() {
  return GUIDE_RECOMMENDATIONS[root.lang] || GUIDE_RECOMMENDATIONS.en;
}

let activeGoal = null;

function applyGuideCopy() {
  const copy = copyForLanguage();
  $$('[data-guide-copy]').forEach(node => {
    const value = copy[node.dataset.guideCopy];
    if (value) node.textContent = value;
  });
  if (activeGoal) renderRecommendation(activeGoal);
}

function setRecommendationLink(node, label, url) {
  if (!node) return;
  if (!label || !url) {
    node.hidden = true;
    return;
  }
  node.hidden = false;
  node.textContent = label;
  node.href = url;
  const external = /^https?:/i.test(url);
  if (external) {
    node.target = '_blank';
    node.rel = 'noopener noreferrer';
  } else {
    node.removeAttribute('target');
    node.removeAttribute('rel');
  }
}

function renderRecommendation(goal) {
  const rec = recommendationsForLanguage()[goal] || GUIDE_RECOMMENDATIONS.en[goal];
  const box = $('#guideRecommendation');
  if (!rec || !box) return;

  activeGoal = goal;
  $$('.guide-goal').forEach(button => button.classList.toggle('active', button.dataset.guideGoal === goal));
  $('#guideRecommendationTitle').textContent = rec.title;
  $('#guideRecommendationText').textContent = rec.text;
  $('#guideRecommendationSteps').innerHTML = rec.steps.map((step, index) => `<div><span>${index + 1}</span><p>${step}</p></div>`).join('');
  setRecommendationLink(
    $('#guideRecommendationPrimary'),
    rec.primary,
    recommendationToolURL(goal, 'primary', rec.url)
  );
  setRecommendationLink(
    $('#guideRecommendationSecondary'),
    rec.secondary,
    recommendationToolURL(goal, 'secondary', rec.secondaryUrl)
  );
  box.hidden = false;
}

function updateReportLink() {
  const link = $('#guideReportIssue');
  if (!link) return;
  const query = ($('#troubleSearch')?.value || '').trim();
  const diagnosticRaw = ($('#assistantTroubleSearch')?.value || '').trim();
  const queryMatch = query ? getTroubleMatches(resolvedTroubleQuery(query))[0]?.item : null;
  const queryLabel = queryMatch?.querySelector('summary')?.textContent?.trim() || (query ? 'custom search' : '—');
  const diagnosticKey = extractKnownError(diagnosticRaw) || diagnosisState.currentKey || '—';
  const copy = copyForLanguage();
  const goalText = activeGoal ? (recommendationsForLanguage()[activeGoal]?.title || activeGoal) : '—';
  const body = [
    '### iOS Hub troubleshooting report',
    '',
    `- Language: ${root.lang || 'en'}`,
    `- Selected guide path: ${goalText}`,
    `- Installer focus: ${selectedTroubleshootingTool()?.label || 'Help me choose'}`,
    `- Troubleshooting match: ${queryLabel}`,
    `- Diagnostic code/key: ${diagnosticKey}`,
    `- Current diagnosis: ${$('#assistantDiagnosisTitle')?.textContent?.trim() || '—'}`,
    `- Already tried: ${diagnosisState.tried.size ? [...diagnosisState.tried].join(', ') : '—'}`,
    `- Help-center mode: ${activeHelpMode}`,
    `- Setup wizard: ${Object.entries(setupState).map(([key,value]) => key + '=' + (value || '—')).join(', ')}`,
    '- iOS/iPadOS version: ',
    '- Device: ',
    '- App / tool and version: ',
    '',
    '### What happened',
    '',
    'Describe the error and what you already tried.'
  ].join('\n');
  link.href = `https://github.com/CaseyCZ/iOS-Hub/issues/new?title=${encodeURIComponent('Sideloading help / troubleshooting')}&body=${encodeURIComponent(body)}`;
  link.textContent = copy.reportHelpButton;
}

function applyTheme(theme) {
  const value = theme === 'light' ? 'light' : 'dark';
  root.dataset.theme = value;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#070b14' : '#eef3f8');
  const button = $('#themeToggle');
  if (button) button.textContent = value === 'dark' ? '☀' : '☾';
  safeSet('caseycz-theme', value);
}

function applyLanguage(value) {
  const lang = normalizeLanguage(value);
  root.lang = lang;
  applyTranslations(lang);
  applyGuideCopy();
  applyHelpCopy();
  const select = $('#languageSelect');
  if (select) select.value = lang;
  document.title = `${helpCopyForLanguage().pageTitle} — iOS Hub`;
  safeSet('caseycz-language', lang);
  updateReportLink();
}

let supportReturnFocus = null;

function openSupport() {
  const modal = $('#supportModal');
  supportReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modal?.classList.add('open');
  document.body.classList.add('modal-open');
  modal?.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => modal?.querySelector('[data-support-close]')?.focus());
}

function closeSupport() {
  const modal = $('#supportModal');
  const wasOpen = modal?.classList.contains('open');
  modal?.classList.remove('open');
  document.body.classList.remove('modal-open');
  modal?.setAttribute('aria-hidden', 'true');
  if (wasOpen && supportReturnFocus) {
    const target = supportReturnFocus;
    supportReturnFocus = null;
    requestAnimationFrame(() => target.focus?.());
  }
}

function filterTroubleshooting() {
  const q = ($('#troubleSearch')?.value || '').trim().toLowerCase();
  let visible = 0;
  $$('.trouble-item').forEach(item => {
    const haystack = [item.dataset.search || '', item.textContent || ''].join(' ').toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    const inToolScope = !selectedTroubleToolId || !item.dataset.tool || item.dataset.tool === selectedTroubleToolId;
    const show = inToolScope && (!q || terms.some(term => haystack.includes(term)));
    item.hidden = !show;
    if (show) visible += 1;
  });
  const empty = $('#troubleEmpty');
  if (empty) empty.hidden = visible !== 0;
  $$('.trouble-quick button').forEach(button => {
    button.classList.toggle('active', (button.dataset.troubleFilter || '').toLowerCase() === q);
  });
  updateReportLink();
}

document.addEventListener('click', event => {
  if (!event.target.closest('#guideToolScope')) closeToolScopePicker();

  if (event.target.closest('#guideToolScopeButton')) {
    toggleToolScopePicker();
    return;
  }

  const toolScopeOption = event.target.closest('[data-guide-tool-scope]');
  if (toolScopeOption) {
    setToolScope(toolScopeOption.dataset.guideToolScope || '');
    return;
  }

  if (event.target.closest('[data-support-open]')) return void openSupport();
  if (event.target.closest('[data-support-close]')) return void closeSupport();
  if (event.target.id === 'supportModal') closeSupport();

  const mode = event.target.closest('[data-guide-mode]');
  if (mode) {
    setHelpMode(mode.dataset.guideMode);
    return;
  }

  const setupOption = event.target.closest('[data-setup-key]');
  if (setupOption) {
    selectSetupOption(setupOption);
    return;
  }

  const assistantFilter = event.target.closest('[data-assistant-trouble-filter]');
  if (assistantFilter) {
    const input = $('#assistantTroubleSearch');
    if (input) input.value = assistantFilter.dataset.assistantTroubleFilter || '';
    diagnosisState.dismissed.clear();
    diagnosisState.currentKey = null;
    updateAssistantTroubleSummary();
    renderAssistantDiagnosis(true);
    $$('.assistant-trouble-chips button').forEach(button => button.classList.toggle('active', button === assistantFilter));
    return;
  }

  if (event.target.closest('#assistantTroubleClear')) {
    const input = $('#assistantTroubleSearch');
    if (input) input.value = '';
    diagnosisState.dismissed.clear();
    diagnosisState.currentKey = null;
    diagnosisState.tried.clear();
    $$('.assistant-trouble-chips button').forEach(button => button.classList.remove('active'));
    $$('.assistant-tried-options button').forEach(button => { button.classList.remove('active'); button.setAttribute('aria-pressed','false'); });
    updateAssistantTroubleSummary();
    renderAssistantDiagnosis(true);
    input?.focus();
    return;
  }

  if (event.target.closest('#assistantShowFixes') || event.target.closest('#assistantDiagnosisShowAll')) {
    const source = $('#assistantTroubleSearch');
    const input = $('#troubleSearch');
    if (input) input.value = resolvedTroubleQuery(source?.value || '');
    renderAssistantDiagnosis(true);
    filterTroubleshooting();
    $('#troubleshooting')?.scrollIntoView({ behavior:preferredScrollBehavior(), block:'start' });
    return;
  }

  if (event.target.closest('#assistantDiagnosisCopy')) {
    copyDiagnosisLink();
    return;
  }

  const triedButton = event.target.closest('[data-tried-key]');
  if (triedButton) {
    toggleTriedCheck(triedButton);
    return;
  }

  if (event.target.closest('#assistantTriedReset')) {
    resetTriedChecks();
    return;
  }

  if (event.target.closest('#assistantDiagnosisDidntHelp')) {
    showNextDiagnosis();
    return;
  }

  if (event.target.closest('#setupReset')) {
    resetSetup();
    return;
  }

  const goal = event.target.closest('[data-guide-goal]');
  if (goal) {
    renderRecommendation(goal.dataset.guideGoal);
    $('#guideRecommendation')?.scrollIntoView({ behavior:preferredScrollBehavior(), block:'nearest' });
    updateReportLink();
    return;
  }

  const troubleFilter = event.target.closest('[data-trouble-filter]');
  if (troubleFilter) {
    const input = $('#troubleSearch');
    if (input) {
      input.value = troubleFilter.dataset.troubleFilter || '';
      filterTroubleshooting();
      $('#troubleshooting')?.scrollIntoView({ behavior:preferredScrollBehavior(), block:'start' });
    }
  }
});

document.querySelector('.guide-mode-tabs')?.addEventListener('keydown', handleHelpTabKeydown);

$('#assistantTroubleSearch')?.addEventListener('input', () => {
  diagnosisState.dismissed.clear();
  diagnosisState.currentKey = null;
  $$('.assistant-trouble-chips button').forEach(button => button.classList.remove('active'));
  updateAssistantTroubleSummary();
  renderAssistantDiagnosis(false);
});
$('#troubleSearch')?.addEventListener('input', filterTroubleshooting);
$('#themeToggle')?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
$('#languageSelect')?.addEventListener('change', event => {
  applyLanguage(event.target.value);
  filterTroubleshooting();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  closeToolScopePicker();
  closeSupport();
});

const savedTheme = safeGet('caseycz-theme');
const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (systemDark ? 'dark' : 'light'));

const savedLang = safeGet('caseycz-language');
hydrateGuideToolRegistryReferences();
renderToolScopePicker();
applyLanguage(SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : 'en');

const initialParams = new URLSearchParams(window.location.search);
setToolScope(initialParams.get('tool') || '', false);

if ($('#year')) $('#year').textContent = new Date().getFullYear();
setHelpMode('choose');
updateSetupProgress();
updateAssistantTroubleSummary();
filterTroubleshooting();

const initialFix = initialParams.get('fix');
const initialSetup = initialParams.get('setup');
const initialTried = (initialParams.get('tried') || '').split(',').filter(Boolean);
initialTried.forEach(key => {
  const button = triedButtonForKey(key);
  if (!button) return;
  diagnosisState.tried.add(key);
  button.classList.add('active');
  button.setAttribute('aria-pressed','true');
});
if (initialFix) {
  setHelpMode('fix');
  const input = $('#assistantTroubleSearch');
  if (input) input.value = initialFix;
  updateAssistantTroubleSummary();
  renderAssistantDiagnosis(false);
}
if (initialSetup && loadSetupDeepLink(initialSetup)) {
  setHelpMode('setup');
}

function enableImageFallbacks() {
  document.addEventListener('error', event => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;
    const fallback = img.dataset.fallback;
    if (!fallback || img.dataset.fallbackUsed === '1') return;
    img.dataset.fallbackUsed = '1';
    img.src = fallback;
  }, true);
}
enableImageFallbacks();
