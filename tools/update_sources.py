#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import itertools
import json
import shutil
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "sources" / "registry.json"
DATA_DIR = ROOT / "data"
MIX_DIR = ROOT / "mix"
BASE_URL = "https://caseycz.github.io/iOS-Hub/"
# Pre-generate every combination up to 12 compatible sources. With the current
# nine mergeable sources this means all 2^9 - 1 = 511 possible mixes, including
# one mix containing every available source.
MAX_MIX_SOURCES = 12
USER_AGENT = "CaseyCZ-iOS-Hub/1.0 (+https://caseycz.github.io/iOS-Hub/)"


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
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    sources = registry.get("sources", [])
    generated_at = now_iso()

    DATA_DIR.mkdir(parents=True, exist_ok=True)
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
        }
        try:
            payload, http_status = fetch_json(source["url"])
            apps = [app for app in payload.get("apps", []) if isinstance(app, dict)]
            result.update({
                "online": True,
                "httpStatus": http_status,
                "appCount": len(apps),
                "iconURL": payload.get("iconURL") or (apps[0].get("iconURL") if apps else "") or "",
            })
            loaded[source_id] = (source, payload)
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

    for path in MIX_DIR.glob("*.json"):
        path.unlink()

    mergeable_ids = sorted(
        source["id"] for source in sources
        if source.get("mergeable") and source.get("mode") == "classic" and source["id"] in loaded
    )

    effective_max = min(MAX_MIX_SOURCES, len(mergeable_ids))
    all_conflicts: dict[str, list[dict]] = {}
    mix_count = 0
    for size in range(1, effective_max + 1):
        for combo in itertools.combinations(mergeable_ids, size):
            slug = "--".join(combo)
            selected = [loaded[source_id] for source_id in combo]
            apps, conflicts = dedupe_apps(selected)
            names = [meta["name"] for meta, _ in selected]
            digest = hashlib.sha1(slug.encode("utf-8")).hexdigest()[:12]
            mix = {
                "name": "CaseyCZ Mix · " + " + ".join(names),
                "identifier": f"com.caseycz.ios.mix.{digest}",
                "subtitle": "Combined AltStore source generated by CaseyCZ iOS Hub",
                "website": BASE_URL,
                "sourceURL": f"{BASE_URL}mix/{slug}.json",
                "tintColor": "#38BDF8",
                "apps": apps,
                "userInfo": {
                    "generatedAt": generated_at,
                    "sourceIDs": list(combo),
                    "sourceURLs": [meta["url"] for meta, _ in selected],
                },
            }
            write_json(MIX_DIR / f"{slug}.json", mix)
            if conflicts:
                all_conflicts[slug] = conflicts
            mix_count += 1

    status["mixes"] = {
        "count": mix_count,
        "maxSourcesPerMix": effective_max,
        "mergeableSourceIDs": mergeable_ids,
    }
    write_json(DATA_DIR / "status.json", status)
    write_json(DATA_DIR / "catalog.json", catalog)
    write_json(DATA_DIR / "conflicts.json", {"generatedAt": generated_at, "mixes": all_conflicts})

    print(f"Checked {len(sources)} sources; {sum(1 for x in status['sources'].values() if x['online'])} online; generated {mix_count} mixes.")


if __name__ == "__main__":
    main()
