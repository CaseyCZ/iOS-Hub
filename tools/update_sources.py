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
BASE_URL = "https://caseycz.github.io/iOS-Hub/"
# Stable hosted combinations are still pre-generated only for the curated
# mergeable pool. Experimental Mix Lab can combine the wider online catalog
# locally in the browser from same-origin checked source snapshots.
MAX_MIX_SOURCES = 12
USER_AGENT = "CaseyCZ-iOS-Hub/1.1 (+https://caseycz.github.io/iOS-Hub/)"


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

    classic_downloads = sum(1 for app in apps if has_classic_download(app))
    mode = source.get("mode") or "classic"

    if mode == "classic" and classic_downloads == len(apps):
        return "pass", "Classic source structure and downloadable app metadata passed the automated Mix test."
    if mode == "classic":
        return "experimental", f"Classic JSON is readable, but {len(apps) - classic_downloads} app entries lack direct IPA version metadata."
    if mode == "sidestore":
        return "experimental", "SideStore source is structurally readable; installation behavior can differ from AltStore Classic."
    if mode == "pal":
        return "experimental", "AltStore PAL source is structurally readable, but notarized marketplace apps can require PAL-specific metadata."
    return "experimental", "Source JSON is readable but uses an unclassified distribution mode."


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

    apps = [item[1] for item in merged.values()]
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
        "name": "CaseyCZ Mix · " + " + ".join(names),
        "identifier": f"com.caseycz.ios.mix.{identifier_suffix}",
        "subtitle": "Combined AltStore source generated by CaseyCZ iOS Hub",
        "website": BASE_URL,
        "sourceURL": f"{BASE_URL}mix/{filename}",
        "tintColor": "#38BDF8",
        "apps": apps,
        "userInfo": {
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
                "mixTest": mix_test,
                "mixReason": mix_reason,
            })
            loaded[source_id] = (source, payload)
            write_json(SOURCE_CACHE_DIR / f"{source_id}.json", payload)
            catalog["sources"].append({
                "id": source_id,
                "name": payload.get("name") or source.get("name"),
                "appCount": len(apps),
                "iconURL": result["iconURL"],
                "apps": [app_summary(app) for app in apps[:24]],
            })
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError, json.JSONDecodeError, UnicodeDecodeError) as exc:
            result["error"] = f"{type(exc).__name__}: {exc}"[:300]
        except Exception as exc:
            result["error"] = f"{type(exc).__name__}: {exc}"[:300]
        status["sources"][source_id] = result

    # Remove cached metadata for sources that did not pass the current online check.
    live_cache_files = {f"{source_id}.json" for source_id in loaded}
    for path in SOURCE_CACHE_DIR.glob("*.json"):
        if path.name not in live_cache_files:
            path.unlink()

    # Curated hosted pool: all arbitrary combinations are pre-generated here.
    mergeable_ids = sorted(
        source["id"] for source in sources
        if source.get("mergeable") and source.get("mode") == "classic" and source["id"] in loaded
    )

    # Automatic test pool: wider set that passed Classic structural/install metadata checks.
    auto_compatible_ids = sorted(
        source_id for source_id, (source, _payload) in loaded.items()
        if status["sources"][source_id]["mixTest"] == "pass" and source.get("mode") == "classic"
    )
    experimental_ids = sorted(
        source_id for source_id in loaded
        if status["sources"][source_id]["mixTest"] == "experimental"
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

    # One hosted preset can safely include the full automatically compatible pool
    # without generating the exponential set of every possible combination.
    all_compatible_url = None
    if auto_compatible_ids:
        filename = "all-compatible.json"
        expected_mix_files.add(filename)
        selected = [loaded[source_id] for source_id in auto_compatible_ids]
        mix, conflicts = make_mix(selected, filename, "all-compatible")
        mix["name"] = "CaseyCZ Mix · All compatible Classic sources"
        write_json(MIX_DIR / filename, mix)
        if conflicts:
            all_conflicts["all-compatible"] = conflicts
        all_compatible_url = f"{BASE_URL}mix/{filename}"

    # Delete only obsolete combinations. Unchanged mixes stay byte-for-byte
    # untouched, so scheduled checks do not rewrite hundreds of files.
    for path in MIX_DIR.glob("*.json"):
        if path.name not in expected_mix_files:
            path.unlink()

    status["mixes"] = {
        "count": mix_count,
        "maxSourcesPerMix": effective_max,
        "mergeableSourceIDs": mergeable_ids,
        "autoCompatibleSourceIDs": auto_compatible_ids,
        "experimentalSourceIDs": experimental_ids,
        "allCompatibleURL": all_compatible_url,
    }
    write_json(DATA_DIR / "status.json", status)
    write_json(DATA_DIR / "catalog.json", catalog)
    write_json(DATA_DIR / "conflicts.json", {"generatedAt": generated_at, "mixes": all_conflicts})

    online_count = sum(1 for item in status["sources"].values() if item["online"])
    print(
        f"Checked {len(sources)} sources; {online_count} online; "
        f"{len(auto_compatible_ids)} auto Mix-compatible; generated {mix_count} hosted combinations."
    )


if __name__ == "__main__":
    main()
