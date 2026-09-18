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
  const select = $('#languageSelect');
  if (select) select.value = lang;
  document.title = `${t(lang, 'guidePageTitle')} — iOS Hub`;
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
