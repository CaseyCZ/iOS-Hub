#!/usr/bin/env python3
from __future__ import annotations

import json
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "sources" / "registry.json"
DATA_DIR = ROOT / "data"
SOURCE_CACHE_DIR = DATA_DIR / "source-cache"
USER_AGENT = "CaseyCZ-iOS-Hub (+https://caseycz.github.io/iOS-Hub/)"

DIRECT_SOURCE_INSTALLERS = ("altstore", "sidestore", "livecontainer", "flarestore", "feather")
STRICT_DUPLICATE_BUNDLE_INSTALLERS = {"altstore", "sidestore"}
TOLERANT_DUPLICATE_BUNDLE_INSTALLERS = {"livecontainer", "feather"}
DUPLICATE_BUNDLE_EXAMPLE_LIMIT = 20


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


def source_variant_urls(source: dict) -> dict[str, str]:
    """Return normalized Classic/PAL endpoints for a registry source."""
    urls: dict[str, str] = {}
    configured = source.get("urls")
    if isinstance(configured, dict):
        for variant in ("classic", "pal"):
            value = configured.get(variant)
            if isinstance(value, str) and value.strip():
                urls[variant] = value.strip()

    primary = str(source.get("url") or "").strip()
    mode = str(source.get("mode") or "classic")
    if primary:
        if mode == "pal":
            urls.setdefault("pal", primary)
        else:
            urls.setdefault("classic", primary)
    return urls


def source_variant_url(source: dict, variant: str) -> str:
    return source_variant_urls(source).get(variant, "")


def source_supports_installer(source: dict, installer: str) -> bool:
    configured = source.get("installers")
    if isinstance(configured, list):
        return installer in configured

    mode = str(source.get("mode") or "classic")
    if installer == "altstore-pal":
        return mode == "pal"
    if mode == "pal":
        return False
    if mode == "sidestore":
        return installer == "sidestore"
    return installer in {"altstore", "sidestore", "livecontainer", "flarestore", "feather"}


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


def duplicate_bundle_report(payload: dict) -> dict:
    grouped: dict[str, dict] = {}
    for app in payload.get("apps", []):
        if not isinstance(app, dict):
            continue
        raw_bundle = str(app.get("bundleIdentifier") or app.get("bundleID") or "").strip()
        if not raw_bundle:
            continue
        key = raw_bundle.lower()
        item = grouped.setdefault(
            key,
            {
                "bundleIdentifier": raw_bundle,
                "count": 0,
                "names": [],
            },
        )
        item["count"] += 1
        name = str(app.get("name") or "Unknown app").strip()
        if name and name not in item["names"]:
            item["names"].append(name)

    items = [
        {
            "bundleIdentifier": item["bundleIdentifier"],
            "count": item["count"],
            "names": item["names"][:8],
        }
        for item in grouped.values()
        if item["count"] > 1
    ]
    items.sort(key=lambda item: (-item["count"], item["bundleIdentifier"].lower()))
    return {
        "count": len(items),
        "duplicateAppEntries": sum(item["count"] for item in items),
        "extraEntries": sum(item["count"] - 1 for item in items),
        "items": items[:DUPLICATE_BUNDLE_EXAMPLE_LIMIT],
        "itemsTruncated": len(items) > DUPLICATE_BUNDLE_EXAMPLE_LIMIT,
    }


def direct_installer_compatibility(source: dict, payload: dict) -> tuple[dict, dict]:
    report = duplicate_bundle_report(payload)
    duplicate_count = report["count"]
    checks: dict[str, dict] = {}

    for installer in DIRECT_SOURCE_INSTALLERS:
        if not source_supports_installer(source, installer):
            continue

        if not duplicate_count:
            checks[installer] = {
                "directSource": "pass",
                "reason": "No duplicate bundle identifiers were detected in the source.",
            }
            continue

        if installer in STRICT_DUPLICATE_BUNDLE_INSTALLERS:
            checks[installer] = {
                "directSource": "fail",
                "reason": (
                    f"{duplicate_count} bundle identifiers occur more than once; "
                    f"{installer} requires unique apps when adding the original source."
                ),
            }
        elif installer in TOLERANT_DUPLICATE_BUNDLE_INSTALLERS:
            checks[installer] = {
                "directSource": "pass",
                "installVariants": "try",
                "reason": (
                    f"{duplicate_count} duplicate bundle identifiers are present. "
                    "The source parser can keep separate entries, but installing multiple variants "
                    "with the same bundle identifier can still conflict."
                ),
            }
        else:
            checks[installer] = {
                "directSource": "try",
                "reason": (
                    f"{duplicate_count} duplicate bundle identifiers are present; "
                    "direct-source behavior is not verified for this installer."
                ),
            }

    return report, checks


def source_compliance_allows_distribution(source: dict) -> bool:
    compliance = source.get("compliance")
    if not isinstance(compliance, dict):
        return False
    return (
        compliance.get("aggregationApproved") is True
        and compliance.get("reviewStatus") in {"licensed", "permission"}
        and compliance.get("usage") == "metadata-and-original-links"
        and compliance.get("binaryRehost") is False
    )


def write_json(path: Path, payload: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    rendered = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    if path.exists() and path.read_text(encoding="utf-8") == rendered:
        return
    path.write_text(rendered, encoding="utf-8")


# Monitoring only: original Source endpoints remain authoritative.
def main() -> None:
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    sources = registry.get("sources", [])
    generated_at = now_iso()

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    SOURCE_CACHE_DIR.mkdir(parents=True, exist_ok=True)

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
            "variants": {},
        }

        variant_payloads: dict[str, dict] = {}
        variant_urls = source_variant_urls(source)
        for variant, variant_url in variant_urls.items():
            variant_result = {
                "online": False,
                "httpStatus": None,
                "appCount": None,
                "error": None,
            }
            try:
                payload, http_status = fetch_json(variant_url)
                apps = [app for app in payload.get("apps", []) if isinstance(app, dict)]
                variant_payloads[variant] = payload
                duplicate_report = duplicate_bundle_report(payload)
                variant_result.update({
                    "online": True,
                    "httpStatus": http_status,
                    "appCount": len(apps),
                    "error": None,
                    "duplicateBundleIdentifiers": duplicate_report,
                })
            except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError, json.JSONDecodeError, UnicodeDecodeError) as exc:
                variant_result["error"] = f"{type(exc).__name__}: {exc}"[:300]
            except Exception as exc:
                variant_result["error"] = f"{type(exc).__name__}: {exc}"[:300]
            result["variants"][variant] = variant_result

        preferred_variant = (
            "classic" if "classic" in variant_payloads
            else "pal" if "pal" in variant_payloads
            else next(iter(variant_payloads), None)
        )

        if preferred_variant is not None:
            payload = variant_payloads[preferred_variant]
            apps = [app for app in payload.get("apps", []) if isinstance(app, dict)]
            variant_result = result["variants"][preferred_variant]
            assessment_payload = variant_payloads.get("classic", payload)
            duplicate_report, installer_compatibility = direct_installer_compatibility(
                source,
                assessment_payload,
            )
            aggregation_allowed = source_compliance_allows_distribution(source)
            result.update({
                "online": True,
                "httpStatus": variant_result.get("httpStatus"),
                "appCount": len(apps),
                "iconURL": (
                    payload.get("iconURL") or (apps[0].get("iconURL") if apps else "") or ""
                ) if aggregation_allowed else "",
                "error": None,
                "duplicateBundleIdentifiers": duplicate_report if aggregation_allowed else {
                    "count": duplicate_report.get("count", 0) if isinstance(duplicate_report, dict) else 0,
                    "examples": [],
                },
                "installerCompatibility": installer_compatibility,
                "preferredVariant": preferred_variant,
                "aggregationApproved": aggregation_allowed,
            })
            loaded[source_id] = (source, payload)

            if aggregation_allowed and source.get("cachePayload", True):
                cache_payload = variant_payloads.get("classic", payload)
                write_json(SOURCE_CACHE_DIR / f"{source_id}.json", cache_payload)

            catalog_limit = source.get("catalogLimit")
            catalog_apps = apps if aggregation_allowed else []
            if isinstance(catalog_limit, int) and catalog_limit > 0:
                catalog_apps = catalog_apps[:catalog_limit]

            catalog["sources"].append({
                "id": source_id,
                "name": source.get("name"),
                "appCount": len(apps),
                "catalogLimited": aggregation_allowed and len(catalog_apps) < len(apps),
                "iconURL": result["iconURL"],
                "variants": sorted(variant_payloads),
                "apps": [app_summary(app) for app in catalog_apps],
                "aggregationApproved": aggregation_allowed,
            })
        else:
            errors = [
                f"{variant}: {item.get('error')}"
                for variant, item in result["variants"].items()
                if item.get("error")
            ]
            result["error"] = "; ".join(errors)[:300] if errors else "No source variant URL is configured."

        status["sources"][source_id] = result

    unique_app_keys: set[str] = set()
    for source_id, (source, payload) in loaded.items():
        if not source_compliance_allows_distribution(source):
            continue
        for app in payload.get("apps", []):
            if not isinstance(app, dict):
                continue
            bundle = str(app.get("bundleIdentifier") or app.get("bundleID") or "").strip().lower()
            if bundle:
                unique_app_keys.add(bundle)
                continue
            name = str(app.get("name") or "").strip().lower()
            developer = str(app.get("developerName") or "").strip().lower()
            if name or developer:
                unique_app_keys.add(f"{source_id}:{name}:{developer}")
    catalog["uniqueAppCount"] = len(unique_app_keys)

    live_cache_files = {
        f"{source_id}.json"
        for source_id, (source, _payload) in loaded.items()
        if source_compliance_allows_distribution(source)
        and source.get("cachePayload", True)
    }
    for path in SOURCE_CACHE_DIR.glob("*.json"):
        if path.name not in live_cache_files:
            path.unlink()

    # Direct Source Builder architecture:
    write_json(DATA_DIR / "status.json", status)
    write_json(DATA_DIR / "catalog.json", catalog)

    online_count = sum(1 for item in status["sources"].values() if item["online"])
    direct_compatible_count = sum(
        1
        for item in status["sources"].values()
        if item.get("online") is True
        and any(
            isinstance(value, dict) and value.get("directSource") != "fail"
            for value in (item.get("installerCompatibility") or {}).values()
        )
    )
    print(
        f"Checked {len(sources)} sources; {online_count} online; "
        f"{direct_compatible_count} usable by at least one direct Source installer."
    )


if __name__ == "__main__":
    main()
