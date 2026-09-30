# iOS Hub — Source Compliance Register

Last reviewed: 2026-09-30

This file documents the compliance classification used by iOS Hub for third-party Sources. It is an engineering/compliance record, not legal advice.

## Policy

- `licensed`: a license covering the Source/repository was verified and recorded.
- `permission`: explicit permission to use/redistribute the Source metadata was recorded.
- `public-metadata`: the Source endpoint is publicly available for discovery/direct install, but iOS Hub has no recorded permission to republish or aggregate its app metadata.
- `restricted`: the Source must not be used by Builder or generated packages.
- `aggregationApproved: true` is required before iOS Hub may cache, merge, republish, or host app metadata from that Source.
- `binaryRehost` must remain `false`; iOS Hub does not rehost third-party IPA binaries.
- Link-only Sources may be checked for availability/format, but their full Source payload and app metadata are not persisted in iOS Hub generated data.

## Current status

- Total Sources: **76**
- Licensed: **8**
- Permission: **0**
- Public metadata / link-only: **68**
- Restricted: **0**
- Unreviewed: **0**
- Aggregation approved: **0**
- Binary rehosting enabled: **0**

## Source register

| Source | ID | Review status | License | Aggregation | Evidence |
| --- | --- | --- | --- | --- | --- |
| UTM Repository | `utm` | public-metadata | — | link-only | [evidence](https://alt.getutm.app/) |
| Provenance Emulator | `provenance` | public-metadata | — | link-only | [evidence](https://provenance-emu.com/apps.json) |
| iSH | `ish` | public-metadata | — | link-only | [evidence](https://ish.app/altstore.json) |
| Flycast | `flycast` | public-metadata | — | link-only | [evidence](https://flyinghead.github.io/flycast-builds/altstore.json) |
| SideStore Community | `sidestore-community` | public-metadata | — | link-only | [evidence](https://community-apps.sidestore.io/sidecommunity.json) |
| SideStore Official | `sidestore-official` | public-metadata | — | link-only | [evidence](https://apps.sidestore.io/) |
| StikDebug | `stikdebug` | public-metadata | — | link-only | [evidence](https://stikdebug.xyz/index.json) |
| LiveContainer Stable | `livecontainer` | public-metadata | — | link-only | [evidence](https://github.com/LiveContainer/LiveContainer/releases/download/1.0/apps.json) |
| LiveContainer Nightly | `livecontainer-nightly` | public-metadata | — | link-only | [evidence](https://github.com/LiveContainer/LiveContainer/releases/download/nightly/apps_nightly.json) |
| Manic EMU | `manicemu` | public-metadata | — | link-only | [evidence](https://apps.manicemu.site/altstore) |
| Flycast iOS | `flycast-ios` | licensed | GPL-2.0-only | link-only | [evidence](https://github.com/chachillie/Flycast-iOS/blob/main/LICENSE) |
| Geode iOS | `geode-ios` | public-metadata | — | link-only | [evidence](https://ios-repo.geode-sdk.org/altsource/main.json) |
| RetroSekaï | `retrosekai` | public-metadata | — | link-only | [evidence](https://repo.untitledcharts.com) |
| OatmealDome | `oatmealdome` | public-metadata | — | link-only | [evidence](https://altstore.oatmealdome.me) |
| crystall1ne | `crystall1ne` | public-metadata | — | link-only | [evidence](https://alt.crystall1ne.dev) |
| PokeMMO | `pokemmo` | public-metadata | — | link-only | [evidence](https://pokemmo.eu/altstore/) |
| Odyssey | `odyssey` | public-metadata | — | link-only | [evidence](https://theodyssey.dev/altstore/odysseysource.json) |
| Yattee | `yattee` | licensed | AGPL-3.0-only | link-only | [evidence](https://github.com/yattee/yattee/blob/main/LICENSE) |
| Ignited | `ignited` | public-metadata | — | link-only | [evidence](https://altstore.ignitedemulator.com/) |
| Mona | `mona` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/delia-cheminot/mona-hrt/refs/heads/main/ios_source.json) |
| VortX | `vortx` | licensed | GPL-3.0-only | link-only | [evidence](https://github.com/VortXTV/VortX/blob/main/LICENSE) |
| Stremio Official | `stremio-official-pal` | public-metadata | — | link-only | [evidence](https://dl.strem.io/apple/altstore/source.json) |
| Stremio iOS Source | `stremio-ios` | licensed | MIT | link-only | [evidence](https://github.com/gorlev/stremio-altstore/blob/main/LICENSE) |
| Kodi iOS IPA | `kodi-ios` | public-metadata | — | link-only | [evidence](https://github.com/ohaiibuzzle/kodi-ios-ipa-builds/releases/latest/download/source.json) |
| NineAnimator | `nineanimator` | public-metadata | — | link-only | [evidence](https://9ani.app/api/altstore) |
| eSound | `esound` | public-metadata | — | link-only | [evidence](https://esound.app/downloads/source.json) |
| Party Knights | `partyknights` | public-metadata | — | link-only | [evidence](https://partyknights.app/source) |
| BringYour | `bringyour` | public-metadata | — | link-only | [evidence](https://bringyour.com/altstore/source.json) |
| iTorrent | `itorrent` | public-metadata | — | link-only | [evidence](https://xitrix.github.io/iTorrent/AltStore.json) |
| qBitConnect | `qbitconnect` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/RajnishOne/altstore-releases/main/altstore-pal.json) |
| Artemis | `artemis` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/auties00/artemis/refs/heads/main/source_pal.json) |
| Hacker Web App | `hackerwebapp` | public-metadata | — | link-only | [evidence](https://alt.hackerwebapp.com/PALSource.json) |
| CourtPredict | `courtpredict` | public-metadata | — | link-only | [evidence](https://courtpredict-ios.web.app/PALSource.json) |
| Niantic Wayfarer | `wayfarer` | public-metadata | — | link-only | [evidence](https://alts.lao.sb) |
| qBitControl | `qbitcontrol` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/Michael-128/qBitControl-releases/main/source.json) |
| iPhanpy | `iphanpy` | licensed | MIT | link-only | [evidence](https://github.com/matfantinel/iphanpy/blob/main/LICENSE) |
| Epic Games | `epic-games` | public-metadata | — | link-only | [evidence](https://content-download-egs.distro.on.epicgames.com/iOS/altstore/source.json) |
| xN1ckuz SideBox | `xn1ckuz-sidebox` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/xN1ckuz/xN1ckuz-Sidestore-Repo/main/repo.json) |
| Dan's Workshop | `dvntm0-workshop` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/dvntm0/AltStore/main/repo.json) |
| WuXu's Library++ | `wuxu-library-plus` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/WuXu1/WuXu1.github.io/main/wuxu-complete-plus.json) |
| Baretsky Tweaked App Library | `baretsky-tweaked` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/baretsky/baretsky-tweaked-ipas-library/main/apps.json) |
| driftywinds AltStore Repo | `driftywinds` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/driftywinds/driftywinds.github.io/master/AltStore/apps.json) |
| IPA Vault | `ipa-vault` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/927tx/IPA-Vault/main/ipavaultsource.json) |
| SideloadLabs Repo | `sideloadlabs` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/SideloadLabs/SideloasLabs-AltSource/main/apps.json) |
| YTLitePlus | `ytliteplus` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/YTLitePlus/YTLitePlus-Altstore/main/apps.json) |
| Moe AltStore | `moe-altstore` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/MountainofPenguin/moe-altstore/main/apps.json) |
| YouMod Repo | `youmod-repo` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/MountainofPenguin/Altstore-Repository/main/apps.json) |
| YouProEXTRA | `youproextra` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/mrdrvt99/Altstore-Repository/main/apps.json) |
| OwO Source | `owo-source` | public-metadata | — | link-only | [evidence](https://repo.owo.network/) |
| CyPwn IPA Library | `cypwn-ipa` | public-metadata | — | link-only | [evidence](https://ipa.cypwn.xyz/cypwn.json) |
| AppTesters IPA Repo | `apptesters` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/apptesters-org/AppTesters_Repo/main/apps.json) |
| YouTubeRebornPlus | `youtuberebornplus` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/arichornlover/arichornlover.github.io/main/apps2.json) |
| Apollo for Reddit | `apollo-reddit` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/Balackburn/Apollo/main/apps.json) |
| Discord App Store Builds | `discord-appstore-builds` | licensed | MIT | link-only | [evidence](https://github.com/AlfaActa/discord-altstore-source/blob/main/LICENSE) |
| YTKACE | `ytkace` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/xKatsumi/YTKACE-SideStore-Repo/main/ytkace.json) |
| heyFordy SideStore Repo | `heyfordy` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/Bitte-ein-Git/sidestore-repo/main/apps.json) |
| IPALibrary Source | `ipalibrary` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/2nkn0w/ipalibrary.me-source/main/ipalibrary_source.json) |
| ARMSX2 iOS | `armsx2` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/ARMSX2/Armsx2-Repo/main/apps.json) |
| Fouad's Source | `fouad-source` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/FouadRaheb/Watusi-for-WhatsApp/master/altstore/source.json) |
| NeoFreeBird | `neofreebird` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/orionblur/NeoFreeBird/v6/AltSource.json) |
| MeloNX | `melonx` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/AzureDominus/melonx/refs/heads/XC-ios-ht/source.json) |
| AltGallery | `altgallery` | licensed | MIT | link-only | [evidence](https://github.com/bebound/AltGallery/blob/master/LICENSE) |
| RipeStore | `ripestore` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/RipeStore/repos/main/RipeStore.json) |
| Feather Repository | `feather` | licensed | GPL-3.0-only | link-only | [evidence](https://github.com/claration/Feather/blob/main/LICENSE) |
| Quantum Source | `quantum-source` | public-metadata | — | link-only | [evidence](https://quarksources.github.io/quantumsource.json) |
| SpotCompiled | `spotc` | public-metadata | — | link-only | [evidence](https://raw.githubusercontent.com/SpotCompiled/SpotC-AltStore-Repo/main/AltStore%20Repo.json) |
| Foxster's AltSource | `foxster-altsource` | public-metadata | — | link-only | [evidence](https://therealfoxster.github.io/altsource/apps.json) |
| FastSign | `fastsign` | public-metadata | — | link-only | [evidence](https://fastsign.dev/repo.json) |
| Quantum Source++ | `quantum-plus` | public-metadata | — | link-only | [evidence](https://quarksources.github.io/quantumsource++.json) |
| WuXu's Library | `wuxu-standard` | public-metadata | — | link-only | [evidence](https://wuxu1.github.io/wuxu-complete.json) |
| Taurine | `taurine` | public-metadata | — | link-only | [evidence](https://taurine.app/altstore/taurinestore.json) |
| Burrito's Source | `burrito-source` | public-metadata | — | link-only | [evidence](https://burritosoftware.github.io/altstore/channels/burritosource.json) |
| Salupov Team AltRepo | `salupov-altrepo` | public-metadata | — | link-only | [evidence](https://adp.salupovteam.com/altrepo.json) |
| Cercube | `cercube` | public-metadata | — | link-only | [evidence](https://altstore.cercube.com) |
| Rocket | `rocket` | public-metadata | — | link-only | [evidence](https://altstore.getrocketapp.io) |
| Reynard Browser | `reynard-browser` | public-metadata | — | link-only | [evidence](https://github.com/minh-ton/reynard-browser/releases/download/0.0.1-a1/source.json) |

## Notes

A license review and aggregation approval are intentionally separate. A repository can be open-source while still containing third-party artwork, descriptions, trademarks, binaries, or generated feed content whose redistribution rights are not established. For that reason, a Source remains link-only until aggregation approval is explicitly recorded.

Source maintainers can request attribution corrections, removal, or review by opening an issue in this repository.
