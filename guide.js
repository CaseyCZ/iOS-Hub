import { SUPPORTED_LANGUAGES, applyTranslations, normalizeLanguage, t } from './i18n.js';

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
    sideInstallerTitle:'Install SideStore without a PC on iOS 27', sideInstallerDesc:'SideInstaller installs SideStore or SideStore + LiveContainer fully on-device on iOS 27. iOS 17–26 have partial support when you already have a pairing file created with a computer.', sideInstallerSafety:'Use only sideinstaller.net or the official FrizzleM/SideInstaller GitHub repository when entering Apple account credentials.', sideInstallerOpen:'Open official SideInstaller ↗',
    sideInstallerBest:'On-device SideStore / LiveContainer setup', sideInstallerDevice:'iOS/iPadOS 27; partial 17–26 support with an existing pairing file', sideInstallerComputer:'No PC on iOS 27; older supported versions need a pairing file', sideInstallerRefresh:'Installer only; refreshing is then handled by SideStore',
    troubleChipRefresh:'Refresh', troubleChipLogin:'Apple ID / login', troubleChipPairing:'Pairing', troubleChipCertificate:'Certificate', troubleChipLimits:'App limits', troubleChipLiveContainer:'LiveContainer', troubleChipAltServer:'AltServer', troubleChipAll:'All',
    troubleLoginQ:'Apple ID login fails, HTTP 503 or 2FA does not work', troubleLoginA:'Update the app from its official source first. SideInstaller v1.0.0 specifically notes fixes for HTTP 503 login, support for SMS/call 2FA and saved session IDs to reduce repeated sign-ins. If the error continues, wait before retrying repeatedly and verify you are using the official build.',
    troubleAutoRefreshQ:'LiveContainer + SideStore does not refresh automatically', troubleAutoRefreshA:'First confirm Wi-Fi and LocalDevVPN are active and that a manual Refresh All works. If manual refresh works but automation does not, use manual refresh as the fallback and check the release notes for the exact LC+SS build or Shortcut you installed, because background automation can differ between builds.',
    troublePairingExpireQ:'SideStore pairing stopped working after an iOS update or reset', troublePairingExpireA:'SideStore documents that pairing files can expire after an update or device reset, and can sometimes expire unexpectedly. Replace the pairing file using the current SideStore installation guide, then reconnect LocalDevVPN and refresh SideStore again.',
    reportHelpTitle:'Still not working?', reportHelpDesc:'Open a pre-filled GitHub report with the selected problem so it is easier to diagnose.', reportHelpButton:'Report this problem ↗'
  },
  cs: {
    assistantEyebrow:'RYCHLÁ VOLBA', assistantTitle:'Co chceš udělat?', assistantDesc:'Vyber svůj cíl. iOS Hub ti doporučí nejvhodnější cestu a potom můžeš otevřít podrobný návod.',
    goalIphone:'Instalovat IPA a obnovovat z iPhonu', goalRefresh:'Nefunguje mi refresh', goalMany:'Chci hodně IPA aplikací', goalDesktop:'Instalovat hlavně z počítače', goalTv:'Instalovat aplikace na Apple TV', goalPermanent:'Trvalá instalace na podporovaném iOS',
    recommendationLabel:'DOPORUČENÁ CESTA',
    sideInstallerTitle:'SideStore bez PC na iOS 27', sideInstallerDesc:'SideInstaller umí na iOS 27 nainstalovat SideStore nebo SideStore + LiveContainer přímo v zařízení. iOS 17–26 má částečnou podporu, pokud už máš pairing soubor vytvořený pomocí počítače.', sideInstallerSafety:'Při zadávání Apple účtu používej pouze sideinstaller.net nebo oficiální GitHub FrizzleM/SideInstaller.', sideInstallerOpen:'Otevřít oficiální SideInstaller ↗',
    sideInstallerBest:'Instalace SideStore / LiveContainer přímo v zařízení', sideInstallerDevice:'iOS/iPadOS 27; částečně 17–26 s existujícím pairing souborem', sideInstallerComputer:'Na iOS 27 bez PC; starší podporované verze potřebují pairing soubor', sideInstallerRefresh:'Je to instalátor; další obnovování řeší SideStore',
    troubleChipRefresh:'Refresh', troubleChipLogin:'Apple ID / přihlášení', troubleChipPairing:'Pairing', troubleChipCertificate:'Certifikát', troubleChipLimits:'Limity aplikací', troubleChipLiveContainer:'LiveContainer', troubleChipAltServer:'AltServer', troubleChipAll:'Vše',
    troubleLoginQ:'Selže přihlášení Apple ID, HTTP 503 nebo 2FA', troubleLoginA:'Nejdřív aktualizuj aplikaci z jejího oficiálního zdroje. SideInstaller v1.0.0 výslovně uvádí opravu HTTP 503 při přihlášení, podporu 2FA přes SMS/volání a ukládání session ID kvůli omezení opakovaných přihlášení. Pokud chyba pokračuje, nezkoušej přihlášení stále dokola a ověř, že používáš oficiální build.',
    troubleAutoRefreshQ:'LiveContainer + SideStore se automaticky neobnovuje', troubleAutoRefreshA:'Nejdřív ověř Wi-Fi, zapnutý LocalDevVPN a že ruční Refresh All funguje. Pokud ruční obnova funguje, ale automatika ne, používej ruční refresh jako zálohu a zkontroluj poznámky k přesné LC+SS verzi nebo Shortcutu, který používáš — automatizace na pozadí se může mezi buildy lišit.',
    troublePairingExpireQ:'SideStore pairing přestal fungovat po aktualizaci nebo resetu iOS', troublePairingExpireA:'SideStore uvádí, že pairing soubor může po aktualizaci nebo resetu zařízení expirovat a někdy může přestat platit i nečekaně. Nahraď ho podle aktuálního instalačního návodu SideStore, znovu připoj LocalDevVPN a obnov SideStore.',
    reportHelpTitle:'Pořád to nejde?', reportHelpDesc:'Otevři předvyplněné hlášení na GitHubu s vybraným problémem, aby šla chyba rychleji dohledat.', reportHelpButton:'Nahlásit tento problém ↗'
  },
  de: {
    assistantEyebrow:'SCHNELLAUSWAHL', assistantTitle:'Was möchtest du tun?', assistantDesc:'Wähle dein Ziel. iOS Hub zeigt dir den passendsten Weg und danach kannst du die ausführliche Anleitung öffnen.',
    goalIphone:'IPA installieren und vom iPhone aktualisieren', goalRefresh:'Mein Refresh funktioniert nicht', goalMany:'Ich möchte viele IPA-Apps', goalDesktop:'Hauptsächlich vom Computer installieren', goalTv:'Apps auf Apple TV installieren', goalPermanent:'Dauerhafte Installation auf unterstütztem iOS',
    recommendationLabel:'EMPFEHLUNG',
    sideInstallerTitle:'SideStore ohne PC auf iOS 27 installieren', sideInstallerDesc:'SideInstaller installiert SideStore oder SideStore + LiveContainer auf iOS 27 vollständig auf dem Gerät. iOS 17–26 wird teilweise unterstützt, wenn bereits eine mit einem Computer erstellte Pairing-Datei vorhanden ist.', sideInstallerSafety:'Bei der Eingabe deines Apple-Accounts nur sideinstaller.net oder das offizielle GitHub-Repository FrizzleM/SideInstaller verwenden.', sideInstallerOpen:'Offiziellen SideInstaller öffnen ↗',
    sideInstallerBest:'SideStore / LiveContainer direkt auf dem Gerät einrichten', sideInstallerDevice:'iOS/iPadOS 27; teilweise 17–26 mit vorhandener Pairing-Datei', sideInstallerComputer:'Auf iOS 27 kein PC; ältere unterstützte Versionen benötigen eine Pairing-Datei', sideInstallerRefresh:'Nur Installer; die Aktualisierung übernimmt danach SideStore',
    troubleChipRefresh:'Refresh', troubleChipLogin:'Apple ID / Login', troubleChipPairing:'Pairing', troubleChipCertificate:'Zertifikat', troubleChipLimits:'App-Limits', troubleChipLiveContainer:'LiveContainer', troubleChipAltServer:'AltServer', troubleChipAll:'Alle',
    troubleLoginQ:'Apple-ID-Anmeldung, HTTP 503 oder 2FA schlägt fehl', troubleLoginA:'Aktualisiere die App zuerst aus der offiziellen Quelle. SideInstaller v1.0.0 nennt ausdrücklich Korrekturen für HTTP 503 beim Login, SMS-/Anruf-2FA und gespeicherte Session-IDs, um wiederholte Anmeldungen zu reduzieren. Bei anhaltendem Fehler nicht ständig neu anmelden und die offizielle Version prüfen.',
    troubleAutoRefreshQ:'LiveContainer + SideStore aktualisiert nicht automatisch', troubleAutoRefreshA:'Prüfe zuerst Wi-Fi, LocalDevVPN und ob ein manuelles Refresh All funktioniert. Wenn manuell alles klappt, aber die Automatik nicht, nutze den manuellen Refresh als Fallback und prüfe die Hinweise genau zu deinem LC+SS-Build oder Shortcut.',
    troublePairingExpireQ:'SideStore-Pairing funktioniert nach iOS-Update oder Reset nicht mehr', troublePairingExpireA:'SideStore weist darauf hin, dass Pairing-Dateien nach einem Update oder Geräte-Reset ablaufen können und manchmal auch unerwartet ungültig werden. Ersetze die Pairing-Datei nach der aktuellen SideStore-Anleitung und verbinde danach LocalDevVPN erneut.',
    reportHelpTitle:'Funktioniert es immer noch nicht?', reportHelpDesc:'Öffne einen vorausgefüllten GitHub-Bericht mit dem ausgewählten Problem.', reportHelpButton:'Problem melden ↗'
  },
  es: {
    assistantEyebrow:'ELECCIÓN RÁPIDA', assistantTitle:'¿Qué quieres hacer?', assistantDesc:'Elige tu objetivo. iOS Hub te mostrará la ruta más adecuada y después podrás abrir la guía detallada.',
    goalIphone:'Instalar IPA y renovarlas desde el iPhone', goalRefresh:'Mi renovación no funciona', goalMany:'Quiero muchas apps IPA', goalDesktop:'Instalar principalmente desde un ordenador', goalTv:'Instalar apps en Apple TV', goalPermanent:'Instalación permanente en iOS compatible',
    recommendationLabel:'RECOMENDACIÓN',
    sideInstallerTitle:'Instalar SideStore sin PC en iOS 27', sideInstallerDesc:'SideInstaller instala SideStore o SideStore + LiveContainer completamente desde el dispositivo en iOS 27. iOS 17–26 tiene compatibilidad parcial si ya tienes un archivo de emparejamiento creado con un ordenador.', sideInstallerSafety:'Al introducir tu cuenta Apple usa solo sideinstaller.net o el repositorio oficial FrizzleM/SideInstaller en GitHub.', sideInstallerOpen:'Abrir SideInstaller oficial ↗',
    sideInstallerBest:'Configurar SideStore / LiveContainer desde el dispositivo', sideInstallerDevice:'iOS/iPadOS 27; compatibilidad parcial 17–26 con archivo de emparejamiento existente', sideInstallerComputer:'Sin PC en iOS 27; versiones anteriores compatibles necesitan archivo de emparejamiento', sideInstallerRefresh:'Solo instala; después la renovación la gestiona SideStore',
    troubleChipRefresh:'Renovación', troubleChipLogin:'Apple ID / acceso', troubleChipPairing:'Emparejamiento', troubleChipCertificate:'Certificado', troubleChipLimits:'Límites de apps', troubleChipLiveContainer:'LiveContainer', troubleChipAltServer:'AltServer', troubleChipAll:'Todo',
    troubleLoginQ:'Falla el acceso con Apple ID, HTTP 503 o 2FA', troubleLoginA:'Actualiza primero la app desde su fuente oficial. SideInstaller v1.0.0 indica correcciones para HTTP 503 al iniciar sesión, 2FA por SMS/llamada y reutilización de sesiones para reducir accesos repetidos. Si continúa el error, evita reintentar continuamente y verifica que usas la versión oficial.',
    troubleAutoRefreshQ:'LiveContainer + SideStore no se renueva automáticamente', troubleAutoRefreshA:'Comprueba primero Wi-Fi, LocalDevVPN y que Refresh All funcione manualmente. Si la renovación manual funciona pero la automática no, úsala como alternativa y revisa las notas de la versión exacta de LC+SS o del Shortcut que utilizas.',
    troublePairingExpireQ:'El emparejamiento de SideStore dejó de funcionar tras actualizar o restablecer iOS', troublePairingExpireA:'SideStore documenta que los archivos de emparejamiento pueden caducar tras una actualización o restablecimiento y, a veces, de forma inesperada. Sustituye el archivo según la guía actual de SideStore y vuelve a conectar LocalDevVPN.',
    reportHelpTitle:'¿Sigue sin funcionar?', reportHelpDesc:'Abre un informe de GitHub pre-rellenado con el problema seleccionado.', reportHelpButton:'Reportar este problema ↗'
  },
  fr: {
    assistantEyebrow:'CHOIX RAPIDE', assistantTitle:'Que voulez-vous faire ?', assistantDesc:'Choisissez votre objectif. iOS Hub vous indiquera la méthode la plus adaptée, puis vous pourrez ouvrir le guide détaillé.',
    goalIphone:'Installer des IPA et les actualiser depuis l’iPhone', goalRefresh:'Mon actualisation ne fonctionne pas', goalMany:'Je veux beaucoup d’apps IPA', goalDesktop:'Installer surtout depuis un ordinateur', goalTv:'Installer des apps sur Apple TV', goalPermanent:'Installation permanente sur iOS compatible',
    recommendationLabel:'RECOMMANDATION',
    sideInstallerTitle:'Installer SideStore sans PC sur iOS 27', sideInstallerDesc:'SideInstaller installe SideStore ou SideStore + LiveContainer entièrement sur l’appareil avec iOS 27. iOS 17–26 est partiellement pris en charge si vous disposez déjà d’un fichier d’appairage créé avec un ordinateur.', sideInstallerSafety:'Pour saisir votre compte Apple, utilisez uniquement sideinstaller.net ou le dépôt GitHub officiel FrizzleM/SideInstaller.', sideInstallerOpen:'Ouvrir SideInstaller officiel ↗',
    sideInstallerBest:'Configurer SideStore / LiveContainer sur l’appareil', sideInstallerDevice:'iOS/iPadOS 27 ; prise en charge partielle 17–26 avec fichier d’appairage existant', sideInstallerComputer:'Pas de PC sous iOS 27 ; les anciennes versions prises en charge nécessitent un fichier d’appairage', sideInstallerRefresh:'Installateur uniquement ; l’actualisation est ensuite gérée par SideStore',
    troubleChipRefresh:'Actualisation', troubleChipLogin:'Apple ID / connexion', troubleChipPairing:'Appairage', troubleChipCertificate:'Certificat', troubleChipLimits:'Limites d’apps', troubleChipLiveContainer:'LiveContainer', troubleChipAltServer:'AltServer', troubleChipAll:'Tout',
    troubleLoginQ:'Échec de connexion Apple ID, HTTP 503 ou 2FA', troubleLoginA:'Mettez d’abord l’app à jour depuis sa source officielle. SideInstaller v1.0.0 mentionne des correctifs pour HTTP 503 à la connexion, la 2FA par SMS/appel et la réutilisation des sessions afin de limiter les connexions répétées. Si l’erreur persiste, évitez les tentatives en boucle et vérifiez que vous utilisez la version officielle.',
    troubleAutoRefreshQ:'LiveContainer + SideStore ne s’actualise pas automatiquement', troubleAutoRefreshA:'Vérifiez d’abord le Wi-Fi, LocalDevVPN et qu’un Refresh All manuel fonctionne. Si l’actualisation manuelle fonctionne mais pas l’automatique, utilisez-la comme solution de secours et consultez les notes de votre build LC+SS ou Shortcut exact.',
    troublePairingExpireQ:'L’appairage SideStore ne fonctionne plus après une mise à jour ou réinitialisation iOS', troublePairingExpireA:'SideStore indique que les fichiers d’appairage peuvent expirer après une mise à jour ou réinitialisation et parfois de façon inattendue. Remplacez le fichier selon le guide SideStore actuel puis reconnectez LocalDevVPN.',
    reportHelpTitle:'Toujours en panne ?', reportHelpDesc:'Ouvrez un rapport GitHub prérempli avec le problème sélectionné.', reportHelpButton:'Signaler ce problème ↗'
  }
};

const HELP_COPY = {
  en: {
    pageEyebrow:'HELP CENTER · GUIDES · FIXES', pageTitle:'Sideloading Help Center', pageDesc:'Choose the right sideloading method, diagnose a problem or describe your setup and get a focused path in a few taps.',
    centerEyebrow:'IOS HUB HELP CENTER', centerTitle:'How can we help?', centerDesc:'Start with one of the three paths below. You can change direction at any time without losing the rest of the guide.',
    modeChooseTitle:'Choose a method', modeChooseDesc:'Tell us what you want to do', modeFixTitle:'Fix a problem', modeFixDesc:'Search by symptom or error', modeSetupTitle:'My setup', modeSetupDesc:'Build a recommendation from your device',
    chooseTitle:'What do you want to do?', chooseDesc:'Pick the closest goal. We will show a practical starting point and the next three steps.',
    fixTitle:'What is not working?', fixDesc:'Paste part of an error message or pick a common problem. We will narrow the troubleshooting list below.', fixPlaceholder:'Paste an error: 503, pairing, certificate, refresh…',
    fixRefresh:'Refresh', fixLogin:'Apple ID / 503', fixPairing:'Pairing', fixCertificate:'Certificate', fixLimits:'App limits', fixLiveContainer:'LiveContainer', fixAltServer:'AltServer', fixReady:'Choose a problem or paste an error above.', fixPrivacy:'Everything here is processed locally in your browser.', fixShow:'Show matching fixes ↓', fixCount:'Found {n} matching fixes.',
    setupTitle:'Tell us about your setup', setupDesc:'Four quick choices are enough. The result stays on this page and does not send device information anywhere.', setupDevice:'Device', deviceIphone:'iPhone / iPad', deviceTv:'Apple TV', setupVersion:'System version', versionOlder:'Older / supported legacy', versionUnknown:'Not sure', setupComputer:'Computer access', computerNone:'I want no PC', computerSetup:'PC only for setup', computerAvailable:'PC is fine', setupNeed:'Main goal', needIpa:'Install my own IPA', needMany:'Run many apps', needMarketplace:'Alternative marketplace', needPermanent:'Permanent install', setupResultLabel:'YOUR PATH', setupReset:'Start over',
    jumpLabel:'Jump to:', jumpBasics:'Basics', jumpMethods:'Methods', jumpCompatibility:'Compatibility', jumpTroubleshooting:'Troubleshooting'
  },
  cs: {
    pageEyebrow:'CENTRUM POMOCI · NÁVODY · ŘEŠENÍ', pageTitle:'Centrum pomoci se sideloadingem', pageDesc:'Vyber správnou metodu, najdi příčinu problému nebo popiš svoji konfiguraci a během pár klepnutí dostaneš konkrétní postup.',
    centerEyebrow:'IOS HUB CENTRUM POMOCI', centerTitle:'S čím potřebuješ pomoct?', centerDesc:'Začni jednou ze tří cest níže. Kdykoliv můžeš přepnout jinam a zbytek průvodce zůstane dostupný.',
    modeChooseTitle:'Vybrat metodu', modeChooseDesc:'Řekni, co chceš udělat', modeFixTitle:'Vyřešit problém', modeFixDesc:'Hledej podle chyby nebo příznaku', modeSetupTitle:'Moje konfigurace', modeSetupDesc:'Doporučení podle tvého zařízení',
    chooseTitle:'Co chceš udělat?', chooseDesc:'Vyber nejbližší cíl. Ukážeme ti praktický začátek a tři další kroky.',
    fixTitle:'Co nefunguje?', fixDesc:'Vlož část chybové hlášky nebo vyber častý problém. Zúžíme seznam řešení níže.', fixPlaceholder:'Vlož chybu: 503, pairing, certificate, refresh…',
    fixRefresh:'Refresh', fixLogin:'Apple ID / 503', fixPairing:'Pairing', fixCertificate:'Certifikát', fixLimits:'Limity aplikací', fixLiveContainer:'LiveContainer', fixAltServer:'AltServer', fixReady:'Vyber problém nebo vlož chybu výše.', fixPrivacy:'Vše se zpracovává jen lokálně v prohlížeči.', fixShow:'Ukázat odpovídající řešení ↓', fixCount:'Nalezeno odpovídajících řešení: {n}.',
    setupTitle:'Popiš svoji konfiguraci', setupDesc:'Stačí čtyři rychlé volby. Výsledek zůstává na této stránce a informace o zařízení se nikam neposílají.', setupDevice:'Zařízení', deviceIphone:'iPhone / iPad', deviceTv:'Apple TV', setupVersion:'Verze systému', versionOlder:'Starší / podporovaný legacy', versionUnknown:'Nevím', setupComputer:'Přístup k počítači', computerNone:'Nechci PC', computerSetup:'PC jen pro nastavení', computerAvailable:'PC mi nevadí', setupNeed:'Hlavní cíl', needIpa:'Instalovat vlastní IPA', needMany:'Používat hodně aplikací', needMarketplace:'Alternativní marketplace', needPermanent:'Trvalá instalace', setupResultLabel:'TVÁ CESTA', setupReset:'Začít znovu',
    jumpLabel:'Přejít na:', jumpBasics:'Základy', jumpMethods:'Metody', jumpCompatibility:'Kompatibilita', jumpTroubleshooting:'Řešení problémů'
  },
  de: {
    pageEyebrow:'HILFECENTER · ANLEITUNGEN · LÖSUNGEN', pageTitle:'Sideloading-Hilfecenter', pageDesc:'Wähle die passende Methode, diagnostiziere ein Problem oder beschreibe dein Setup und erhalte mit wenigen Klicks einen gezielten Weg.',
    centerEyebrow:'IOS HUB HILFECENTER', centerTitle:'Wobei können wir helfen?', centerDesc:'Starte mit einem der drei Wege. Du kannst jederzeit wechseln, ohne den restlichen Guide zu verlieren.',
    modeChooseTitle:'Methode wählen', modeChooseDesc:'Sag uns, was du tun möchtest', modeFixTitle:'Problem beheben', modeFixDesc:'Nach Symptom oder Fehler suchen', modeSetupTitle:'Mein Setup', modeSetupDesc:'Empfehlung anhand deines Geräts',
    chooseTitle:'Was möchtest du tun?', chooseDesc:'Wähle das passendste Ziel. Wir zeigen einen praktischen Startpunkt und die nächsten drei Schritte.',
    fixTitle:'Was funktioniert nicht?', fixDesc:'Füge einen Teil der Fehlermeldung ein oder wähle ein häufiges Problem. Wir grenzen die Lösungen unten ein.', fixPlaceholder:'Fehler einfügen: 503, Pairing, Zertifikat, Refresh…',
    fixRefresh:'Refresh', fixLogin:'Apple ID / 503', fixPairing:'Pairing', fixCertificate:'Zertifikat', fixLimits:'App-Limits', fixLiveContainer:'LiveContainer', fixAltServer:'AltServer', fixReady:'Wähle ein Problem oder füge oben einen Fehler ein.', fixPrivacy:'Alles wird lokal im Browser verarbeitet.', fixShow:'Passende Lösungen anzeigen ↓', fixCount:'{n} passende Lösungen gefunden.',
    setupTitle:'Beschreibe dein Setup', setupDesc:'Vier kurze Entscheidungen reichen. Das Ergebnis bleibt auf dieser Seite und sendet keine Gerätedaten.', setupDevice:'Gerät', deviceIphone:'iPhone / iPad', deviceTv:'Apple TV', setupVersion:'Systemversion', versionOlder:'Älter / unterstütztes Legacy', versionUnknown:'Nicht sicher', setupComputer:'Computerzugang', computerNone:'Ich will keinen PC', computerSetup:'PC nur fürs Setup', computerAvailable:'PC ist okay', setupNeed:'Hauptziel', needIpa:'Eigene IPA installieren', needMany:'Viele Apps ausführen', needMarketplace:'Alternativer Marketplace', needPermanent:'Dauerhafte Installation', setupResultLabel:'DEIN WEG', setupReset:'Neu starten',
    jumpLabel:'Springen zu:', jumpBasics:'Grundlagen', jumpMethods:'Methoden', jumpCompatibility:'Kompatibilität', jumpTroubleshooting:'Fehlerbehebung'
  },
  es: {
    pageEyebrow:'CENTRO DE AYUDA · GUÍAS · SOLUCIONES', pageTitle:'Centro de ayuda de sideloading', pageDesc:'Elige el método adecuado, diagnostica un problema o describe tu configuración y obtén una ruta concreta en pocos toques.',
    centerEyebrow:'CENTRO DE AYUDA IOS HUB', centerTitle:'¿En qué podemos ayudarte?', centerDesc:'Empieza con una de las tres rutas. Puedes cambiar en cualquier momento sin perder el resto de la guía.',
    modeChooseTitle:'Elegir método', modeChooseDesc:'Dinos qué quieres hacer', modeFixTitle:'Resolver un problema', modeFixDesc:'Buscar por síntoma o error', modeSetupTitle:'Mi configuración', modeSetupDesc:'Recomendación según tu dispositivo',
    chooseTitle:'¿Qué quieres hacer?', chooseDesc:'Elige el objetivo más cercano. Mostraremos un punto de partida práctico y los tres pasos siguientes.',
    fixTitle:'¿Qué no funciona?', fixDesc:'Pega parte del mensaje de error o elige un problema común. Reduciremos la lista de soluciones de abajo.', fixPlaceholder:'Pega un error: 503, pairing, certificado, refresh…',
    fixRefresh:'Refresh', fixLogin:'Apple ID / 503', fixPairing:'Pairing', fixCertificate:'Certificado', fixLimits:'Límites de apps', fixLiveContainer:'LiveContainer', fixAltServer:'AltServer', fixReady:'Elige un problema o pega un error arriba.', fixPrivacy:'Todo se procesa localmente en tu navegador.', fixShow:'Mostrar soluciones coincidentes ↓', fixCount:'Se encontraron {n} soluciones.',
    setupTitle:'Describe tu configuración', setupDesc:'Cuatro elecciones rápidas son suficientes. El resultado permanece en esta página y no envía datos del dispositivo.', setupDevice:'Dispositivo', deviceIphone:'iPhone / iPad', deviceTv:'Apple TV', setupVersion:'Versión del sistema', versionOlder:'Anterior / legacy compatible', versionUnknown:'No estoy seguro', setupComputer:'Acceso a ordenador', computerNone:'No quiero PC', computerSetup:'PC solo para configurar', computerAvailable:'PC está bien', setupNeed:'Objetivo principal', needIpa:'Instalar mi propia IPA', needMany:'Usar muchas apps', needMarketplace:'Marketplace alternativo', needPermanent:'Instalación permanente', setupResultLabel:'TU RUTA', setupReset:'Empezar de nuevo',
    jumpLabel:'Ir a:', jumpBasics:'Conceptos básicos', jumpMethods:'Métodos', jumpCompatibility:'Compatibilidad', jumpTroubleshooting:'Solución de problemas'
  },
  fr: {
    pageEyebrow:'CENTRE D’AIDE · GUIDES · SOLUTIONS', pageTitle:'Centre d’aide au sideloading', pageDesc:'Choisissez la bonne méthode, diagnostiquez un problème ou décrivez votre configuration et obtenez un parcours ciblé en quelques gestes.',
    centerEyebrow:'CENTRE D’AIDE IOS HUB', centerTitle:'Comment pouvons-nous vous aider ?', centerDesc:'Commencez par l’un des trois parcours. Vous pouvez changer à tout moment sans perdre le reste du guide.',
    modeChooseTitle:'Choisir une méthode', modeChooseDesc:'Dites ce que vous voulez faire', modeFixTitle:'Résoudre un problème', modeFixDesc:'Rechercher par symptôme ou erreur', modeSetupTitle:'Ma configuration', modeSetupDesc:'Recommandation selon votre appareil',
    chooseTitle:'Que voulez-vous faire ?', chooseDesc:'Choisissez l’objectif le plus proche. Nous afficherons un point de départ pratique et les trois étapes suivantes.',
    fixTitle:'Qu’est-ce qui ne fonctionne pas ?', fixDesc:'Collez une partie du message d’erreur ou choisissez un problème courant. Nous réduirons la liste des solutions ci-dessous.', fixPlaceholder:'Collez une erreur : 503, pairing, certificat, refresh…',
    fixRefresh:'Refresh', fixLogin:'Apple ID / 503', fixPairing:'Pairing', fixCertificate:'Certificat', fixLimits:'Limites d’apps', fixLiveContainer:'LiveContainer', fixAltServer:'AltServer', fixReady:'Choisissez un problème ou collez une erreur ci-dessus.', fixPrivacy:'Tout est traité localement dans votre navigateur.', fixShow:'Afficher les solutions correspondantes ↓', fixCount:'{n} solutions correspondantes trouvées.',
    setupTitle:'Décrivez votre configuration', setupDesc:'Quatre choix rapides suffisent. Le résultat reste sur cette page et n’envoie aucune donnée sur l’appareil.', setupDevice:'Appareil', deviceIphone:'iPhone / iPad', deviceTv:'Apple TV', setupVersion:'Version du système', versionOlder:'Ancien / legacy compatible', versionUnknown:'Je ne sais pas', setupComputer:'Accès à un ordinateur', computerNone:'Je ne veux pas de PC', computerSetup:'PC seulement pour configurer', computerAvailable:'Un PC me convient', setupNeed:'Objectif principal', needIpa:'Installer mes propres IPA', needMany:'Utiliser beaucoup d’apps', needMarketplace:'Marketplace alternatif', needPermanent:'Installation permanente', setupResultLabel:'VOTRE PARCOURS', setupReset:'Recommencer',
    jumpLabel:'Aller à :', jumpBasics:'Bases', jumpMethods:'Méthodes', jumpCompatibility:'Compatibilité', jumpTroubleshooting:'Dépannage'
  }
};

const SETUP_RESULTS = {
  en: {
    tv:{title:'Apple TV: Sideloadly or atvloadly',text:'For Apple TV, use Sideloadly from Windows/macOS or atvloadly when you want a self-hosted Linux/OpenWrt workflow.',steps:['Choose desktop or self-hosted.','Pair the Apple TV.','Install and refresh through that tool.'],primary:'Open Sideloadly ↗',url:'https://sideloadly.io/',secondary:'atvloadly ↗',secondaryUrl:'https://github.com/bitxeno/atvloadly'},
    marketplace:{title:'Alternative marketplace: AltStore PAL',text:'If you want a supported alternative marketplace rather than arbitrary IPA sideloading, start with AltStore PAL. Availability depends on region.',steps:['Check regional availability.','Install AltStore PAL using the official instructions.','Use marketplace apps without the normal 7-day sideload refresh cycle.'],primary:'Open AltStore PAL ↗',url:'https://faq.altstore.io/altstore-pal/what-is-altstore-pal'},
    permanent:{title:'Check TrollStore compatibility first',text:'Permanent IPA installation is only available on specific supported iOS/iPadOS versions. Verify your exact version before doing anything else.',steps:['Check your exact OS version.','Compare it with the official TrollStore support list.','If unsupported, use SideStore, LiveContainer or Sideloadly instead.'],primary:'Open TrollStore ↗',url:'https://github.com/opa334/TrollStore'},
    sideinstaller:{title:'iOS 27 without a PC: SideInstaller → SideStore',text:'On iOS 27, SideInstaller can perform the initial SideStore setup directly on-device. SideStore then handles normal installs and refreshes.',steps:['Use only the official SideInstaller source.','Install SideStore on-device.','Enable LocalDevVPN when installing or refreshing.'],primary:'Open SideInstaller ↗',url:'https://sideinstaller.net/',secondary:'SideStore docs ↗',secondaryUrl:'https://docs.sidestore.io/'},
    sideinstallerMany:{title:'iOS 27 without a PC: SideInstaller → LiveContainer + SideStore',text:'For many guest apps with no PC on iOS 27, use the combined LiveContainer + SideStore route installed through SideInstaller.',steps:['Install the combined LC+SS build.','Confirm the signing certificate and LocalDevVPN.','Refresh SideStore/container; run guest apps in LiveContainer.'],primary:'Open SideInstaller ↗',url:'https://sideinstaller.net/',secondary:'LC+SS guide ↗',secondaryUrl:'https://livecontainer.github.io/docs/installation/lc_sidestore'},
    livecontainer:{title:'LiveContainer + SideStore',text:'For many IPA apps, LiveContainer keeps guest apps inside one container while SideStore handles signing and refresh.',steps:['Install LC+SS with a supported setup method.','Import the signing certificate correctly.','Keep Wi-Fi and LocalDevVPN ready for refresh.'],primary:'Open LC+SS guide ↗',url:'https://livecontainer.github.io/docs/installation/lc_sidestore',secondary:'Troubleshooting ↓',secondaryUrl:'#troubleshooting'},
    sideloadly:{title:'Sideloadly',text:'If using a computer is fine, Sideloadly is the most direct desktop workflow for installing your own IPA files.',steps:['Install Sideloadly on Windows or macOS.','Connect and trust the device.','Use Wi-Fi/USB re-signing when needed.'],primary:'Open Sideloadly ↗',url:'https://sideloadly.io/'},
    sidestore:{title:'SideStore after one-time setup',text:'If you only want the computer for initial setup, SideStore is a strong fit. On older versions without an existing pairing file, first setup still needs pairing data from a computer.',steps:['Complete the initial pairing/setup.','Enable LocalDevVPN on the device.','Install and refresh from SideStore afterwards.'],primary:'Open SideStore docs ↗',url:'https://docs.sidestore.io/',secondary:'Troubleshooting ↓',secondaryUrl:'#troubleshooting'}
  },
  cs: {
    tv:{title:'Apple TV: Sideloadly nebo atvloadly',text:'Pro Apple TV použij Sideloadly z Windows/macOS nebo atvloadly, pokud chceš vlastní službu na Linuxu/OpenWrt.',steps:['Vyber desktop nebo self-hosted cestu.','Spáruj Apple TV.','Instaluj a obnovuj přes zvolený nástroj.'],primary:'Otevřít Sideloadly ↗',url:'https://sideloadly.io/',secondary:'atvloadly ↗',secondaryUrl:'https://github.com/bitxeno/atvloadly'},
    marketplace:{title:'Alternativní marketplace: AltStore PAL',text:'Pokud chceš podporovaný alternativní marketplace místo libovolného IPA sideloadingu, začni AltStore PAL. Dostupnost závisí na regionu.',steps:['Ověř dostupnost ve svém regionu.','Nainstaluj AltStore PAL podle oficiálního návodu.','Marketplace aplikace nepodléhají běžnému 7dennímu sideload refresh cyklu.'],primary:'Otevřít AltStore PAL ↗',url:'https://faq.altstore.io/altstore-pal/what-is-altstore-pal'},
    permanent:{title:'Nejdřív ověř kompatibilitu TrollStore',text:'Trvalá instalace IPA funguje jen na konkrétních podporovaných verzích iOS/iPadOS. Nejdřív ověř přesnou verzi systému.',steps:['Zjisti přesnou verzi systému.','Porovnej ji s oficiální podporou TrollStore.','Pokud podporovaná není, použij SideStore, LiveContainer nebo Sideloadly.'],primary:'Otevřít TrollStore ↗',url:'https://github.com/opa334/TrollStore'},
    sideinstaller:{title:'iOS 27 bez PC: SideInstaller → SideStore',text:'Na iOS 27 umí SideInstaller provést první instalaci SideStore přímo v zařízení. SideStore pak řeší běžné instalace a obnovování.',steps:['Použij jen oficiální SideInstaller.','Nainstaluj SideStore přímo v zařízení.','Při instalaci a refreshi zapni LocalDevVPN.'],primary:'Otevřít SideInstaller ↗',url:'https://sideinstaller.net/',secondary:'SideStore návod ↗',secondaryUrl:'https://docs.sidestore.io/'},
    sideinstallerMany:{title:'iOS 27 bez PC: SideInstaller → LiveContainer + SideStore',text:'Pro hodně hostovaných aplikací bez PC na iOS 27 použij společnou variantu LiveContainer + SideStore nainstalovanou přes SideInstaller.',steps:['Nainstaluj společný LC+SS build.','Ověř podpisový certifikát a LocalDevVPN.','Obnovuj SideStore/kontejner a hostované aplikace spouštěj v LiveContaineru.'],primary:'Otevřít SideInstaller ↗',url:'https://sideinstaller.net/',secondary:'LC+SS návod ↗',secondaryUrl:'https://livecontainer.github.io/docs/installation/lc_sidestore'},
    livecontainer:{title:'LiveContainer + SideStore',text:'Pro hodně IPA aplikací drží LiveContainer hostované aplikace v jednom kontejneru a SideStore řeší podpis a refresh.',steps:['Nainstaluj LC+SS podporovanou metodou.','Správně importuj podpisový certifikát.','Pro refresh měj připravenou Wi-Fi a LocalDevVPN.'],primary:'Otevřít LC+SS návod ↗',url:'https://livecontainer.github.io/docs/installation/lc_sidestore',secondary:'Řešení problémů ↓',secondaryUrl:'#troubleshooting'},
    sideloadly:{title:'Sideloadly',text:'Pokud ti nevadí používat počítač, Sideloadly je nejpřímější desktopová cesta pro instalaci vlastních IPA.',steps:['Nainstaluj Sideloadly ve Windows nebo macOS.','Připoj zařízení a potvrď důvěru.','Podle potřeby používej obnovování přes Wi-Fi/USB.'],primary:'Otevřít Sideloadly ↗',url:'https://sideloadly.io/'},
    sidestore:{title:'SideStore po jednorázovém nastavení',text:'Pokud chceš počítač jen při prvním nastavení, SideStore je vhodná cesta. Na starších verzích bez existujícího pairing souboru stále potřebuješ pro první instalaci pairing data z počítače.',steps:['Dokonči první pairing a instalaci.','Zapni v zařízení LocalDevVPN.','Pak instaluj a obnovuj přímo ze SideStore.'],primary:'Otevřít SideStore návod ↗',url:'https://docs.sidestore.io/',secondary:'Řešení problémů ↓',secondaryUrl:'#troubleshooting'}
  },
  de: {
    tv:{title:'Apple TV: Sideloadly oder atvloadly',text:'Für Apple TV nutze Sideloadly unter Windows/macOS oder atvloadly für einen selbst gehosteten Linux/OpenWrt-Workflow.',steps:['Desktop oder Self-Hosted wählen.','Apple TV koppeln.','Über das gewählte Tool installieren und aktualisieren.'],primary:'Sideloadly öffnen ↗',url:'https://sideloadly.io/',secondary:'atvloadly ↗',secondaryUrl:'https://github.com/bitxeno/atvloadly'},
    marketplace:{title:'Alternativer Marketplace: AltStore PAL',text:'Wenn du einen unterstützten alternativen Marketplace statt beliebigem IPA-Sideloading möchtest, starte mit AltStore PAL. Die Verfügbarkeit hängt von der Region ab.',steps:['Regionale Verfügbarkeit prüfen.','AltStore PAL nach offizieller Anleitung installieren.','Marketplace-Apps benötigen nicht den normalen 7-Tage-Sideload-Refresh.'],primary:'AltStore PAL öffnen ↗',url:'https://faq.altstore.io/altstore-pal/what-is-altstore-pal'},
    permanent:{title:'Zuerst TrollStore-Kompatibilität prüfen',text:'Dauerhafte IPA-Installation funktioniert nur auf bestimmten unterstützten iOS/iPadOS-Versionen. Prüfe zuerst deine genaue Version.',steps:['Genaue OS-Version prüfen.','Mit der offiziellen TrollStore-Liste vergleichen.','Falls nicht unterstützt, SideStore, LiveContainer oder Sideloadly verwenden.'],primary:'TrollStore öffnen ↗',url:'https://github.com/opa334/TrollStore'},
    sideinstaller:{title:'iOS 27 ohne PC: SideInstaller → SideStore',text:'Unter iOS 27 kann SideInstaller die erste SideStore-Installation direkt auf dem Gerät durchführen. Danach übernimmt SideStore Installation und Refresh.',steps:['Nur den offiziellen SideInstaller verwenden.','SideStore direkt auf dem Gerät installieren.','Für Installation und Refresh LocalDevVPN aktivieren.'],primary:'SideInstaller öffnen ↗',url:'https://sideinstaller.net/',secondary:'SideStore-Doku ↗',secondaryUrl:'https://docs.sidestore.io/'},
    sideinstallerMany:{title:'iOS 27 ohne PC: SideInstaller → LiveContainer + SideStore',text:'Für viele Gast-Apps ohne PC unter iOS 27 nutze die kombinierte LiveContainer + SideStore-Variante über SideInstaller.',steps:['Kombinierten LC+SS-Build installieren.','Signaturzertifikat und LocalDevVPN prüfen.','SideStore/Container aktualisieren und Gast-Apps in LiveContainer starten.'],primary:'SideInstaller öffnen ↗',url:'https://sideinstaller.net/',secondary:'LC+SS-Doku ↗',secondaryUrl:'https://livecontainer.github.io/docs/installation/lc_sidestore'},
    livecontainer:{title:'LiveContainer + SideStore',text:'Für viele IPA-Apps hält LiveContainer Gast-Apps in einem Container, während SideStore Signierung und Refresh übernimmt.',steps:['LC+SS mit einer unterstützten Methode installieren.','Signaturzertifikat korrekt importieren.','Wi-Fi und LocalDevVPN für Refresh bereithalten.'],primary:'LC+SS-Doku öffnen ↗',url:'https://livecontainer.github.io/docs/installation/lc_sidestore',secondary:'Fehlerbehebung ↓',secondaryUrl:'#troubleshooting'},
    sideloadly:{title:'Sideloadly',text:'Wenn ein Computer okay ist, ist Sideloadly der direkteste Desktop-Weg für eigene IPA-Dateien.',steps:['Sideloadly unter Windows oder macOS installieren.','Gerät verbinden und vertrauen.','Bei Bedarf über Wi-Fi/USB neu signieren.'],primary:'Sideloadly öffnen ↗',url:'https://sideloadly.io/'},
    sidestore:{title:'SideStore nach einmaligem Setup',text:'Wenn du den Computer nur für die Einrichtung verwenden möchtest, passt SideStore gut. Auf älteren Versionen ohne vorhandene Pairing-Datei werden für die erste Einrichtung weiterhin Pairing-Daten vom Computer benötigt.',steps:['Erstes Pairing/Setup abschließen.','LocalDevVPN auf dem Gerät aktivieren.','Danach direkt in SideStore installieren und aktualisieren.'],primary:'SideStore-Doku öffnen ↗',url:'https://docs.sidestore.io/',secondary:'Fehlerbehebung ↓',secondaryUrl:'#troubleshooting'}
  },
  es: {
    tv:{title:'Apple TV: Sideloadly o atvloadly',text:'Para Apple TV usa Sideloadly desde Windows/macOS o atvloadly si prefieres un flujo autoalojado en Linux/OpenWrt.',steps:['Elige escritorio o autoalojado.','Empareja el Apple TV.','Instala y renueva con la herramienta elegida.'],primary:'Abrir Sideloadly ↗',url:'https://sideloadly.io/',secondary:'atvloadly ↗',secondaryUrl:'https://github.com/bitxeno/atvloadly'},
    marketplace:{title:'Marketplace alternativo: AltStore PAL',text:'Si quieres un marketplace alternativo compatible en vez de sideloading arbitrario de IPA, empieza por AltStore PAL. La disponibilidad depende de la región.',steps:['Comprueba la disponibilidad regional.','Instala AltStore PAL con las instrucciones oficiales.','Las apps del marketplace no usan el ciclo normal de renovación de 7 días.'],primary:'Abrir AltStore PAL ↗',url:'https://faq.altstore.io/altstore-pal/what-is-altstore-pal'},
    permanent:{title:'Comprueba primero la compatibilidad de TrollStore',text:'La instalación permanente de IPA solo funciona en versiones concretas y compatibles de iOS/iPadOS. Verifica tu versión exacta antes de continuar.',steps:['Comprueba tu versión exacta.','Compárala con la lista oficial de TrollStore.','Si no es compatible, usa SideStore, LiveContainer o Sideloadly.'],primary:'Abrir TrollStore ↗',url:'https://github.com/opa334/TrollStore'},
    sideinstaller:{title:'iOS 27 sin PC: SideInstaller → SideStore',text:'En iOS 27, SideInstaller puede realizar la instalación inicial de SideStore directamente en el dispositivo. Después SideStore gestiona instalaciones y renovaciones.',steps:['Usa solo SideInstaller oficial.','Instala SideStore en el dispositivo.','Activa LocalDevVPN al instalar o renovar.'],primary:'Abrir SideInstaller ↗',url:'https://sideinstaller.net/',secondary:'Guía de SideStore ↗',secondaryUrl:'https://docs.sidestore.io/'},
    sideinstallerMany:{title:'iOS 27 sin PC: SideInstaller → LiveContainer + SideStore',text:'Para muchas apps invitadas sin PC en iOS 27, usa la combinación LiveContainer + SideStore instalada con SideInstaller.',steps:['Instala el build combinado LC+SS.','Comprueba el certificado y LocalDevVPN.','Renueva SideStore/contenedor y ejecuta las apps invitadas en LiveContainer.'],primary:'Abrir SideInstaller ↗',url:'https://sideinstaller.net/',secondary:'Guía LC+SS ↗',secondaryUrl:'https://livecontainer.github.io/docs/installation/lc_sidestore'},
    livecontainer:{title:'LiveContainer + SideStore',text:'Para muchas apps IPA, LiveContainer mantiene las apps invitadas dentro de un contenedor y SideStore gestiona firma y renovación.',steps:['Instala LC+SS con un método compatible.','Importa correctamente el certificado de firma.','Ten Wi-Fi y LocalDevVPN listos para renovar.'],primary:'Abrir guía LC+SS ↗',url:'https://livecontainer.github.io/docs/installation/lc_sidestore',secondary:'Solución de problemas ↓',secondaryUrl:'#troubleshooting'},
    sideloadly:{title:'Sideloadly',text:'Si usar un ordenador te parece bien, Sideloadly es la ruta de escritorio más directa para instalar tus propias IPA.',steps:['Instala Sideloadly en Windows o macOS.','Conecta y confía en el dispositivo.','Renueva por Wi-Fi/USB cuando sea necesario.'],primary:'Abrir Sideloadly ↗',url:'https://sideloadly.io/'},
    sidestore:{title:'SideStore tras una configuración inicial',text:'Si solo quieres usar el ordenador para la configuración inicial, SideStore encaja bien. En versiones antiguas sin un archivo de emparejamiento existente, la primera configuración aún necesita datos de emparejamiento desde un ordenador.',steps:['Completa el emparejamiento/configuración inicial.','Activa LocalDevVPN en el dispositivo.','Después instala y renueva directamente desde SideStore.'],primary:'Abrir guía SideStore ↗',url:'https://docs.sidestore.io/',secondary:'Solución de problemas ↓',secondaryUrl:'#troubleshooting'}
  },
  fr: {
    tv:{title:'Apple TV : Sideloadly ou atvloadly',text:'Pour Apple TV, utilisez Sideloadly sous Windows/macOS ou atvloadly pour un workflow auto-hébergé Linux/OpenWrt.',steps:['Choisir bureau ou auto-hébergé.','Appairer l’Apple TV.','Installer et actualiser avec l’outil choisi.'],primary:'Ouvrir Sideloadly ↗',url:'https://sideloadly.io/',secondary:'atvloadly ↗',secondaryUrl:'https://github.com/bitxeno/atvloadly'},
    marketplace:{title:'Marketplace alternatif : AltStore PAL',text:'Si vous voulez un marketplace alternatif pris en charge plutôt que le sideloading arbitraire d’IPA, commencez par AltStore PAL. La disponibilité dépend de la région.',steps:['Vérifier la disponibilité régionale.','Installer AltStore PAL avec les instructions officielles.','Les apps du marketplace n’utilisent pas le cycle normal de refresh de 7 jours.'],primary:'Ouvrir AltStore PAL ↗',url:'https://faq.altstore.io/altstore-pal/what-is-altstore-pal'},
    permanent:{title:'Vérifier d’abord la compatibilité TrollStore',text:'L’installation permanente d’IPA ne fonctionne que sur certaines versions iOS/iPadOS prises en charge. Vérifiez votre version exacte avant de continuer.',steps:['Vérifier la version exacte du système.','La comparer à la liste officielle TrollStore.','Si elle n’est pas prise en charge, utiliser SideStore, LiveContainer ou Sideloadly.'],primary:'Ouvrir TrollStore ↗',url:'https://github.com/opa334/TrollStore'},
    sideinstaller:{title:'iOS 27 sans PC : SideInstaller → SideStore',text:'Sous iOS 27, SideInstaller peut effectuer l’installation initiale de SideStore directement sur l’appareil. SideStore gère ensuite installations et actualisations.',steps:['Utiliser uniquement SideInstaller officiel.','Installer SideStore sur l’appareil.','Activer LocalDevVPN pour installer ou actualiser.'],primary:'Ouvrir SideInstaller ↗',url:'https://sideinstaller.net/',secondary:'Guide SideStore ↗',secondaryUrl:'https://docs.sidestore.io/'},
    sideinstallerMany:{title:'iOS 27 sans PC : SideInstaller → LiveContainer + SideStore',text:'Pour de nombreuses apps invitées sans PC sous iOS 27, utilisez la combinaison LiveContainer + SideStore installée via SideInstaller.',steps:['Installer le build combiné LC+SS.','Vérifier le certificat de signature et LocalDevVPN.','Actualiser SideStore/conteneur et lancer les apps invitées dans LiveContainer.'],primary:'Ouvrir SideInstaller ↗',url:'https://sideinstaller.net/',secondary:'Guide LC+SS ↗',secondaryUrl:'https://livecontainer.github.io/docs/installation/lc_sidestore'},
    livecontainer:{title:'LiveContainer + SideStore',text:'Pour de nombreuses apps IPA, LiveContainer garde les apps invitées dans un seul conteneur tandis que SideStore gère signature et actualisation.',steps:['Installer LC+SS avec une méthode prise en charge.','Importer correctement le certificat de signature.','Garder Wi-Fi et LocalDevVPN prêts pour l’actualisation.'],primary:'Ouvrir le guide LC+SS ↗',url:'https://livecontainer.github.io/docs/installation/lc_sidestore',secondary:'Dépannage ↓',secondaryUrl:'#troubleshooting'},
    sideloadly:{title:'Sideloadly',text:'Si utiliser un ordinateur vous convient, Sideloadly est la voie bureau la plus directe pour installer vos propres IPA.',steps:['Installer Sideloadly sous Windows ou macOS.','Connecter l’appareil et lui faire confiance.','Ressigner via Wi-Fi/USB si nécessaire.'],primary:'Ouvrir Sideloadly ↗',url:'https://sideloadly.io/'},
    sidestore:{title:'SideStore après une configuration unique',text:'Si vous voulez utiliser l’ordinateur uniquement pour la configuration initiale, SideStore convient bien. Sur les anciennes versions sans fichier d’appairage existant, la première configuration nécessite encore des données d’appairage créées sur ordinateur.',steps:['Terminer l’appairage/configuration initiale.','Activer LocalDevVPN sur l’appareil.','Ensuite installer et actualiser directement depuis SideStore.'],primary:'Ouvrir le guide SideStore ↗',url:'https://docs.sidestore.io/',secondary:'Dépannage ↓',secondaryUrl:'#troubleshooting'}
  }
};

function helpCopyForLanguage() {
  return HELP_COPY[root.lang] || HELP_COPY.en;
}

function setupResultsForLanguage() {
  return SETUP_RESULTS[root.lang] || SETUP_RESULTS.en;
}

let activeHelpMode = 'choose';
const setupState = { device:null, version:null, computer:null, need:null };

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
  updateAssistantTroubleSummary();
  if (Object.values(setupState).every(Boolean)) renderSetupResult();
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

function troubleMatchCount(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return 0;
  const terms = q.split(/\s+/).filter(Boolean);
  return $$('.trouble-item').filter(item => {
    const haystack = [item.dataset.search || '', item.textContent || ''].join(' ').toLowerCase();
    return terms.some(term => haystack.includes(term));
  }).length;
}

function resolvedTroubleQuery(raw) {
  const q = (raw || '').trim().toLowerCase();
  if (!q) return '';
  if (/503|2fa|two.?factor|apple.?id|sign.?in|login/.test(q)) return 'apple login 503 2fa';
  if (/pair|pairing|anisette/.test(q)) return 'pairing';
  if (/cert|certificate|provision/.test(q)) return 'certificate';
  if (/maximum.*app|app.?id|3.?app|limit/.test(q)) return '3 app limit app ids';
  if (/altserver|server not found|remote server/.test(q)) return 'altserver';
  if (/livecontainer|jit|jitless/.test(q)) return 'livecontainer';
  if (/refresh|expire|7.?day|renew/.test(q)) return 'refresh';
  return q;
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
  if (answered === 4) renderSetupResult();
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
  if (setupState.need === 'marketplace') return 'marketplace';
  if (setupState.need === 'permanent') return 'permanent';
  if (setupState.version === '27' && setupState.computer === 'none') return setupState.need === 'many' ? 'sideinstallerMany' : 'sideinstaller';
  if (setupState.need === 'many') return 'livecontainer';
  if (setupState.computer === 'available') return 'sideloadly';
  return 'sidestore';
}

function renderSetupResult() {
  if (!Object.values(setupState).every(Boolean)) return;
  const result = setupResultsForLanguage()[chooseSetupResultKey()] || SETUP_RESULTS.en[chooseSetupResultKey()];
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
  setRecommendationLink($('#setupResultPrimary'), result.primary, result.url);
  setRecommendationLink($('#setupResultSecondary'), result.secondary, result.secondaryUrl);
  box.hidden = false;
  box.scrollIntoView({behavior:'smooth',block:'nearest'});
  updateReportLink();
}

function resetSetup() {
  Object.keys(setupState).forEach(key => { setupState[key] = null; });
  $$('[data-setup-key]').forEach(button => button.classList.remove('active'));
  $('#setupResult').hidden = true;
  updateSetupProgress();
}

const GUIDE_RECOMMENDATIONS = {
  en: {
    iphone:{title:'SideStore for on-device refresh',text:'For your own IPA files with the least computer use after setup, start with SideStore. On iOS 27, SideInstaller can perform the initial SideStore or SideStore + LiveContainer setup directly on-device.',steps:['Connect Wi-Fi and LocalDevVPN.','Use SideInstaller on iOS 27, or the regular SideStore setup on other supported versions.','Refresh before the free signing period expires.'],primary:'Open SideStore docs ↗',url:'https://docs.sidestore.io/',secondary:'SideInstaller ↗',secondaryUrl:'https://sideinstaller.net/'},
    refresh:{title:'Start with LocalDevVPN and a manual refresh',text:'Most refresh troubleshooting starts by proving that a manual refresh works first. Then narrow the problem to pairing, certificate, login or the specific automation you use.',steps:['Connect to Wi-Fi.','Turn on LocalDevVPN.','Run a manual refresh, then use the troubleshooting filters below.'],primary:'Open troubleshooting ↓',url:'#troubleshooting'},
    many:{title:'LiveContainer + SideStore',text:'Use LiveContainer when you need many guest IPA apps without consuming a normal free-account app slot for each guest app.',steps:['Install the combined LC+SS setup.','Import or share the signing certificate correctly.','Refresh the container / SideStore; guest apps run inside LiveContainer.'],primary:'Open LiveContainer guide ↗',url:'https://livecontainer.github.io/docs/installation/lc_sidestore',secondary:'Troubleshooting ↓',secondaryUrl:'#troubleshooting'},
    desktop:{title:'Sideloadly',text:'If you mainly install from Windows or macOS, Sideloadly is the direct desktop route and can re-sign apps when your device is reachable.',steps:['Install Sideloadly on Windows or macOS.','Connect the device by USB for setup.','Use Wi-Fi/USB auto-refresh if it fits your workflow.'],primary:'Open Sideloadly ↗',url:'https://sideloadly.io/'},
    tv:{title:'Sideloadly or atvloadly for Apple TV',text:'Use Sideloadly for the straightforward desktop path. Choose atvloadly when you specifically want a self-hosted Linux/OpenWrt workflow.',steps:['Choose desktop or self-hosted setup.','Pair the Apple TV.','Install and maintain your IPA through the selected tool.'],primary:'Open Sideloadly ↗',url:'https://sideloadly.io/',secondary:'atvloadly ↗',secondaryUrl:'https://github.com/bitxeno/atvloadly'},
    permanent:{title:'Check TrollStore compatibility first',text:'TrollStore can permanently install IPA files only on supported iOS/iPadOS versions. Do not assume a newer version is compatible.',steps:['Check your exact iOS/iPadOS version.','Compare it with the official TrollStore support information.','Use another sideloading route if your version is not supported.'],primary:'Open TrollStore ↗',url:'https://github.com/opa334/TrollStore'}
  },
  cs: {
    iphone:{title:'SideStore pro obnovování přímo z iPhonu',text:'Pro vlastní IPA s minimální potřebou počítače po prvním nastavení začni SideStorem. Na iOS 27 umí SideInstaller první instalaci SideStore nebo SideStore + LiveContainer provést přímo v zařízení.',steps:['Připoj Wi-Fi a zapni LocalDevVPN.','Na iOS 27 můžeš použít SideInstaller, na ostatních podporovaných verzích běžnou instalaci SideStore.','Aplikace obnovuj ještě před vypršením bezplatného podpisu.'],primary:'Otevřít SideStore návod ↗',url:'https://docs.sidestore.io/',secondary:'SideInstaller ↗',secondaryUrl:'https://sideinstaller.net/'},
    refresh:{title:'Začni LocalDevVPN a ručním refreshem',text:'Nejdřív ověř, že ruční obnova vůbec funguje. Pak lze problém zúžit na pairing, certifikát, přihlášení nebo konkrétní automatizaci.',steps:['Připoj se k Wi-Fi.','Zapni LocalDevVPN.','Spusť ruční refresh a potom použij filtry řešení problémů níže.'],primary:'Otevřít řešení problémů ↓',url:'#troubleshooting'},
    many:{title:'LiveContainer + SideStore',text:'LiveContainer použij, pokud chceš hodně hostovaných IPA aplikací bez samostatného běžného slotu bezplatného účtu pro každou z nich.',steps:['Nainstaluj společnou kombinaci LC+SS.','Správně importuj nebo sdílej podepisovací certifikát.','Obnovuj kontejner / SideStore; hostované aplikace běží uvnitř LiveContaineru.'],primary:'Otevřít LiveContainer návod ↗',url:'https://livecontainer.github.io/docs/installation/lc_sidestore',secondary:'Řešení problémů ↓',secondaryUrl:'#troubleshooting'},
    desktop:{title:'Sideloadly',text:'Pokud instaluješ hlavně z Windows nebo macOS, Sideloadly je nejpřímější desktopová cesta a umí aplikace znovu podepisovat, když je zařízení dostupné.',steps:['Nainstaluj Sideloadly ve Windows nebo macOS.','Pro první nastavení připoj zařízení přes USB.','Pokud ti to vyhovuje, použij automatické obnovení přes Wi-Fi/USB.'],primary:'Otevřít Sideloadly ↗',url:'https://sideloadly.io/'},
    tv:{title:'Sideloadly nebo atvloadly pro Apple TV',text:'Sideloadly je jednoduchá desktopová cesta. atvloadly použij, pokud chceš vlastní službu na Linuxu/OpenWrt.',steps:['Vyber desktop nebo self-hosted variantu.','Spáruj Apple TV.','IPA instaluj a udržuj přes zvolený nástroj.'],primary:'Otevřít Sideloadly ↗',url:'https://sideloadly.io/',secondary:'atvloadly ↗',secondaryUrl:'https://github.com/bitxeno/atvloadly'},
    permanent:{title:'Nejdřív ověř kompatibilitu TrollStore',text:'TrollStore umí trvalou instalaci IPA jen na podporovaných verzích iOS/iPadOS. U novější verze kompatibilitu nepředpokládej.',steps:['Zjisti přesnou verzi iOS/iPadOS.','Porovnej ji s oficiální podporou TrollStore.','Pokud není podporovaná, použij jinou metodu sideloadingu.'],primary:'Otevřít TrollStore ↗',url:'https://github.com/opa334/TrollStore'}
  }
};

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
  setRecommendationLink($('#guideRecommendationPrimary'), rec.primary, rec.url);
  setRecommendationLink($('#guideRecommendationSecondary'), rec.secondary, rec.secondaryUrl);
  box.hidden = false;
}

function updateReportLink() {
  const link = $('#guideReportIssue');
  if (!link) return;
  const query = ($('#troubleSearch')?.value || '').trim();
  const copy = copyForLanguage();
  const goalText = activeGoal ? (recommendationsForLanguage()[activeGoal]?.title || activeGoal) : '—';
  const body = [
    '### iOS Hub troubleshooting report',
    '',
    `- Language: ${root.lang || 'en'}`,
    `- Selected guide path: ${goalText}`,
    `- Troubleshooting filter/search: ${query || '—'}`,
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

function openSupport() {
  const modal = $('#supportModal');
  modal?.classList.add('open');
  document.body.classList.add('modal-open');
  modal?.setAttribute('aria-hidden', 'false');
}

function closeSupport() {
  const modal = $('#supportModal');
  modal?.classList.remove('open');
  document.body.classList.remove('modal-open');
  modal?.setAttribute('aria-hidden', 'true');
}

function filterTroubleshooting() {
  const q = ($('#troubleSearch')?.value || '').trim().toLowerCase();
  let visible = 0;
  $$('.trouble-item').forEach(item => {
    const haystack = [item.dataset.search || '', item.textContent || ''].join(' ').toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    const show = !q || terms.some(term => haystack.includes(term));
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
    updateAssistantTroubleSummary();
    $$('.assistant-trouble-chips button').forEach(button => button.classList.toggle('active', button === assistantFilter));
    return;
  }

  if (event.target.closest('#assistantTroubleClear')) {
    const input = $('#assistantTroubleSearch');
    if (input) input.value = '';
    $$('.assistant-trouble-chips button').forEach(button => button.classList.remove('active'));
    updateAssistantTroubleSummary();
    input?.focus();
    return;
  }

  if (event.target.closest('#assistantShowFixes')) {
    const source = $('#assistantTroubleSearch');
    const input = $('#troubleSearch');
    if (input) input.value = resolvedTroubleQuery(source?.value || '');
    filterTroubleshooting();
    $('#troubleshooting')?.scrollIntoView({ behavior:'smooth', block:'start' });
    return;
  }

  if (event.target.closest('#setupReset')) {
    resetSetup();
    return;
  }

  const goal = event.target.closest('[data-guide-goal]');
  if (goal) {
    renderRecommendation(goal.dataset.guideGoal);
    $('#guideRecommendation')?.scrollIntoView({ behavior:'smooth', block:'nearest' });
    updateReportLink();
    return;
  }

  const troubleFilter = event.target.closest('[data-trouble-filter]');
  if (troubleFilter) {
    const input = $('#troubleSearch');
    if (input) {
      input.value = troubleFilter.dataset.troubleFilter || '';
      filterTroubleshooting();
      $('#troubleshooting')?.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  }
});

$('#assistantTroubleSearch')?.addEventListener('input', () => {
  $$('.assistant-trouble-chips button').forEach(button => button.classList.remove('active'));
  updateAssistantTroubleSummary();
});
$('#troubleSearch')?.addEventListener('input', filterTroubleshooting);
$('#themeToggle')?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
$('#languageSelect')?.addEventListener('change', event => {
  applyLanguage(event.target.value);
  filterTroubleshooting();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSupport(); });

const savedTheme = safeGet('caseycz-theme');
const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (systemDark ? 'dark' : 'light'));

const savedLang = safeGet('caseycz-language');
applyLanguage(SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : 'en');

if ($('#year')) $('#year').textContent = new Date().getFullYear();
setHelpMode('choose');
updateSetupProgress();
updateAssistantTroubleSummary();
filterTroubleshooting();

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
