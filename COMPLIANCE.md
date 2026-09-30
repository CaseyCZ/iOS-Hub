# iOS Hub — Source Compliance Register

Last reviewed: 2026-09-30

This file documents how iOS Hub treats third-party Source endpoints. It is an engineering/compliance record, not legal advice.

## Policy

- iOS Hub lists original public Source URLs and can open those URLs directly in supported installers.
- The Source Builder does **not** combine, copy, cache, mirror, or re-host third-party Source feeds.
- iOS Hub does **not** re-host third-party IPA binaries.
- `licensed`: a license for the Source/repository was verified and recorded.
- `permission`: explicit permission relevant to the Source was recorded.
- `public-metadata`: a public Source endpoint is listed for discovery/direct installation; its feed content is not republished by iOS Hub.
- `restricted`: the Source must not be offered by the Builder.
- Availability checks may temporarily read a public Source response to validate its structure and count apps, but app names, descriptions, artwork, version lists, download URLs and bundle identifiers are not persisted by iOS Hub.

## Current status

- Total Sources: **76**
- Licensed: **8**
- Permission: **0**
- Public endpoint: **68**
- Restricted: **0**
- Unreviewed: **0**
- Binary rehosting enabled: **0**

## Source register

| Source | ID | Review status | License | Evidence |
| --- | --- | --- | --- | --- |
| UTM Repository | `utm` | public-metadata | — | [evidence](https://alt.getutm.app/) |
| Provenance Emulator | `provenance` | public-metadata | — | [evidence](https://provenance-emu.com/apps.json) |
| iSH | `ish` | public-metadata | — | [evidence](https://ish.app/altstore.json) |
| Flycast | `flycast` | public-metadata | — | [evidence](https://flyinghead.github.io/flycast-builds/altstore.json) |
| SideStore Community | `sidestore-community` | public-metadata | — | [evidence](https://community-apps.sidestore.io/sidecommunity.json) |
| SideStore Official | `sidestore-official` | public-metadata | — | [evidence](https://apps.sidestore.io/) |
| StikDebug | `stikdebug` | public-metadata | — | [evidence](https://stikdebug.xyz/index.json) |
| LiveContainer Stable | `livecontainer` | public-metadata | — | [evidence](https://github.com/LiveContainer/LiveContainer/releases/download/1.0/apps.json) |
| LiveContainer Nightly | `livecontainer-nightly` | public-metadata | — | [evidence](https://github.com/LiveContainer/LiveContainer/releases/download/nightly/apps_nightly.json) |
| Manic EMU | `manicemu` | public-metadata | — | [evidence](https://apps.manicemu.site/altstore) |
| Flycast iOS | `flycast-ios` | licensed | GPL-2.0-only | [evidence](https://github.com/chachillie/Flycast-iOS/blob/main/LICENSE) |
| Geode iOS | `geode-ios` | public-metadata | — | [evidence](https://ios-repo.geode-sdk.org/altsource/main.json) |
| RetroSekaï | `retrosekai` | public-metadata | — | [evidence](https://repo.untitledcharts.com) |
| OatmealDome | `oatmealdome` | public-metadata | — | [evidence](https://altstore.oatmealdome.me) |
| crystall1ne | `crystall1ne` | public-metadata | — | [evidence](https://alt.crystall1ne.dev) |
| PokeMMO | `pokemmo` | public-metadata | — | [evidence](https://pokemmo.eu/altstore/) |
| Odyssey | `odyssey` | public-metadata | — | [evidence](https://theodyssey.dev/altstore/odysseysource.json) |
| Yattee | `yattee` | licensed | AGPL-3.0-only | [evidence](https://github.com/yattee/yattee/blob/main/LICENSE) |
| Ignited | `ignited` | public-metadata | — | [evidence](https://altstore.ignitedemulator.com/) |
| Mona | `mona` | public-metadata | — | [evidence](https://raw.githubusercontent.com/delia-cheminot/mona-hrt/refs/heads/main/ios_source.json) |
| VortX | `vortx` | licensed | GPL-3.0-only | [evidence](https://github.com/VortXTV/VortX/blob/main/LICENSE) |
| Stremio Official | `stremio-official-pal` | public-metadata | — | [evidence](https://dl.strem.io/apple/altstore/source.json) |
| Stremio iOS Source | `stremio-ios` | licensed | MIT | [evidence](https://github.com/gorlev/stremio-altstore/blob/main/LICENSE) |
| Kodi iOS IPA | `kodi-ios` | public-metadata | — | [evidence](https://github.com/ohaiibuzzle/kodi-ios-ipa-builds/releases/latest/download/source.json) |
| NineAnimator | `nineanimator` | public-metadata | — | [evidence](https://9ani.app/api/altstore) |
| eSound | `esound` | public-metadata | — | [evidence](https://esound.app/downloads/source.json) |
| Party Knights | `partyknights` | public-metadata | — | [evidence](https://partyknights.app/source) |
| BringYour | `bringyour` | public-metadata | — | [evidence](https://bringyour.com/altstore/source.json) |
| iTorrent | `itorrent` | public-metadata | — | [evidence](https://xitrix.github.io/iTorrent/AltStore.json) |
| qBitConnect | `qbitconnect` | public-metadata | — | [evidence](https://raw.githubusercontent.com/RajnishOne/altstore-releases/main/altstore-pal.json) |
| Artemis | `artemis` | public-metadata | — | [evidence](https://raw.githubusercontent.com/auties00/artemis/refs/heads/main/source_pal.json) |
| Hacker Web App | `hackerwebapp` | public-metadata | — | [evidence](https://alt.hackerwebapp.com/PALSource.json) |
| CourtPredict | `courtpredict` | public-metadata | — | [evidence](https://courtpredict-ios.web.app/PALSource.json) |
| Niantic Wayfarer | `wayfarer` | public-metadata | — | [evidence](https://alts.lao.sb) |
| qBitControl | `qbitcontrol` | public-metadata | — | [evidence](https://raw.githubusercontent.com/Michael-128/qBitControl-releases/main/source.json) |
| iPhanpy | `iphanpy` | licensed | MIT | [evidence](https://github.com/matfantinel/iphanpy/blob/main/LICENSE) |
| Epic Games | `epic-games` | public-metadata | — | [evidence](https://content-download-egs.distro.on.epicgames.com/iOS/altstore/source.json) |
| xN1ckuz SideBox | `xn1ckuz-sidebox` | public-metadata | — | [evidence](https://raw.githubusercontent.com/xN1ckuz/xN1ckuz-Sidestore-Repo/main/repo.json) |
| Dan's Workshop | `dvntm0-workshop` | public-metadata | — | [evidence](https://raw.githubusercontent.com/dvntm0/AltStore/main/repo.json) |
| WuXu's Library++ | `wuxu-library-plus` | public-metadata | — | [evidence](https://raw.githubusercontent.com/WuXu1/WuXu1.github.io/main/wuxu-complete-plus.json) |
| Baretsky Tweaked App Library | `baretsky-tweaked` | public-metadata | — | [evidence](https://raw.githubusercontent.com/baretsky/baretsky-tweaked-ipas-library/main/apps.json) |
| driftywinds AltStore Repo | `driftywinds` | public-metadata | — | [evidence](https://raw.githubusercontent.com/driftywinds/driftywinds.github.io/master/AltStore/apps.json) |
| IPA Vault | `ipa-vault` | public-metadata | — | [evidence](https://raw.githubusercontent.com/927tx/IPA-Vault/main/ipavaultsource.json) |
| SideloadLabs Repo | `sideloadlabs` | public-metadata | — | [evidence](https://raw.githubusercontent.com/SideloadLabs/SideloasLabs-AltSource/main/apps.json) |
| YTLitePlus | `ytliteplus` | public-metadata | — | [evidence](https://raw.githubusercontent.com/YTLitePlus/YTLitePlus-Altstore/main/apps.json) |
| Moe AltStore | `moe-altstore` | public-metadata | — | [evidence](https://raw.githubusercontent.com/MountainofPenguin/moe-altstore/main/apps.json) |
| YouMod Repo | `youmod-repo` | public-metadata | — | [evidence](https://raw.githubusercontent.com/MountainofPenguin/Altstore-Repository/main/apps.json) |
| YouProEXTRA | `youproextra` | public-metadata | — | [evidence](https://raw.githubusercontent.com/mrdrvt99/Altstore-Repository/main/apps.json) |
| OwO Source | `owo-source` | public-metadata | — | [evidence](https://repo.owo.network/) |
| CyPwn IPA Library | `cypwn-ipa` | public-metadata | — | [evidence](https://ipa.cypwn.xyz/cypwn.json) |
| AppTesters IPA Repo | `apptesters` | public-metadata | — | [evidence](https://raw.githubusercontent.com/apptesters-org/AppTesters_Repo/main/apps.json) |
| YouTubeRebornPlus | `youtuberebornplus` | public-metadata | — | [evidence](https://raw.githubusercontent.com/arichornlover/arichornlover.github.io/main/apps2.json) |
| Apollo for Reddit | `apollo-reddit` | public-metadata | — | [evidence](https://raw.githubusercontent.com/Balackburn/Apollo/main/apps.json) |
| Discord App Store Builds | `discord-appstore-builds` | licensed | MIT | [evidence](https://github.com/AlfaActa/discord-altstore-source/blob/main/LICENSE) |
| YTKACE | `ytkace` | public-metadata | — | [evidence](https://raw.githubusercontent.com/xKatsumi/YTKACE-SideStore-Repo/main/ytkace.json) |
| heyFordy SideStore Repo | `heyfordy` | public-metadata | — | [evidence](https://raw.githubusercontent.com/Bitte-ein-Git/sidestore-repo/main/apps.json) |
| IPALibrary Source | `ipalibrary` | public-metadata | — | [evidence](https://raw.githubusercontent.com/2nkn0w/ipalibrary.me-source/main/ipalibrary_source.json) |
| ARMSX2 iOS | `armsx2` | public-metadata | — | [evidence](https://raw.githubusercontent.com/ARMSX2/Armsx2-Repo/main/apps.json) |
| Fouad's Source | `fouad-source` | public-metadata | — | [evidence](https://raw.githubusercontent.com/FouadRaheb/Watusi-for-WhatsApp/master/altstore/source.json) |
| NeoFreeBird | `neofreebird` | public-metadata | — | [evidence](https://raw.githubusercontent.com/orionblur/NeoFreeBird/v6/AltSource.json) |
| MeloNX | `melonx` | public-metadata | — | [evidence](https://raw.githubusercontent.com/AzureDominus/melonx/refs/heads/XC-ios-ht/source.json) |
| AltGallery | `altgallery` | licensed | MIT | [evidence](https://github.com/bebound/AltGallery/blob/master/LICENSE) |
| RipeStore | `ripestore` | public-metadata | — | [evidence](https://raw.githubusercontent.com/RipeStore/repos/main/RipeStore.json) |
| Feather Repository | `feather` | licensed | GPL-3.0-only | [evidence](https://github.com/claration/Feather/blob/main/LICENSE) |
| Quantum Source | `quantum-source` | public-metadata | — | [evidence](https://quarksources.github.io/quantumsource.json) |
| SpotCompiled | `spotc` | public-metadata | — | [evidence](https://raw.githubusercontent.com/SpotCompiled/SpotC-AltStore-Repo/main/AltStore%20Repo.json) |
| Foxster's AltSource | `foxster-altsource` | public-metadata | — | [evidence](https://therealfoxster.github.io/altsource/apps.json) |
| FastSign | `fastsign` | public-metadata | — | [evidence](https://fastsign.dev/repo.json) |
| Quantum Source++ | `quantum-plus` | public-metadata | — | [evidence](https://quarksources.github.io/quantumsource++.json) |
| WuXu's Library | `wuxu-standard` | public-metadata | — | [evidence](https://wuxu1.github.io/wuxu-complete.json) |
| Taurine | `taurine` | public-metadata | — | [evidence](https://taurine.app/altstore/taurinestore.json) |
| Burrito's Source | `burrito-source` | public-metadata | — | [evidence](https://burritosoftware.github.io/altstore/channels/burritosource.json) |
| Salupov Team AltRepo | `salupov-altrepo` | public-metadata | — | [evidence](https://adp.salupovteam.com/altrepo.json) |
| Cercube | `cercube` | public-metadata | — | [evidence](https://altstore.cercube.com) |
| Rocket | `rocket` | public-metadata | — | [evidence](https://altstore.getrocketapp.io) |
| Reynard Browser | `reynard-browser` | public-metadata | — | [evidence](https://github.com/minh-ton/reynard-browser/releases/download/0.0.1-a1/source.json) |

## Notes

The register records the provenance of the public endpoint and any license information we have found. It does not imply affiliation, endorsement, or ownership of third-party content.

Source maintainers can request attribution corrections, removal, or review by opening an issue in this repository.
