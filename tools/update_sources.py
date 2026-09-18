#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import itertools
import json
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "sources" / "registry.json"
DATA_DIR = ROOT / "data"
SOURCE_CACHE_DIR = DATA_DIR / "source-cache"
MIX_DIR = ROOT / "mix"
ALTSTORE_DIR = ROOT / "altstore"
SIDESTORE_DIR = ROOT / "sidestore"
BASE_URL = "https://caseycz.github.io/iOS-Hub/"
MAX_MIX_SOURCES = 3
USER_AGENT = "CaseyCZ-iOS-Hub (+https://caseycz.github.io/iOS-Hub/)"


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def fetch_json(url: str) -> tuple[dict, int]:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": USER_AGENT, "Accept": "application/json,text/plain,*/*"},
    )
    with urllib.request.urlopen(request, timeout=25) as response:
        raw = response.read()
        status = getattr(response, "status", 200)
    decoded = raw.decode("utf-8-sig")
    payload = json.loads(decoded)
    if not isinstance(payload, dict):
        raise ValueError("Source root must be a JSON object")
    apps = payload.get("apps")
    if not isinstance(apps, list):
        raise ValueError("Source must contain an apps array")
    return payload, status


def parse_date(value: object) -> float:
    if not isinstance(value, str) or not value.strip():
        return 0.0
    text = value.strip().replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(text).timestamp()
    except ValueError:
        try:
            return datetime.fromisoformat(text[:10]).replace(tzinfo=timezone.utc).timestamp()
        except ValueError:
            return 0.0


def app_date(app: dict) -> float:
    candidates = [app.get("versionDate"), app.get("date")]
    versions = app.get("versions")
    if isinstance(versions, list):
        for version in versions:
            if isinstance(version, dict):
                candidates.extend([version.get("date"), version.get("versionDate")])
    return max((parse_date(value) for value in candidates), default=0.0)


def app_version(app: dict) -> str:
    versions = app.get("versions")
    if isinstance(versions, list) and versions:
        dated = [item for item in versions if isinstance(item, dict)]
        if dated:
            latest = max(dated, key=lambda item: parse_date(item.get("date") or item.get("versionDate")))
            if latest.get("version"):
                return str(latest["version"])
    for key in ("version", "absoluteVersion"):
        if app.get(key):
            return str(app[key])
    return ""


def app_summary(app: dict) -> dict:
    return {
        "name": app.get("name") or "Unknown app",
        "bundleIdentifier": app.get("bundleIdentifier") or app.get("bundleID") or "",
        "developerName": app.get("developerName") or "",
        "version": app_version(app),
        "iconURL": app.get("iconURL") or "",
        "subtitle": app.get("subtitle") or "",
    }


def has_classic_download(app: dict) -> bool:
    if app.get("downloadURL") and (app.get("version") or app.get("absoluteVersion")):
        return True
    versions = app.get("versions")
    if isinstance(versions, list):
        return any(
            isinstance(version, dict) and version.get("version") and version.get("downloadURL")
            for version in versions
        )
    return False


def assess_mix_compatibility(source: dict, payload: dict) -> tuple[str, str]:
    apps = [app for app in payload.get("apps", []) if isinstance(app, dict)]
    if not apps:
        return "fail", "Source contains no application entries."

    missing_bundle = sum(1 for app in apps if not (app.get("bundleIdentifier") or app.get("bundleID")))
    if missing_bundle:
        return "fail", f"{missing_bundle} app entries are missing a bundle identifier."

    bundles = [
        str(app.get("bundleIdentifier") or app.get("bundleID") or "").strip().lower()
        for app in apps
        if (app.get("bundleIdentifier") or app.get("bundleID"))
    ]
    duplicate_bundles = len(bundles) - len(set(bundles))

    classic_downloads = sum(1 for app in apps if has_classic_download(app))
    mode = source.get("mode") or "classic"

    if mode == "classic" and duplicate_bundles:
        return "experimental", f"{duplicate_bundles} app entries share a bundle identifier; a Mix would collapse variants to one app."
    if mode == "classic" and classic_downloads == len(apps):
        return "pass", "Classic source structure and downloadable app metadata passed the automated Mix test."
    if mode == "classic":
        return "experimental", f"Classic JSON is readable, but {len(apps) - classic_downloads} app entries lack direct IPA version metadata."
    if mode == "sidestore":
        return "experimental", "SideStore source is structurally readable; installation behavior can differ from AltStore Classic."
    if mode == "pal":
        return "experimental", "AltStore PAL source is structurally readable, but notarized marketplace apps can require PAL-specific metadata."
    return "experimental", "Source JSON is readable but uses an unclassified distribution mode."


def is_sidestore_compatible(source: dict, payload: dict) -> bool:
    """Conservative SideStore pool: AltSource-compatible direct IPA entries only."""
    if (source.get("mode") or "classic") not in {"classic", "sidestore"}:
        return False
    apps = [app for app in payload.get("apps", []) if isinstance(app, dict)]
    if not apps:
        return False
    return all(
        (app.get("bundleIdentifier") or app.get("bundleID")) and has_classic_download(app)
        for app in apps
    )


def is_default_package_source(source: dict) -> bool:
    """Keep development/nightly feeds selectable, but out of stable iOS Hub packages."""
    tags = {str(tag).lower() for tag in source.get("tags", [])}
    return source.get("nightly") is not True and "nightly" not in tags and "development" not in tags


def sanitize_classic_app(app: dict) -> dict:
    """Remove marketplace-only/custom build fields from Classic IPA source output."""
    cleaned = dict(app)
    cleaned.pop("marketplaceID", None)
    cleaned.pop("Build", None)
    cleaned.pop("build", None)

    versions = cleaned.get("versions")
    if isinstance(versions, list):
        normalized_versions = []
        for version in versions:
            if isinstance(version, dict):
                item = dict(version)
                item.pop("Build", None)
                item.pop("build", None)
                normalized_versions.append(item)
            else:
                normalized_versions.append(version)
        cleaned["versions"] = normalized_versions

    return cleaned


def dedupe_apps(source_payloads: list[tuple[dict, dict]]) -> tuple[list[dict], list[dict]]:
    merged: dict[str, tuple[dict, dict]] = {}
    conflicts: list[dict] = []

    for source_meta, payload in source_payloads:
        for app in payload.get("apps", []):
            if not isinstance(app, dict):
                continue
            bundle = app.get("bundleIdentifier") or app.get("bundleID")
            if not bundle:
                continue
            if bundle not in merged:
                merged[bundle] = (source_meta, app)
                continue

            old_meta, old_app = merged[bundle]
            old_date = app_date(old_app)
            new_date = app_date(app)
            winner_meta, winner_app = old_meta, old_app
            if new_date > old_date:
                winner_meta, winner_app = source_meta, app
                merged[bundle] = (source_meta, app)

            conflicts.append({
                "bundleIdentifier": bundle,
                "keptSource": winner_meta["id"],
                "otherSource": source_meta["id"] if winner_meta["id"] != source_meta["id"] else old_meta["id"],
                "keptVersion": app_version(winner_app),
            })

    apps = [sanitize_classic_app(item[1]) for item in merged.values()]
    apps.sort(key=lambda app: str(app.get("name") or "").lower())
    return apps, conflicts


def write_json(path: Path, payload: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    rendered = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    if path.exists() and path.read_text(encoding="utf-8") == rendered:
        return
    path.write_text(rendered, encoding="utf-8")


def make_mix(selected: list[tuple[dict, dict]], filename: str, identifier_suffix: str) -> tuple[dict, list[dict]]:
    apps, conflicts = dedupe_apps(selected)
    names = [meta["name"] for meta, _ in selected]
    return {
        "name": "Mix · " + " + ".join(names),
        "identifier": f"com.caseycz.ios.mix.{identifier_suffix}",
        "subtitle": "Combined AltStore source generated by iOS Hub",
        "website": BASE_URL,
        "sourceURL": f"{BASE_URL}mix/{filename}",
        "tintColor": "#38BDF8",
        "apps": apps,
        "userInfo": {
            "sourceIDs": [meta["id"] for meta, _ in selected],
            "sourceURLs": [meta["url"] for meta, _ in selected],
        },
    }, conflicts


def make_store_source(selected: list[tuple[dict, dict]], store: str) -> tuple[dict, list[dict]]:
    apps, conflicts = dedupe_apps(selected)
    side = store == "sidestore"
    name = "SideStore Source" if side else "AltStore Source"
    identifier = "com.caseycz.ios.sidestore" if side else "com.caseycz.ios.altstore"
    subtitle = (
        "Checked SideStore-compatible apps from iOS Hub"
        if side
        else "Checked AltStore-compatible apps from iOS Hub"
    )
    return {
        "name": name,
        "identifier": identifier,
        "subtitle": subtitle,
        "website": BASE_URL,
        "sourceURL": f"{BASE_URL}{store}/source.json",
        "tintColor": "#38BDF8",
        "apps": apps,
        "userInfo": {
            "generatedBy": "iOS Hub",
            "sourceIDs": [meta["id"] for meta, _ in selected],
            "sourceURLs": [meta["url"] for meta, _ in selected],
        },
    }, conflicts


def main() -> None:
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    sources = registry.get("sources", [])
    generated_at = now_iso()

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    SOURCE_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    MIX_DIR.mkdir(parents=True, exist_ok=True)
    ALTSTORE_DIR.mkdir(parents=True, exist_ok=True)
    SIDESTORE_DIR.mkdir(parents=True, exist_ok=True)

    status = {"generatedAt": generated_at, "sources": {}}
    catalog = {"generatedAt": generated_at, "sources": []}
    loaded: dict[str, tuple[dict, dict]] = {}

    for source in sources:
        source_id = source["id"]
        result = {
            "online": False,
            "checkedAt": generated_at,
            "appCount": None,
            "httpStatus": None,
            "iconURL": "",
            "error": None,
            "mixTest": "fail",
            "mixReason": "Source has not passed the latest check.",
        }
        try:
            payload, http_status = fetch_json(source["url"])
            apps = [app for app in payload.get("apps", []) if isinstance(app, dict)]
            mix_test, mix_reason = assess_mix_compatibility(source, payload)
            result.update({
                "online": True,
                "httpStatus": http_status,
                "appCount": len(apps),
                "iconURL": payload.get("iconURL") or (apps[0].get("iconURL") if apps else "") or "",
                "error": None,
                "mixTest": mix_test,
                "mixReason": mix_reason,
            })
            loaded[source_id] = (source, payload)
            if source.get("cachePayload", True):
                write_json(SOURCE_CACHE_DIR / f"{source_id}.json", payload)

            catalog_limit = source.get("catalogLimit")
            catalog_apps = apps
            if isinstance(catalog_limit, int) and catalog_limit > 0:
                catalog_apps = apps[:catalog_limit]

            catalog["sources"].append({
                "id": source_id,
                "name": payload.get("name") or source.get("name"),
                "appCount": len(apps),
                "catalogLimited": len(catalog_apps) < len(apps),
                "iconURL": result["iconURL"],
                "apps": [app_summary(app) for app in catalog_apps],
            })
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError, json.JSONDecodeError, UnicodeDecodeError) as exc:
            result["error"] = f"{type(exc).__name__}: {exc}"[:300]
        except Exception as exc:
            result["error"] = f"{type(exc).__name__}: {exc}"[:300]
        status["sources"][source_id] = result

    live_cache_files = {
        f"{source_id}.json"
        for source_id, (source, _payload) in loaded.items()
        if source.get("cachePayload", True)
    }
    for path in SOURCE_CACHE_DIR.glob("*.json"):
        if path.name not in live_cache_files:
            path.unlink()

    mergeable_ids = sorted(
        source["id"] for source in sources
        if source.get("mergeable") and source.get("mode") == "classic" and source["id"] in loaded
    )

    auto_compatible_ids = sorted(
        source_id for source_id, (source, _payload) in loaded.items()
        if status["sources"][source_id]["mixTest"] == "pass"
        and source.get("mode") == "classic"
        and source.get("autoPackage", True)
    )
    experimental_ids = sorted(
        source_id for source_id in loaded
        if status["sources"][source_id]["mixTest"] == "experimental"
    )

    altstore_package_ids = sorted(
        source_id for source_id in auto_compatible_ids
        if is_default_package_source(loaded[source_id][0])
    )
    sidestore_compatible_ids = sorted(
        source_id for source_id, (source, payload) in loaded.items()
        if is_sidestore_compatible(source, payload)
        and source_id != "sidestore-official"
        and source.get("autoPackage", True)
        and is_default_package_source(source)
    )

    effective_max = min(MAX_MIX_SOURCES, len(mergeable_ids))
    expected_mix_files: set[str] = set()
    all_conflicts: dict[str, list[dict]] = {}
    mix_count = 0

    for size in range(1, effective_max + 1):
        for combo in itertools.combinations(mergeable_ids, size):
            slug = "--".join(combo)
            filename = f"{slug}.json"
            expected_mix_files.add(filename)
            selected = [loaded[source_id] for source_id in combo]
            digest = hashlib.sha1(slug.encode("utf-8")).hexdigest()[:12]
            mix, conflicts = make_mix(selected, filename, digest)
            write_json(MIX_DIR / filename, mix)
            if conflicts:
                all_conflicts[slug] = conflicts
            mix_count += 1

    all_compatible_url = None
    if auto_compatible_ids:
        filename = "all-compatible.json"
        expected_mix_files.add(filename)
        selected = [loaded[source_id] for source_id in auto_compatible_ids]
        mix, conflicts = make_mix(selected, filename, "all-compatible")
        mix["name"] = "Mix · All compatible Classic sources"
        write_json(MIX_DIR / filename, mix)
        if conflicts:
            all_conflicts["all-compatible"] = conflicts
        all_compatible_url = f"{BASE_URL}mix/{filename}"

    for path in MIX_DIR.glob("*.json"):
        if path.name not in expected_mix_files:
            path.unlink()

    altstore_url = None
    altstore_app_count = 0
    altstore_conflict_count = 0
    if altstore_package_ids:
        altstore_selected = [loaded[source_id] for source_id in altstore_package_ids]
        altstore_source, altstore_conflicts = make_store_source(altstore_selected, "altstore")
        write_json(ALTSTORE_DIR / "source.json", altstore_source)
        altstore_url = f"{BASE_URL}altstore/source.json"
        altstore_app_count = len(altstore_source["apps"])
        altstore_conflict_count = len(altstore_conflicts)
        if altstore_conflicts:
            all_conflicts["altstore-official"] = altstore_conflicts

    sidestore_url = None
    sidestore_app_count = 0
    sidestore_conflict_count = 0
    if sidestore_compatible_ids:
        sidestore_selected = [loaded[source_id] for source_id in sidestore_compatible_ids]
        sidestore_source, sidestore_conflicts = make_store_source(sidestore_selected, "sidestore")
        write_json(SIDESTORE_DIR / "source.json", sidestore_source)
        sidestore_url = f"{BASE_URL}sidestore/source.json"
        sidestore_app_count = len(sidestore_source["apps"])
        sidestore_conflict_count = len(sidestore_conflicts)
        if sidestore_conflicts:
            all_conflicts["sidestore-official"] = sidestore_conflicts

    status["mixes"] = {
        "count": mix_count,
        "maxSourcesPerMix": effective_max,
        "mergeableSourceIDs": mergeable_ids,
        "autoCompatibleSourceIDs": auto_compatible_ids,
        "experimentalSourceIDs": experimental_ids,
        "allCompatibleURL": all_compatible_url,
    }
    status["altstore"] = {
        "sourceURL": altstore_url,
        "sourceIDs": altstore_package_ids,
        "appCount": altstore_app_count,
        "conflictCount": altstore_conflict_count,
    }
    status["sidestore"] = {
        "sourceURL": sidestore_url,
        "sourceIDs": sidestore_compatible_ids,
        "appCount": sidestore_app_count,
        "conflictCount": sidestore_conflict_count,
    }

    write_json(DATA_DIR / "status.json", status)
    write_json(DATA_DIR / "catalog.json", catalog)
    write_json(DATA_DIR / "conflicts.json", {"generatedAt": generated_at, "mixes": all_conflicts})

    online_count = sum(1 for item in status["sources"].values() if item["online"])
    print(
        f"Checked {len(sources)} sources; {online_count} online; "
        f"{len(auto_compatible_ids)} auto Mix-compatible; generated {mix_count} hosted combinations; "
        f"AltStore package: {len(altstore_package_ids)} sources / {altstore_app_count} apps; "
        f"SideStore package: {len(sidestore_compatible_ids)} sources / {sidestore_app_count} apps."
    )


if __name__ == "__main__":
    main()
