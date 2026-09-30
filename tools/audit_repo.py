#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "sources" / "registry.json"
STATUS = ROOT / "data" / "status.json"
STATUS_MOBILE_PAYLOAD_LIMIT_BYTES = 350 * 1024
CATALOG = ROOT / "data" / "catalog.json"
JS_DIR = ROOT / "src" / "js"
CSS_DIR = ROOT / "src" / "css"

EXPECTED_SITE_URL = "https://caseycz.github.io/iOS-Hub/"
EXPECTED_REPO_URL = "https://github.com/CaseyCZ/iOS-Hub"
EXPECTED_PROJECT_NAME = "CaseyCZ iOS Hub"
EXPECTED_PUBLIC_SITE_NAME = "iOS Hub"
OLD_PUBLIC_REFERENCES = (
    "https://caseycz.github.io/repo",
    "https://github.com/CaseyCZ/repo",
)
OWNED_REFERENCE_FILES = (
    ROOT / "README.md",
    ROOT / "README_EN.md",
    ROOT / "index.html",
    ROOT / "builder.html",
    ROOT / "converter.html",
    ROOT / "guide.html",
    ROOT / "resources.html",
    ROOT / "credits.html",
    ROOT / "privacy.html",
    JS_DIR / "analytics.js",
    JS_DIR / "app.js",
    JS_DIR / "builder-page.js",
    JS_DIR / "builder.js",
    JS_DIR / "guide.js",
    JS_DIR / "resources.js",
    JS_DIR / "i18n.js",
    ROOT / "tools" / "update_sources.py",
    ROOT / ".github" / "workflows" / "update-sources.yml",
)

LANGUAGES = ("en", "cs", "de", "es", "fr")
ALLOWED_MODES = {"classic", "pal", "sidestore"}
ALLOWED_INSTALLERS = {"altstore", "sidestore", "livecontainer", "altstore-pal", "flarestore", "feather"}
ALLOWED_COMPLIANCE_STATUSES = {"unreviewed", "licensed", "permission", "public-metadata", "restricted"}
ALLOWED_COMPLIANCE_USAGE = {"metadata-and-original-links", "link-only"}
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
LEGACY_PATHS = [
    ROOT / "Packages",
    ROOT / "Packages.gz",
    ROOT / "Release",
    ROOT / "repo.xml",
    ROOT / "debs",
    ROOT / "depictions",
]
REQUIRED_CSP_PARTS = (
    "default-src 'self'",
    "script-src 'self' 'wasm-unsafe-eval'",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
)

errors: list[str] = []
warnings: list[str] = []


def error(message: str) -> None:
    errors.append(message)


def warn(message: str) -> None:
    warnings.append(message)


def load_json(path: Path) -> object:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        error(f"Missing required JSON file: {path.relative_to(ROOT)}")
    except json.JSONDecodeError as exc:
        error(f"Invalid JSON in {path.relative_to(ROOT)}: {exc}")
    return {}


def validate_alt_source(path: Path, *, required: bool = True) -> tuple[int, int]:
    if not path.exists():
        if required:
            error(f"Missing generated source: {path.relative_to(ROOT)}")
        return 0, 0

    payload = load_json(path)
    if not isinstance(payload, dict):
        error(f"{path.relative_to(ROOT)} root must be an object")
        return 0, 0

    apps = payload.get("apps")
    if not isinstance(apps, list):
        error(f"{path.relative_to(ROOT)} must contain an apps array")
        return 0, 0

    user_info = payload.get("userInfo")
    if user_info is not None:
        if not isinstance(user_info, dict):
            error(f"{path.relative_to(ROOT)} userInfo must be an object")
        else:
            for key, value in user_info.items():
                if not isinstance(value, str):
                    error(
                        f"{path.relative_to(ROOT)} userInfo.{key} must be a string "
                        f"for AltStore compatibility, got {type(value).__name__}"
                    )

    seen: dict[str, str] = {}
    duplicate_count = 0
    valid_apps = 0
    for index, app in enumerate(apps):
        if not isinstance(app, dict):
            error(f"{path.relative_to(ROOT)} apps[{index}] is not an object")
            continue
        valid_apps += 1
        bundle = app.get("bundleIdentifier") or app.get("bundleID")
        if not bundle:
            error(f"{path.relative_to(ROOT)} apps[{index}] has no bundle identifier")
            continue
        bundle = str(bundle)
        if bundle in seen:
            duplicate_count += 1
            error(
                f"{path.relative_to(ROOT)} contains duplicate bundleIdentifier {bundle!r} "
                f"({seen[bundle]} and index {index})"
            )
        else:
            seen[bundle] = f"index {index}"

    return valid_apps, duplicate_count


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.scripts: list[str] = []
        self.i18n_keys: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag.lower() == "script":
            src = values.get("src")
            if src:
                self.scripts.append(src)
        for attr in ("data-i18n", "data-i18n-placeholder", "data-i18n-title", "data-i18n-aria-label"):
            key = values.get(attr)
            if key:
                self.i18n_keys.add(key)


def parse_page(path: Path) -> PageParser | None:
    if not path.exists():
        error(f"Missing HTML file: {path.relative_to(ROOT)}")
        return None
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def validate_html_scripts(path: Path) -> None:
    parser = parse_page(path)
    if parser is None:
        return
    for src in parser.scripts:
        parsed = urlparse(src)
        if parsed.scheme or src.startswith("//"):
            continue
        clean = src.split("?", 1)[0].split("#", 1)[0]
        target = (path.parent / clean).resolve()
        try:
            target.relative_to(ROOT.resolve())
        except ValueError:
            error(f"{path.relative_to(ROOT)} references a script outside the repository: {src}")
            continue
        if not target.exists():
            error(f"{path.relative_to(ROOT)} references missing local script: {src}")


def validate_security_policy(path: Path) -> None:
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    label = path.relative_to(ROOT)
    if 'name="referrer" content="no-referrer"' not in text:
        error(f"{label} must set referrer policy to no-referrer")
    csp_match = re.search(
        r'<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"',
        text,
        flags=re.IGNORECASE,
    )
    if not csp_match:
        error(f"{label} is missing a Content-Security-Policy meta tag")
        return
    csp = csp_match.group(1)
    required_parts = list(REQUIRED_CSP_PARTS)
    if path.name != "converter.html":
        required_parts = [
            part for part in required_parts
            if part not in ("script-src 'self' 'wasm-unsafe-eval'", "worker-src 'self' blob:")
        ]
        required_parts.append("script-src 'self'")
    for part in required_parts:
        if part not in csp:
            error(f"{label} CSP is missing required directive: {part}")


def validate_translations() -> None:
    i18n_path = JS_DIR / "i18n.js"
    if not i18n_path.exists():
        error("Missing i18n.js")
        return

    used: set[str] = set()
    for html in SITE_PAGES:
        parser = parse_page(html)
        if parser:
            used.update(parser.i18n_keys)

    for script in (
        JS_DIR / "app.js",
        JS_DIR / "installers.js",
        JS_DIR / "builder-page.js",
        JS_DIR / "converter.js",
        JS_DIR / "guide.js",
        JS_DIR / "resources.js",
        JS_DIR / "credits.js",
    ):
        if not script.exists():
            continue
        text = script.read_text(encoding="utf-8")
        used.update(re.findall(r"\btr\(\s*['\"]([A-Za-z0-9_]+)['\"]\s*\)", text))
        used.update(re.findall(r"\bt\(\s*[A-Za-z0-9_]+\s*,\s*['\"]([A-Za-z0-9_]+)['\"]\s*\)", text))

    i18n_text = i18n_path.read_text(encoding="utf-8")
    for key in sorted(used):
        occurrences = len(re.findall(rf"(?:\b{re.escape(key)}|[\"']{re.escape(key)}[\"'])\s*:", i18n_text))
        if occurrences < len(LANGUAGES):
            error(
                f"Translation key {key!r} is used by the UI but appears in only "
                f"{occurrences}/{len(LANGUAGES)} language dictionaries"
            )


def validate_privacy_compliance() -> None:
    license_path = ROOT / "LICENSE"
    if not license_path.exists():
        error("Missing LICENSE")
    else:
        license_text = license_path.read_text(encoding="utf-8")
        if "[year]" in license_text or "[fullname]" in license_text:
            error("LICENSE still contains template placeholders")
        if "Copyright (c) 2026 CaseyCZ" not in license_text:
            error("LICENSE must contain the current CaseyCZ copyright notice")

    privacy_path = ROOT / "privacy.html"
    if not privacy_path.exists():
        error("Missing privacy.html")
    else:
        privacy_text = privacy_path.read_text(encoding="utf-8")
        for required_privacy in (
            "Google Analytics is optional",
            "not loaded until you explicitly choose",
            "passes original public Source URLs directly to the selected installer",
            "does not rehost third-party IPA binaries",
            "data-cookie-settings",
        ):
            if required_privacy not in privacy_text:
                error(f"privacy.html is missing required disclosure: {required_privacy!r}")

    builder_path = JS_DIR / "builder.js"
    if not builder_path.exists():
        error("Missing builder.js")
    else:
        builder_text = builder_path.read_text(encoding="utf-8")
        for required_builder_policy in (
            "source.compliance?.reviewStatus !== 'restricted'",
            "sourceVariantURL(source, installer.variant)",
            "installer.buildLink(sourceUrl)",
        ):
            if required_builder_policy not in builder_text:
                error(
                    "builder.js is missing direct link-only Source policy: "
                    f"{required_builder_policy!r}"
                )
        for forbidden_builder_policy in (
            "aggregationApproved === true",
            "hostCustomMix",
            "source-cache/",
        ):
            if forbidden_builder_policy in builder_text:
                error(
                    "builder.js must not require aggregation or hosted Mixes: "
                    f"found {forbidden_builder_policy!r}"
                )

    generator_path = ROOT / "tools" / "update_sources.py"
    if not generator_path.exists():
        error("Missing Source generator")
    else:
        generator_text = generator_path.read_text(encoding="utf-8")
        for required_generator_policy in (
            'compliance.get("aggregationApproved") is True',
            'compliance.get("reviewStatus") in {"licensed", "permission"}',
            'compliance.get("usage") == "metadata-and-original-links"',
        ):
            if required_generator_policy not in generator_text:
                error(
                    "update_sources.py is missing rights-gated aggregation policy: "
                    f"{required_generator_policy!r}"
                )

    analytics_path = JS_DIR / "analytics.js"
    if not analytics_path.exists():
        error("Missing analytics consent runtime")
    else:
        analytics_text = analytics_path.read_text(encoding="utf-8")
        for required_analytics in (
            "ioshub-analytics-consent-v1",
            "function loadAnalytics()",
            "document.createElement('script')",
            "data-consent-accept",
            "data-consent-reject",
            "analytics_storage: 'denied'",
        ):
            if required_analytics not in analytics_text:
                error(f"analytics.js is missing consent guard: {required_analytics!r}")

    for page in SITE_PAGES:
        if not page.exists():
            continue
        text = page.read_text(encoding="utf-8")
        label = page.relative_to(ROOT)
        if "https://www.googletagmanager.com/gtag/js?" in text:
            error(f"{label} loads Google Analytics before consent")
        if "src/js/analytics.js?v=" not in text:
            error(f"{label} is missing the consent-gated analytics runtime")
        if 'href="privacy.html"' not in text:
            error(f"{label} footer must link to privacy.html")
        if "data-cookie-settings" not in text:
            error(f"{label} must provide a Cookie settings control")


def validate_project_identity() -> None:
    for path in OWNED_REFERENCE_FILES:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        label = path.relative_to(ROOT)
        for old in OLD_PUBLIC_REFERENCES:
            if old in text:
                error(f"{label} still contains old public reference: {old}")

    readme = ROOT / "README.md"
    if readme.exists():
        text = readme.read_text(encoding="utf-8")
        if EXPECTED_SITE_URL not in text:
            error(f"README.md must link to current site {EXPECTED_SITE_URL}")
        if EXPECTED_PROJECT_NAME not in text:
            error(f"README.md must use current project name {EXPECTED_PROJECT_NAME!r}")

    index = ROOT / "index.html"
    if index.exists():
        text = index.read_text(encoding="utf-8")
        if EXPECTED_REPO_URL not in text:
            error(f"index.html must link to current repository {EXPECTED_REPO_URL}")
        if EXPECTED_PUBLIC_SITE_NAME not in text:
            error(f"index.html must use current public site name {EXPECTED_PUBLIC_SITE_NAME!r}")

    update_workflow = ROOT / ".github" / "workflows" / "update-sources.yml"
    if update_workflow.exists():
        workflow_text = update_workflow.read_text(encoding="utf-8")
        if workflow_text.count("python tools/audit_repo.py") < 2:
            error("update-sources workflow must audit generated data before each publish attempt")


def validate_registry() -> None:
    payload = load_json(REGISTRY)
    if not isinstance(payload, dict) or not isinstance(payload.get("sources"), list):
        error("sources/registry.json must contain a sources array")
        return

    ids: dict[str, int] = {}
    urls: dict[str, int] = {}
    partially_localized: list[str] = []
    for index, source in enumerate(payload["sources"]):
        if not isinstance(source, dict):
            error(f"registry sources[{index}] is not an object")
            continue

        source_id = str(source.get("id") or "")
        name = str(source.get("name") or "")
        url = str(source.get("url") or "")
        mode = str(source.get("mode") or "classic")

        if not source_id or not ID_RE.fullmatch(source_id):
            error(f"registry sources[{index}] has invalid id {source_id!r}")
        elif source_id in ids:
            error(f"duplicate registry id {source_id!r} at indexes {ids[source_id]} and {index}")
        else:
            ids[source_id] = index

        if not name.strip():
            error(f"registry source {source_id or index!r} has no name")

        developer = str(source.get("developer") or "").strip()
        if not developer:
            error(f"registry source {source_id or index!r} is missing developer/maintainer credit")

        compliance = source.get("compliance")
        if not isinstance(compliance, dict):
            error(f"registry source {source_id or index!r} is missing compliance metadata")
        else:
            review_status = str(compliance.get("reviewStatus") or "")
            usage = str(compliance.get("usage") or "")
            if review_status not in ALLOWED_COMPLIANCE_STATUSES:
                error(
                    f"registry source {source_id or index!r} has invalid compliance.reviewStatus "
                    f"{review_status!r}"
                )
            if review_status == "unreviewed":
                error(
                    f"registry source {source_id or index!r} is still unreviewed; "
                    "every Source must be classified before release"
                )
            else:
                evidence_url = str(compliance.get("evidenceURL") or "").strip()
                parsed_evidence = urlparse(evidence_url)
                if parsed_evidence.scheme != "https" or not parsed_evidence.netloc:
                    error(
                        f"reviewed registry source {source_id or index!r} must include "
                        "an absolute HTTPS compliance.evidenceURL"
                    )
                reviewed_at = str(compliance.get("reviewedAt") or "").strip()
                if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", reviewed_at):
                    error(
                        f"reviewed registry source {source_id or index!r} must include "
                        "compliance.reviewedAt in YYYY-MM-DD format"
                    )
                if not str(compliance.get("note") or "").strip():
                    error(
                        f"reviewed registry source {source_id or index!r} must include compliance.note"
                    )
            if usage not in ALLOWED_COMPLIANCE_USAGE:
                error(
                    f"registry source {source_id or index!r} has invalid compliance.usage {usage!r}"
                )
            if compliance.get("binaryRehost") is not False:
                error(
                    f"registry source {source_id or index!r} must explicitly keep binaryRehost=false"
                )

            aggregation_approved = compliance.get("aggregationApproved")
            if not isinstance(aggregation_approved, bool):
                error(
                    f"registry source {source_id or index!r} must define boolean "
                    "compliance.aggregationApproved"
                )
                aggregation_approved = False

            rights_reviewed = review_status in {"licensed", "permission"}
            if rights_reviewed:
                evidence_url = str(compliance.get("evidenceURL") or "").strip()
                parsed_evidence = urlparse(evidence_url)
                if parsed_evidence.scheme != "https" or not parsed_evidence.netloc:
                    error(
                        f"rights-reviewed registry source {source_id or index!r} must include "
                        "an absolute HTTPS compliance.evidenceURL"
                    )
                if review_status == "licensed" and not str(compliance.get("license") or "").strip():
                    error(
                        f"licensed registry source {source_id or index!r} must record compliance.license"
                    )

            if aggregation_approved:
                if not rights_reviewed:
                    error(
                        f"aggregation-approved registry source {source_id or index!r} must be "
                        "licensed or permission-reviewed"
                    )
                if usage != "metadata-and-original-links":
                    error(
                        f"aggregation-approved registry source {source_id or index!r} must use "
                        "metadata-and-original-links"
                    )
            elif usage != "link-only":
                error(
                    f"registry source {source_id or index!r} is not aggregation-approved "
                    "and must be link-only"
                )

            if review_status == "restricted":
                if source.get("builder") is not False:
                    error(f"restricted registry source {source_id or index!r} must set builder=false")
                if source.get("autoPackage") is not False:
                    error(f"restricted registry source {source_id or index!r} must set autoPackage=false")
                if source.get("mergeable") is True:
                    error(f"restricted registry source {source_id or index!r} must not be mergeable")

        parsed = urlparse(url)
        if parsed.scheme != "https" or not parsed.netloc:
            error(f"registry source {source_id or index!r} must use an absolute HTTPS URL")
        elif url in urls:
            error(f"duplicate registry URL at indexes {urls[url]} and {index}: {url}")
        else:
            urls[url] = index

        if mode not in ALLOWED_MODES:
            error(f"registry source {source_id or index!r} has unsupported mode {mode!r}")

        source_urls = source.get("urls")
        if source_urls is not None:
            if not isinstance(source_urls, dict):
                error(f"registry source {source_id or index!r} urls must be an object")
            else:
                unknown_variants = sorted(set(source_urls) - {"classic", "pal"})
                if unknown_variants:
                    error(
                        f"registry source {source_id or index!r} has unsupported URL variants: "
                        + ", ".join(unknown_variants)
                    )
                for variant, variant_url in source_urls.items():
                    parsed_variant = urlparse(str(variant_url or ""))
                    if parsed_variant.scheme != "https" or not parsed_variant.netloc:
                        error(
                            f"registry source {source_id or index!r} urls.{variant} "
                            "must use an absolute HTTPS URL"
                        )

        classic_url = (
            str(source_urls.get("classic") or "").strip()
            if isinstance(source_urls, dict)
            else (url if mode != "pal" else "")
        )
        pal_url = (
            str(source_urls.get("pal") or "").strip()
            if isinstance(source_urls, dict)
            else (url if mode == "pal" else "")
        )

        installers = source.get("installers")
        if classic_url and pal_url and installers is None:
            error(
                f"registry source {source_id or index!r} exposes both Classic and PAL URLs "
                "and must declare installers explicitly"
            )
        if installers is not None:
            if not isinstance(installers, list) or not installers:
                error(f"registry source {source_id or index!r} installers must be a non-empty array")
            else:
                normalized_installers = [str(item) for item in installers]
                unknown_installers = sorted(set(normalized_installers) - ALLOWED_INSTALLERS)
                if unknown_installers:
                    error(
                        f"registry source {source_id or index!r} has unsupported installers: "
                        + ", ".join(unknown_installers)
                    )
                if len(normalized_installers) != len(set(normalized_installers)):
                    error(f"registry source {source_id or index!r} installers contains duplicates")

                for installer in normalized_installers:
                    if installer == "altstore-pal" and not pal_url:
                        error(
                            f"registry source {source_id or index!r} enables altstore-pal without a PAL URL"
                        )
                    if installer != "altstore-pal" and not classic_url:
                        error(
                            f"registry source {source_id or index!r} enables {installer} without a Classic URL"
                        )

        website = str(source.get("website") or "").strip()
        if website:
            website_url = urlparse(website)
            if website_url.scheme != "https" or not website_url.netloc:
                error(f"registry source {source_id or index!r} website must use an absolute HTTPS URL")

        description = source.get("description")
        if not isinstance(description, dict):
            error(f"registry source {source_id or index!r} description must be an object")
        else:
            for language in ("en", "cs"):
                if not str(description.get(language) or "").strip():
                    error(f"registry source {source_id or index!r} is missing {language} description")
            missing_optional = [
                language for language in ("de", "es", "fr")
                if not str(description.get(language) or "").strip()
            ]
            if missing_optional:
                partially_localized.append(source_id or str(index))

        if source.get("cachePayload") is False and source.get("builder") is not False:
            error(
                f"registry source {source_id or index!r} disables cachePayload but remains available to Builder"
            )

        if source.get("mergeable") is True and not classic_url:
            error(f"registry source {source_id!r} is mergeable but has no Classic source URL")

        for key in ("official", "trusted", "recommended", "mergeable", "community", "modified"):
            if key in source and not isinstance(source[key], bool):
                error(f"registry source {source_id!r} field {key!r} must be boolean")


    if partially_localized:
        warn(
            f"{len(partially_localized)} registry source descriptions still fall back to English "
            "for one or more of DE/ES/FR"
        )


def validate_generated_data() -> None:
    status = load_json(STATUS)
    if isinstance(status, dict):
        if not isinstance(status.get("sources"), dict):
            error("data/status.json must contain a sources object")
        mixes = status.get("mixes", {})
        if not isinstance(mixes, dict):
            error("data/status.json mixes must be an object")
        else:
            max_sources = mixes.get("maxSourcesPerMix")
            if max_sources is not None and (not isinstance(max_sources, int) or max_sources < 0):
                error("data/status.json maxSourcesPerMix must be a non-negative integer")

    catalog = load_json(CATALOG)
    if isinstance(catalog, dict) and not isinstance(catalog.get("sources"), list):
        error("data/catalog.json must contain a sources array")

    registry = load_json(REGISTRY)
    if (
        isinstance(registry, dict)
        and isinstance(registry.get("sources"), list)
        and isinstance(status, dict)
        and isinstance(status.get("sources"), dict)
        and isinstance(catalog, dict)
        and isinstance(catalog.get("sources"), list)
    ):
        registry_ids = {
            str(item.get("id"))
            for item in registry["sources"]
            if isinstance(item, dict) and item.get("id")
        }
        registry_by_id = {
            str(item.get("id")): item
            for item in registry["sources"]
            if isinstance(item, dict) and item.get("id")
        }

        status_ids = set(status["sources"])
        if registry_ids != status_ids:
            missing = sorted(registry_ids - status_ids)
            extra = sorted(status_ids - registry_ids)
            if missing:
                error("data/status.json is missing registry ids: " + ", ".join(missing))
            if extra:
                error("data/status.json contains unknown ids: " + ", ".join(extra))

        for source_id, source in registry_by_id.items():
            item = status["sources"].get(source_id)
            if not isinstance(item, dict):
                continue

            configured_urls = source.get("urls")
            mode = str(source.get("mode") or "classic")
            expected_variants: set[str] = set()
            if isinstance(configured_urls, dict):
                expected_variants.update(
                    variant
                    for variant in ("classic", "pal")
                    if str(configured_urls.get(variant) or "").strip()
                )
            if str(source.get("url") or "").strip():
                expected_variants.add("pal" if mode == "pal" else "classic")

            variants = item.get("variants")
            if expected_variants:
                if not isinstance(variants, dict):
                    error(f"data/status.json source {source_id!r} is missing variants status")
                else:
                    actual_variants = set(variants)
                    if expected_variants != actual_variants:
                        error(
                            f"data/status.json source {source_id!r} variants differ from registry; "
                            f"missing={sorted(expected_variants - actual_variants)}, "
                            f"extra={sorted(actual_variants - expected_variants)}"
                        )
                    for variant, variant_status in variants.items():
                        if not isinstance(variant_status, dict):
                            error(
                                f"data/status.json source {source_id!r} variant {variant!r} must be an object"
                            )
                            continue
                        if not isinstance(variant_status.get("online"), bool):
                            error(
                                f"data/status.json source {source_id!r} variant {variant!r} "
                                "must contain boolean online"
                            )

            preferred = item.get("preferredVariant")
            if item.get("online") is True:
                if preferred not in expected_variants:
                    error(
                        f"data/status.json source {source_id!r} has invalid preferredVariant {preferred!r}"
                    )
                elif isinstance(variants, dict) and variants.get(preferred, {}).get("online") is not True:
                    error(
                        f"data/status.json source {source_id!r} preferredVariant {preferred!r} is not online"
                    )

                compliance = source.get("compliance")
                aggregation_approved = bool(
                    isinstance(compliance, dict)
                    and compliance.get("aggregationApproved") is True
                )
                if item.get("aggregationApproved") is not aggregation_approved:
                    error(
                        f"data/status.json source {source_id!r} aggregationApproved differs from registry"
                    )
                if not aggregation_approved:
                    if item.get("iconURL") not in ("", None):
                        error(
                            f"link-only source {source_id!r} must not persist third-party iconURL"
                        )
                    duplicate_report = item.get("duplicateBundleIdentifiers")
                    if isinstance(duplicate_report, dict) and duplicate_report.get("examples"):
                        error(
                            f"link-only source {source_id!r} must not persist duplicate bundle examples"
                        )

        online_ids = {
            source_id
            for source_id, item in status["sources"].items()
            if isinstance(item, dict) and item.get("online") is True
        }
        catalog_ids = {
            str(item.get("id"))
            for item in catalog["sources"]
            if isinstance(item, dict) and item.get("id")
        }
        if catalog_ids != online_ids:
            missing = sorted(online_ids - catalog_ids)
            extra = sorted(catalog_ids - online_ids)
            if missing:
                error("data/catalog.json is missing online source ids: " + ", ".join(missing))
            if extra:
                error("data/catalog.json contains non-online/unknown source ids: " + ", ".join(extra))

        catalog_by_id = {
            str(item.get("id")): item
            for item in catalog["sources"]
            if isinstance(item, dict) and item.get("id")
        }
        for source_id, source in registry_by_id.items():
            catalog_item = catalog_by_id.get(source_id)
            if not isinstance(catalog_item, dict):
                continue
            compliance = source.get("compliance")
            aggregation_approved = bool(
                isinstance(compliance, dict)
                and compliance.get("aggregationApproved") is True
            )
            if catalog_item.get("aggregationApproved") is not aggregation_approved:
                error(
                    f"data/catalog.json source {source_id!r} aggregationApproved differs from registry"
                )
            if not aggregation_approved:
                if catalog_item.get("apps") not in ([], None):
                    error(
                        f"link-only source {source_id!r} must not publish app metadata in catalog.json"
                    )
                if catalog_item.get("iconURL") not in ("", None):
                    error(
                        f"link-only source {source_id!r} must not publish third-party iconURL in catalog.json"
                    )
                if catalog_item.get("name") != source.get("name"):
                    error(
                        f"link-only source {source_id!r} catalog name must come from registry metadata"
                    )

        for package_name in ("altstore", "sidestore"):
            package = status.get(package_name, {})
            if not isinstance(package, dict):
                continue
            unknown = sorted(set(package.get("sourceIDs") or []) - registry_ids)
            if unknown:
                error(f"data/status.json {package_name}.sourceIDs contains unknown ids: " + ", ".join(unknown))

        # Keep generated installable packages in lockstep with status.json.
        # An empty rights-approved set must remove stale package files completely.
        for package_name in ("altstore", "sidestore"):
            package_status = status.get(package_name, {})
            package_path = ROOT / package_name / "source.json"
            if not isinstance(package_status, dict):
                continue

            expected_ids = set(package_status.get("sourceIDs") or [])
            expected_url = package_status.get("sourceURL")

            if not expected_ids:
                if expected_url not in (None, ""):
                    error(
                        f"data/status.json {package_name}.sourceURL must be null when sourceIDs is empty"
                    )
                if package_path.exists():
                    error(
                        f"{package_path.relative_to(ROOT)} is stale and must be removed when no "
                        "rights-approved Sources are published"
                    )
                continue

            if not package_path.exists():
                error(
                    f"Missing {package_path.relative_to(ROOT)} for "
                    f"{len(expected_ids)} rights-approved Source(s)"
                )
                continue

            package_payload = load_json(package_path)
            if not isinstance(package_payload, dict):
                continue

            user_info = package_payload.get("userInfo")
            source_ids_raw = user_info.get("sourceIDs") if isinstance(user_info, dict) else None
            source_urls_raw = user_info.get("sourceURLs") if isinstance(user_info, dict) else None
            source_ids = (
                [item.strip() for item in source_ids_raw.split(",") if item.strip()]
                if isinstance(source_ids_raw, str)
                else []
            )
            source_urls = (
                [item.strip() for item in source_urls_raw.splitlines() if item.strip()]
                if isinstance(source_urls_raw, str)
                else []
            )
            actual_ids = set(source_ids)
            if expected_ids != actual_ids:
                error(
                    f"{package_path.relative_to(ROOT)} sourceIDs differ from data/status.json; "
                    f"missing={sorted(expected_ids - actual_ids)}, "
                    f"extra={sorted(actual_ids - expected_ids)}"
                )

            if len(source_ids) != len(source_urls):
                error(
                    f"{package_path.relative_to(ROOT)} userInfo sourceIDs/sourceURLs length mismatch"
                )
            else:
                for source_id, source_url in zip(source_ids, source_urls):
                    source = registry_by_id.get(str(source_id))
                    if not isinstance(source, dict):
                        continue
                    configured_urls = source.get("urls")
                    mode = str(source.get("mode") or "classic")
                    configured_url = (
                        str(configured_urls.get("classic") or "").strip()
                        if isinstance(configured_urls, dict)
                        else (str(source.get("url") or "").strip() if mode != "pal" else "")
                    )
                    if configured_url and source_url != configured_url:
                        error(
                            f"{package_path.relative_to(ROOT)} uses non-Classic source URL "
                            f"for {source_id!r}: {source_url!r}"
                        )

        all_compatible_path = ROOT / "mix" / "all-compatible.json"
        mixes_status = status.get("mixes", {})
        if isinstance(mixes_status, dict):
            expected_ids = set(mixes_status.get("autoCompatibleSourceIDs") or [])
            expected_url = mixes_status.get("allCompatibleURL")
            if not expected_ids:
                if expected_url not in (None, ""):
                    error("data/status.json mixes.allCompatibleURL must be null when no Sources are approved")
                if all_compatible_path.exists():
                    error("mix/all-compatible.json is stale when no rights-approved Sources exist")
            else:
                if not all_compatible_path.exists():
                    error("Missing mix/all-compatible.json")
                else:
                    all_compatible = load_json(all_compatible_path)
                    if isinstance(all_compatible, dict):
                        user_info = all_compatible.get("userInfo")
                        source_ids_raw = user_info.get("sourceIDs") if isinstance(user_info, dict) else None
                        actual_ids = (
                            {item.strip() for item in source_ids_raw.split(",") if item.strip()}
                            if isinstance(source_ids_raw, str)
                            else set()
                        )
                        if expected_ids != actual_ids:
                            error(
                                "mix/all-compatible.json sourceIDs differ from data/status.json; "
                                f"missing={sorted(expected_ids - actual_ids)}, "
                                f"extra={sorted(actual_ids - expected_ids)}"
                            )

        registry_sources = [item for item in registry["sources"] if isinstance(item, dict)]
        expected_cache_ids = {
            str(item.get("id"))
            for item in registry_sources
            if item.get("id") in online_ids
            and item.get("cachePayload", True)
            and isinstance(item.get("compliance"), dict)
            and item["compliance"].get("aggregationApproved") is True
        }
        cache_dir = ROOT / "data" / "source-cache"
        if expected_cache_ids:
            if not cache_dir.is_dir():
                error("Missing data/source-cache directory for aggregation-approved Sources")
            else:
                actual_cache_ids = {path.stem for path in cache_dir.glob("*.json")}
                if expected_cache_ids != actual_cache_ids:
                    error(
                        "source cache IDs differ from expected approved cache; "
                        f"missing={sorted(expected_cache_ids - actual_cache_ids)}, "
                        f"extra={sorted(actual_cache_ids - expected_cache_ids)}"
                    )
        elif cache_dir.is_dir():
            stale_cache_ids = {path.stem for path in cache_dir.glob("*.json")}
            if stale_cache_ids:
                error(
                    "data/source-cache contains stale link-only Source payloads: "
                    + ", ".join(sorted(stale_cache_ids))
                )

        mixes = status.get("mixes", {})
        mix_dir = ROOT / "mix"
        if isinstance(mixes, dict):
            combo_files = list(mix_dir.glob("*.json")) if mix_dir.is_dir() else []
            combination_files = [path for path in combo_files if path.name != "all-compatible.json"]
            expected_mix_count = mixes.get("count")
            if isinstance(expected_mix_count, int) and expected_mix_count != len(combination_files):
                error(
                    f"data/status.json mix count {expected_mix_count} does not match "
                    f"{len(combination_files)} generated combination files"
                )

    for obsolete_generated in (
        ROOT / "altstore" / "source.json",
        ROOT / "sidestore" / "source.json",
    ):
        if obsolete_generated.exists():
            error(
                f"Obsolete generated Source must not exist: {obsolete_generated.relative_to(ROOT)}"
            )

    mix_dir = ROOT / "mix"
    if mix_dir.is_dir():
        stale_mix_files = sorted(mix_dir.glob("*.json"))
        if stale_mix_files:
            error(
                "Obsolete combined Mix JSON files must not exist: "
                + ", ".join(path.name for path in stale_mix_files)
            )

    cache_dir = ROOT / "data" / "source-cache"
    if cache_dir.is_dir():
        for path in sorted(cache_dir.glob("*.json")):
            payload = load_json(path)
            if not isinstance(payload, dict) or not isinstance(payload.get("apps"), list):
                error(f"{path.relative_to(ROOT)} is not a valid source cache with an apps array")



def validate_interactive_guide() -> None:
    html = ROOT / "guide.html"
    if html.exists():
        text = html.read_text(encoding="utf-8")
        ids = re.findall(r'\bid="([^"]+)"', text)
        duplicates = sorted({value for value in ids if ids.count(value) > 1})
        for value in duplicates:
            error(f"guide.html contains duplicate id {value!r}")

        for required_guide_structure in (
            'id="methods"',
            'data-i18n="guideQuickTitle"',
            'id="source-installers"',
            'data-i18n="guideSourceInstallersTitle"',
            'href="#source-installers" data-help-copy="jumpSources"',
            '<td>AltStore PAL</td>',
            'data-i18n="guidePalBest"',
            '<td>FlareStore</td>',
            'data-i18n="guideFlareBest"',
            '<td>Feather</td>',
            'data-i18n="guideFeatherBest"',
        ):
            if required_guide_structure not in text:
                error(
                    "guide.html must keep installation methods and Source-compatible installers as distinct sections; "
                    f"missing {required_guide_structure!r}"
                )

    first_party_scripts = (
        "app.js",
        "builder-page.js",
        "builder.js",
        "collapsible.js",
        "converter.js",
        "guide.js",
        "resources.js",
        "credits.js",
        "mobile-menu.js",
        "settings-menu.js",
    )
    for script_name in first_party_scripts:
        script = JS_DIR / script_name
        if not script.exists():
            continue
        text = script.read_text(encoding="utf-8")
        if "$" * 3 + "(" in text:
            error(f"{script_name} contains an undefined triple-dollar selector helper")
        if "(?<=" in text or "(?<!" in text:
            error(f"{script_name} uses RegExp lookbehind, which breaks older Safari versions targeted by the site")
        bad_loop = re.search(
            r"(?<!\$)\$\([^\n]+?\)\.(?:forEach|filter|map|some)\(",
            text,
        )
        if bad_loop:
            line = text.count("\n", 0, bad_loop.start()) + 1
            error(
                f"{script_name} line {line} calls an array method on $() / querySelector; "
                "use the querySelectorAll helper instead"
            )

    guide = JS_DIR / "guide.js"
    if guide.exists():
        text = guide.read_text(encoding="utf-8")

        if html.exists():
            html_text = html.read_text(encoding="utf-8")
            guide_copy_keys = set(re.findall(r'data-guide-copy=["\']([^"\']+)["\']', html_text))
            help_copy_keys = set(re.findall(r'data-help-(?:copy|placeholder|aria-label)=["\']([^"\']+)["\']', html_text))

            guide_copy_start = text.find("const GUIDE_COPY")
            help_copy_start = text.find("const HELP_COPY")
            setup_results_start = text.find("const SETUP_RESULTS")
            guide_copy_block = text[guide_copy_start:help_copy_start] if guide_copy_start >= 0 and help_copy_start > guide_copy_start else ""
            help_copy_block = text[help_copy_start:setup_results_start] if help_copy_start >= 0 and setup_results_start > help_copy_start else ""

            for key in sorted(guide_copy_keys):
                count = len(re.findall(rf"\b{re.escape(key)}\s*:", guide_copy_block))
                if count < len(LANGUAGES):
                    error(f"guide.js GUIDE_COPY key {key!r} appears in only {count}/{len(LANGUAGES)} languages")
            for key in sorted(help_copy_keys):
                count = len(re.findall(rf"\b{re.escape(key)}\s*:", help_copy_block))
                if count < len(LANGUAGES):
                    error(f"guide.js HELP_COPY key {key!r} appears in only {count}/{len(LANGUAGES)} languages")

        start = text.find("const GUIDE_RECOMMENDATIONS")
        end = text.find("function recommendationsForLanguage", start)
        block = text[start:end] if start >= 0 and end > start else ""
        goals = ("iphone", "refresh", "many", "desktop", "tv", "permanent")
        for lang in LANGUAGES:
            if lang in ("en", "cs"):
                marker = re.search(rf"\b{lang}\s*:\s*\{{", block)
            else:
                marker = re.search(rf"GUIDE_RECOMMENDATIONS\.{lang}\s*=\s*\{{", block)
            if not marker:
                error(f"guide.js GUIDE_RECOMMENDATIONS is missing language {lang!r}")
                continue
            lang_start = marker.end()
            later = [
                pos for pos in (
                    block.find("GUIDE_RECOMMENDATIONS.", lang_start),
                    block.find("\n  en:", lang_start),
                    block.find("\n  cs:", lang_start),
                )
                if pos >= 0
            ]
            lang_end = min(later) if later else len(block)
            lang_block = block[lang_start:lang_end]
            for goal in goals:
                if not re.search(rf"\b{goal}\s*:", lang_block):
                    error(f"guide.js recommendations for {lang!r} are missing goal {goal!r}")



SITE_PAGES = (
    ROOT / "index.html",
    ROOT / "builder.html",
    ROOT / "converter.html",
    ROOT / "guide.html",
    ROOT / "resources.html",
    ROOT / "credits.html",
)


def validate_internal_links() -> None:
    page_ids: dict[Path, set[str]] = {}
    graph: dict[Path, set[Path]] = {path: set() for path in SITE_PAGES}

    for page in SITE_PAGES:
        if not page.exists():
            error(f"Missing site page: {page.relative_to(ROOT)}")
            continue
        text = page.read_text(encoding="utf-8")
        page_ids[page] = set(re.findall(r'\bid=["\']([^"\']+)["\']', text))

    for page in SITE_PAGES:
        if not page.exists():
            continue
        text = page.read_text(encoding="utf-8")
        refs = re.findall(r'\b(?:href|src)=["\']([^"\']+)["\']', text, flags=re.IGNORECASE)
        for raw in refs:
            value = raw.strip()
            if not value or value == "#":
                continue
            parsed = urlparse(value)
            if parsed.scheme or value.startswith("//"):
                continue

            clean_path = unquote(parsed.path)
            target = page if not clean_path else (page.parent / clean_path).resolve()
            try:
                target = ROOT / target.relative_to(ROOT.resolve())
            except ValueError:
                error(f"{page.relative_to(ROOT)} references a path outside the repository: {value}")
                continue

            if not target.exists():
                error(f"{page.relative_to(ROOT)} references missing local target: {value}")
                continue

            if target.suffix.lower() == ".html" and target in graph:
                graph[page].add(target)

            if parsed.fragment and target.suffix.lower() == ".html":
                fragment = unquote(parsed.fragment)
                ids = page_ids.get(target)
                if ids is None:
                    target_text = target.read_text(encoding="utf-8")
                    ids = set(re.findall(r'\bid=["\']([^"\']+)["\']', target_text))
                    page_ids[target] = ids
                if fragment not in ids:
                    error(
                        f"{page.relative_to(ROOT)} references missing fragment "
                        f"#{fragment} in {target.relative_to(ROOT)}"
                    )

    existing_pages = {path for path in SITE_PAGES if path.exists()}
    for start in existing_pages:
        seen = {start}
        pending = [start]
        while pending:
            current = pending.pop()
            for target in graph.get(current, set()):
                if target not in seen:
                    seen.add(target)
                    pending.append(target)
        unreachable = sorted(existing_pages - seen)
        if unreachable:
            error(
                f"{start.relative_to(ROOT)} cannot reach site page(s) through internal links: "
                + ", ".join(str(path.relative_to(ROOT)) for path in unreachable)
            )



def validate_page_quality() -> None:
    expected_canonical = {
        ROOT / "index.html": EXPECTED_SITE_URL,
        ROOT / "builder.html": EXPECTED_SITE_URL + "builder.html",
        ROOT / "converter.html": EXPECTED_SITE_URL + "converter.html",
        ROOT / "guide.html": EXPECTED_SITE_URL + "guide.html",
        ROOT / "resources.html": EXPECTED_SITE_URL + "resources.html",
        ROOT / "credits.html": EXPECTED_SITE_URL + "credits.html",
    }
    for page in SITE_PAGES:
        if not page.exists():
            continue
        text = page.read_text(encoding="utf-8")
        label = page.relative_to(ROOT)
        if len(re.findall(r"<main\b", text, flags=re.IGNORECASE)) != 1:
            error(f"{label} must contain exactly one <main>")
        if len(re.findall(r"<h1\b", text, flags=re.IGNORECASE)) != 1:
            error(f"{label} must contain exactly one <h1>")
        if 'class="skip-link"' not in text or 'href="#top"' not in text:
            error(f"{label} is missing the skip-to-content link")

        canonical = expected_canonical[page]
        if f'rel="canonical" href="{canonical}"' not in text:
            error(f"{label} is missing canonical URL {canonical}")
        for required_meta in ('property="og:title"', 'property="og:description"', 'property="og:url"', 'name="twitter:card"'):
            if required_meta not in text:
                error(f"{label} is missing social metadata {required_meta}")

        if page.name == "guide.html":
            tab_pairs = (
                ("guideModeChoose", "guidePanelChoose"),
                ("guideModeFix", "guidePanelFix"),
                ("guideModeSetup", "guidePanelSetup"),
            )
            for tab_id, panel_id in tab_pairs:
                tab = re.search(rf'<button\s+id="{tab_id}"[^>]*>', text)
                panel = re.search(rf'<section\s+id="{panel_id}"[^>]*>', text)
                if not tab or f'aria-controls="{panel_id}"' not in tab.group(0):
                    error(f"guide.html tab {tab_id} must reference {panel_id} with aria-controls")
                if not panel or f'aria-labelledby="{tab_id}"' not in panel.group(0):
                    error(f"guide.html panel {panel_id} must reference {tab_id} with aria-labelledby")

        settings = re.search(r'<div\s+id="settingsPanel"[^>]*>', text)
        if not settings or 'role="dialog"' not in settings.group(0) or 'aria-labelledby=' not in settings.group(0):
            error(f"{label} settingsPanel must expose dialog semantics")

        for match in re.finditer(r'<input\b[^>]*type="search"[^>]*>', text, flags=re.IGNORECASE):
            tag = match.group(0)
            if 'aria-label=' not in tag and 'aria-labelledby=' not in tag:
                error(f"{label} contains an unlabeled search input: {tag[:120]}")

        for match in re.finditer(r'<a\b[^>]*target="_blank"[^>]*>', text, flags=re.IGNORECASE):
            tag = match.group(0)
            if not re.search(r'rel="[^"]*\bnoopener\b', tag, flags=re.IGNORECASE):
                error(f"{label} opens a new tab without rel=noopener")

        expected_nav = {
            "index.html": ["#tools", "builder.html", "guide.html", "resources.html", "#sources", "credits.html"],
            "builder.html": ["index.html#tools", "builder.html", "guide.html", "resources.html", "index.html#sources", "credits.html"],
            "converter.html": ["index.html#tools", "builder.html", "guide.html", "resources.html", "index.html#sources", "credits.html"],
            "guide.html": ["index.html#tools", "builder.html", "guide.html", "resources.html", "index.html#sources", "credits.html"],
            "resources.html": ["index.html#tools", "builder.html", "guide.html", "resources.html", "index.html#sources", "credits.html"],
            "credits.html": ["index.html#tools", "builder.html", "guide.html", "resources.html", "index.html#sources", "credits.html"],
        }
        nav_match = re.search(r'<nav\s+class="nav"[^>]*>(.*?)</nav>', text, flags=re.IGNORECASE | re.DOTALL)
        if not nav_match:
            error(f"{label} is missing primary navigation")
        else:
            hrefs = re.findall(r'<a\b[^>]*href=["\']([^"\']+)["\']', nav_match.group(1), flags=re.IGNORECASE)
            if hrefs != expected_nav[page.name]:
                error(f"{label} primary navigation differs from expected targets/order: {hrefs}")

        version_path = ROOT / "VERSION"
        if version_path.exists():
            version = version_path.read_text(encoding="utf-8").strip()
            if version and f"iOS Hub · v{version}" not in text:
                error(f"{label} footer version does not match VERSION ({version})")

        for shared_script in ("support-dialog.js", "mobile-menu.js", "settings-menu.js"):
            if f"{shared_script}?v=" not in text:
                error(f"{label} must load cache-versioned {shared_script}")

        for _attr, asset in re.findall(
            r'\b(href|src)=["\']([^"\']+\.(?:css|js)(?:\?[^"\']*)?)["\']',
            text,
            flags=re.IGNORECASE,
        ):
            parsed = urlparse(asset)
            if parsed.scheme or asset.startswith("//") or parsed.path.startswith("vendor/"):
                continue
            if "?v=" not in asset:
                error(f"{label} local runtime asset is not cache-versioned: {asset}")

    support_scripts = ("app.js", "builder-page.js", "converter.js", "guide.js", "resources.js")
    for script_name in support_scripts:
        script = JS_DIR / script_name
        if not script.exists():
            continue
        script_text = script.read_text(encoding="utf-8")
        for required in (
            "supportReturnFocus = document.activeElement",
            "querySelector('[data-support-close]')?.focus()",
            "target.focus?.()",
        ):
            if required not in script_text:
                error(f"{script_name} support dialog is missing focus-management step: {required}")

    support_focus = JS_DIR / "support-dialog.js"
    if not support_focus.exists():
        error("Missing support-dialog.js")
    else:
        support_focus_text = support_focus.read_text(encoding="utf-8")
        for required in ("event.key !== 'Tab'", "modal.contains(active)", "last.focus()", "first.focus()"):
            if required not in support_focus_text:
                error(f"support-dialog.js must trap Tab focus inside the modal: missing {required}")

    settings_script = JS_DIR / "settings-menu.js"
    if settings_script.exists():
        settings_text = settings_script.read_text(encoding="utf-8")
        for required in ("returnFocus = document.activeElement", "target.focus?.()", "panel.querySelector('[data-settings-theme].active"):
            if required not in settings_text:
                error(f"settings-menu.js is missing keyboard focus handling: {required}")

    mobile_script = JS_DIR / "mobile-menu.js"
    if mobile_script.exists():
        mobile_text = mobile_script.read_text(encoding="utf-8")
        if "setOpen(false, true)" not in mobile_text or "button.focus()" not in mobile_text:
            error("mobile-menu.js must restore focus to the menu button when Escape closes it")

    importers = ("app.js", "builder-page.js", "converter.js", "guide.js", "resources.js", "credits.js")
    versions: set[str] = set()
    for script_name in importers:
        script = JS_DIR / script_name
        if not script.exists():
            continue
        text = script.read_text(encoding="utf-8")
        match = re.search(r"from\s+['\"]\.\/i18n\.js\?v=([^'\"]+)['\"]", text)
        if not match:
            error(f"{script_name} must import i18n.js with an explicit cache version")
        else:
            versions.add(match.group(1))
    if len(versions) > 1:
        error("i18n.js import cache versions are inconsistent: " + ", ".join(sorted(versions)))



def validate_layout() -> None:
    # Source-facing pages must stay registry-driven so adding one source updates
    # the catalog, Builder and Credits without maintaining duplicate hard-coded lists.
    dynamic_source_scripts = {
        "app.js": ("sources/registry.json", "data/status.json", "data/catalog.json", "sourceWebsiteIcon", "data-source-website-icon", "installers.js", "SOURCE_VARIANT_IDS", "sourceVariantLabel", "sourceModeLabel", "sourceInstallerCompatibility", "sourceInstallerDirectAvailable", "data-blocked-installers", "includeOffline:checkedOffline", "groupInstallerIds(sourceInstallerIds(source), 3)"),
        "builder.js": ("sources/registry.json", "data/status.json", "installers.js", "SOURCE_BUILDER_INSTALLER_IDS", "DEFAULT_SOURCE_BUILDER_INSTALLER_ID", "sourceInstallerDirectAvailable", "sourceFormatLabel", "targetVariant", "queueEntries()", "installer.buildLink(sourceUrl)", "window.location.href = entries[0].deepLink", "copyQueueUrls", "expQueueList"),
        "credits.js": ("sources/registry.json", "sourceCredits", "source.developer", "maintainerGroups", "sourceCreditGroup", "brand-link-icon", "iconImage", "CORE_SIDELOAD_RESOURCE_NAMES", "SIDELOAD_TOOLS"),
    }
    for script_name, required_parts in dynamic_source_scripts.items():
        script = JS_DIR / script_name
        if not script.exists():
            continue
        script_text = script.read_text(encoding="utf-8")
        for required_part in required_parts:
            if required_part not in script_text:
                error(
                    f"{script_name} must remain registry-driven; missing {required_part!r}"
                )

    installers_script = JS_DIR / "installers.js"
    if not installers_script.exists():
        error("Missing central installer configuration: src/js/installers.js")
    else:
        installers_text = installers_script.read_text(encoding="utf-8")
        for required in (
            "altstore",
            "sidestore",
            "livecontainer",
            "altstore-pal",
            "flarestore",
            "feather",
            "flarestore://source?url=",
            "feather://source/",
            "SOURCE_VARIANTS",
            "SOURCE_VARIANT_IDS",
            "SOURCE_MODES",
            "SOURCE_BUILDER_INSTALLER_IDS",
            "DEFAULT_SOURCE_BUILDER_INSTALLER_ID",
            "builderDefault",
            "catalogPriority",
            "overflowPriority",
            "groupInstallerIds",
            "sourceInstallerCompatibility",
            "sourceInstallerDirectAvailable",
            "sourceInstallerDeepLink",
            "sourceVariantURL",
            "sourceVariantIds",
            "sourceVariantLabel",
            "sourceModeLabel",
            "sourceFormatLabel",
            "SIDELOAD_TOOLS",
            "AUXILIARY_SIDELOAD_TOOLS",
            "CORE_SIDELOAD_TOOL_IDS",
            "CORE_SIDELOAD_RESOURCE_NAMES",
            "sideloadToolURL",
            "sideloadToolSupports",
            "RESOURCE_BADGES",
            "resourceBadgeSpecs",
            "orderedSideloadTools",
            "resourceSideloadTools",
            "creditSideloadTools",
            "sideloadToolsWithCapability",
            "sideloadToolsForTarget",
            "sideloadToolsForRole",
            "sideloadToolForRole",
            "sideloadToolProfile",
            "recommendationRoles: Object.freeze",
            "targets: Object.freeze",
            "hostPlatforms: Object.freeze",
            "computerMode",
            "openSource",
            "sourceSupport",
            "resourceBadges: Object.freeze",
            "links: Object.freeze",
            "classicGuide",
            "prerequisites",
            "pairing",
            "lcSideStore",
            "download",
            "requirements",
            "troubleshootingSideloadTools",
            "sideinstaller",
            "sideloadly",
            "atvloadly",
            "iloader",
            "impactor",
            "trollstore",
        ):
            if required not in installers_text:
                error(f"installers.js is missing installer architecture part: {required!r}")

        source_modes_match = re.search(
            r"export const SOURCE_MODES = Object\.freeze\((\{[\s\S]*?\})\);\s*export const INSTALLERS",
            installers_text,
        )
        if source_modes_match:
            source_modes_text = source_modes_match.group(1)
            for misplaced in ("toolType", "capabilities", "recommendationRoles", "website", "guideURL", "coreCredit", "resourceCard"):
                if misplaced in source_modes_text:
                    error(
                        "SOURCE_MODES must contain source-format metadata only; "
                        f"found misplaced tool metadata {misplaced!r}"
                    )

        profile_helper_start = installers_text.find("export function sideloadToolProfile")
        tool_definitions_text = (
            installers_text[:profile_helper_start]
            if profile_helper_start >= 0
            else installers_text
        )
        tool_count = tool_definitions_text.count("toolType:")
        if tool_count < 12:
            error(f"Central sideload registry unexpectedly contains only {tool_count} tool profiles")
        for field in (
            "targets: Object.freeze",
            "hostPlatforms: Object.freeze",
            "computerMode:",
            "openSource:",
            "sourceSupport:",
            "resourceBadges: Object.freeze",
            "recommendationRoles: Object.freeze",
            "resourceOrder:",
            "creditOrder:",
            "resourceDescriptionKey:",
            "creditDescriptionKey:",
            "creditBadge:",
            "creditLinkKey:",
            "troubleshooting:",
        ):
            field_count = tool_definitions_text.count(field)
            if field_count != tool_count:
                error(
                    "Every central sideload tool must have a complete profile; "
                    f"{field!r} appears {field_count} times for {tool_count} tools"
                )

        for tool_id, troubleshooting_url in (
            ("atvloadly", "https://github.com/bitxeno/atvloadly/wiki/FAQ"),
            ("impactor", "https://github.com/claration/Impactor/issues"),
            ("trollstore", "https://github.com/opa334/TrollStore/issues"),
        ):
            marker = f"id: '{tool_id}'"
            start = tool_definitions_text.find(marker)
            next_profile = tool_definitions_text.find("\n    id: '", start + len(marker)) if start >= 0 else -1
            block = tool_definitions_text[start:next_profile if next_profile >= 0 else len(tool_definitions_text)] if start >= 0 else ""
            links_match = re.search(r"links:\s*Object\.freeze\(\{([\s\S]*?)\}\)", block)
            if not links_match or troubleshooting_url not in links_match.group(1):
                error(f"{tool_id} troubleshooting URL must live inside links.troubleshooting")

        if "resourceBadges: Object.freeze(['freeVerified', 'resourceSideloading', 'Sources'])" not in installers_text:
            error("FlareStore Resources profile must keep FREE verified, Sideloading and Sources badges")
        if "icon: 'assets/icons/flarestore.svg'" not in installers_text:
            error("FlareStore must use the local stable icon asset")
        if "https://flarestore.app/favicon.ico" in installers_text:
            error("FlareStore must not depend on the external favicon")

        for required_sideinstaller_profile in (
            "ios27: 'on-device'",
            "ios17to26: 'pairing-file-required'",
        ):
            if required_sideinstaller_profile not in installers_text:
                error(
                    "SideInstaller compatibility profile is incomplete; "
                    f"missing {required_sideinstaller_profile!r}"
                )

    builder_page = ROOT / "builder.html"
    if builder_page.exists():
        builder_page_text = builder_page.read_text(encoding="utf-8")
        for required_queue_ui in (
            'id="builderTargets" class="builder-target-picker-host"',
            'id="expAddTarget"',
            'id="expCopyUrl"',
            'id="expRestartQueue"',
            'id="expQueueList"',
            'id="mixCompatibilityHelp"',
        ):
            if required_queue_ui not in builder_page_text:
                error(
                    "Builder direct Source queue UI is incomplete; "
                    f"missing {required_queue_ui!r}"
                )
        for obsolete_mix_ui in (
            "Build Mix",
            "Download JSON",
            "Preview JSON",
            'id="expDownload"',
            'id="expPreview"',
            'data-exp-compat-filter',
        ):
            if obsolete_mix_ui in builder_page_text:
                error(
                    "Builder must not restore combined Mix UI; "
                    f"found {obsolete_mix_ui!r}"
                )
        if 'class="builder-target-tabs"' in builder_page_text:
            error("Builder must not restore the large installer target card grid")

    installers_script = JS_DIR / "installers.js"
    if installers_script.exists():
        installers_text = installers_script.read_text(encoding="utf-8")
        for required_source_builder_arch in (
            "export const SOURCE_BUILDER_INSTALLER_IDS",
            "export const DEFAULT_SOURCE_BUILDER_INSTALLER_ID",
            "capabilities?.includes('source')",
        ):
            if required_source_builder_arch not in installers_text:
                error(
                    "installers.js must define direct Source Builder targets; "
                    f"missing {required_source_builder_arch!r}"
                )

    builder_script = JS_DIR / "builder.js"
    if builder_script.exists():
        builder_text = builder_script.read_text(encoding="utf-8")
        for required_direct_queue in (
            "SOURCE_BUILDER_INSTALLER_IDS",
            "DEFAULT_SOURCE_BUILDER_INSTALLER_ID",
            "function targetCompatibility(source)",
            "function queueEntries()",
            "function startQueue()",
            "sourceVariantURL(source, installer.variant)",
            "installer.buildLink(sourceUrl)",
            "window.location.href = entries[0].deepLink",
            "urls.join('\\n')",
            "$('#expAddTarget')?.addEventListener('click'",
            "$('#expQueueList')?.addEventListener('click'",
        ):
            if required_direct_queue not in builder_text:
                error(
                    "Builder direct Source queue is incomplete; "
                    f"missing {required_direct_queue!r}"
                )
        for picker_required in (
            'class="builder-target-picker"',
            'class="builder-target-menu"',
            "role=\"option\"",
            "$('#builderTargets')?.addEventListener('click'",
        ):
            if picker_required not in builder_text:
                error(
                    "Builder installer target dropdown is incomplete; "
                    f"missing {picker_required!r}"
                )
        for obsolete_mix_code in (
            "hostCustomMix",
            "data/mix-api.json",
            "source-cache/",
            "sanitizeClassicApp",
            "dedupe(payloads)",
            "hostedTarget(ids)",
            "JSON.stringify(mix",
            "blobUrl",
        ):
            if obsolete_mix_code in builder_text:
                error(
                    "Builder must use original Source URLs, not generated Mix JSON; "
                    f"found {obsolete_mix_code!r}"
                )
        if "$('[data-exp-target]').forEach(button => button.addEventListener" in builder_text:
            error("Builder target picker must use delegated events so re-rendered options keep working")

    mix_api_config = ROOT / "data" / "mix-api.json"
    if mix_api_config.exists():
        error("Obsolete data/mix-api.json must be removed; direct Source Builder does not use a Mix API")

    source_updater = ROOT / "tools" / "update_sources.py"
    if source_updater.exists():
        updater_text = source_updater.read_text(encoding="utf-8")
        for required in (
            "duplicate_bundle_report",
            "direct_installer_compatibility",
            "DIRECT_SOURCE_INSTALLERS",
            "STRICT_DUPLICATE_BUNDLE_INSTALLERS",
            "TOLERANT_DUPLICATE_BUNDLE_INSTALLERS",
            "DUPLICATE_BUNDLE_EXAMPLE_LIMIT",
            "key = raw_bundle.lower()",
            '"duplicateBundleIdentifiers"',
            '"installerCompatibility"',
            '"directSource": "fail"',
            '"installVariants": "try"',
            'status = {"generatedAt": generated_at, "sources": {}}',
        ):
            if required not in updater_text:
                error(
                    "update_sources.py must expose direct per-installer Source compatibility; "
                    f"missing {required!r}"
                )
        for obsolete_generator_part in (
            "MIX_DIR",
            "ALTSTORE_DIR",
            "SIDESTORE_DIR",
            "make_mix",
            "make_store_source",
            "dedupe_apps",
            "sanitize_classic_app",
            "mixTest",
            "mixReason",
        ):
            if obsolete_generator_part in updater_text:
                error(
                    "update_sources.py still contains obsolete combined-Mix generation code; "
                    f"found {obsolete_generator_part!r}"
                )

    status_file = ROOT / "data" / "status.json"
    if status_file.exists():
        try:
            status_text = status_file.read_text(encoding="utf-8")
            if len(status_text.encode("utf-8")) > STATUS_MOBILE_PAYLOAD_LIMIT_BYTES:
                error(
                    "data/status.json is too large for the mobile runtime payload; "
                    f"keep it below {STATUS_MOBILE_PAYLOAD_LIMIT_BYTES // 1024} KB"
                )
            status_payload = json.loads(status_text)
            for obsolete_section in ("mixes", "altstore", "sidestore"):
                if obsolete_section in status_payload:
                    error(
                        f"data/status.json still publishes obsolete generated Source section "
                        f"{obsolete_section!r}"
                    )
            for source_id, source_status in (status_payload.get("sources") or {}).items():
                duplicate_report = source_status.get("duplicateBundleIdentifiers") or {}
                items = duplicate_report.get("items") or []
                if len(items) > 20:
                    error(
                        f"data/status.json stores too many duplicate bundle examples for {source_id!r}; "
                        "keep diagnostics capped to avoid bloating the mobile status payload"
                    )
        except (json.JSONDecodeError, OSError) as exc:
            error(f"Unable to validate data/status.json duplicate bundle diagnostics: {exc}")

    legacy_brand = "AltStore · SideStore · LiveContainer"
    for page in SITE_PAGES:
        if page.exists() and legacy_brand in page.read_text(encoding="utf-8"):
            error(
                f"{page.name} still hard-codes the legacy installer trio in site branding; "
                "use installer-neutral branding"
            )

    credits_page = ROOT / "credits.html"
    if credits_page.exists() and 'id="sourceCredits"' not in credits_page.read_text(encoding="utf-8"):
        error("credits.html must contain the dynamic Source catalogue credits host")
    if credits_page.exists() and 'id="featuredCredits"' not in credits_page.read_text(encoding="utf-8"):
        error("credits.html must contain the dynamic Featured apps & services host")

    resources_page = ROOT / "resources.html"
    credits_script = JS_DIR / "credits.js"
    resources_script = JS_DIR / "resources.js"
    guide_script = JS_DIR / "guide.js"

    registry_driven_tool_scripts = {
        "resources.js": ("SIDELOAD_TOOLS", "resourceBadgeSpecs", "resourceSideloadTools", "resourceDescriptionKey", "sideloadToolURL", "buildResourceSideloadCard", "renderSideloadResourceCards", "sideloadResourceGrid", "hydrateSideloadToolCards", "renderSideloadToolBadges", "dataset.toolType", "dataset.capabilities", "dataset.targets", "dataset.hostPlatforms", "dataset.computerMode", "dataset.sourceSupport", "dataset.openSource", "dataset.resourceBadges"),
        "credits.js": ("SIDELOAD_TOOLS", "CORE_SIDELOAD_RESOURCE_NAMES", "creditSideloadTools", "creditDescriptionKey", "creditBadge", "creditLinkKey", "sideloadToolURL", "buildSideloadCreditCard", "renderSideloadCreditCards", "sideloadCreditGrid", "hydrateSideloadCreditCards", "dataset.toolType", "dataset.capabilities", "dataset.targets", "dataset.hostPlatforms", "dataset.computerMode", "dataset.sourceSupport", "dataset.openSource", "dataset.resourceBadges"),
        "guide.js": ("sideloadTool", "sideloadToolForRole", "sideloadToolURL", "troubleshootingSideloadTools", "hydrateGuideToolRegistryReferences", "handleToolScopeKeydown", "guideNodeSupportsTool", "filterGuideScopeGroup", "updateGuideScopeContent", "toolScopeActive", "data-guide-tool-link", "data-guide-tool-icon", "renderOfficialToolReferences", "officialHelpSources", "guideOfficialLinks", "selectedTroubleToolId", "guideTroubleshootingTools", "catalogPriority", "resourceOrder", "updateTroubleScopeControls", "data-assistant-tool", "data-trouble-tool", "renderToolScopePicker", "setToolScope", "data-guide-tool-scope", "url.searchParams.set('tool'", "troubleTermMatches", "troubleshootingToolAliases", "troubleshootingToolForQuery", "scopedTroubleQuery", "symptomScore > 0", "/install|installation|instal|nainstal/", "toolBoost", "document.querySelectorAll('.trouble-item')", "document.querySelectorAll('[data-guide-mode]')", "document.querySelectorAll('.assistant-tried-options [data-tried-key]')", "GUIDE_RECOMMENDATION_ROUTES", "recommendationToolURL", "SETUP_RESULT_ROUTES", "setupResultToolURL", "routeToolURL"),
    }
    for script_name, required_parts in registry_driven_tool_scripts.items():
        script = JS_DIR / script_name
        if not script.exists():
            continue
        script_text = script.read_text(encoding="utf-8")
        for required_part in required_parts:
            if required_part not in script_text:
                error(
                    f"{script_name} must use the central sideload tool registry; missing {required_part!r}"
                )

    installer_registry_consumers = ("app.js", "builder.js", "resources.js", "credits.js", "guide.js")
    installer_registry_versions = {}
    for script_name in installer_registry_consumers:
        script = JS_DIR / script_name
        if not script.exists():
            continue
        script_text = script.read_text(encoding="utf-8")
        match = re.search(r"\./installers\.js\?v=([^'\"]+)", script_text)
        if not match:
            error(f"{script_name} must import installers.js with an explicit cache version")
            continue
        installer_registry_versions[script_name] = match.group(1)
    if len(set(installer_registry_versions.values())) > 1:
        error(
            "Central installers.js consumers use different cache versions: "
            + ", ".join(f"{name}={version}" for name, version in sorted(installer_registry_versions.items()))
        )

    guide_page = ROOT / "guide.html"
    if guide_page.exists():
        guide_page_text = guide_page.read_text(encoding="utf-8")
        for required_host in ('id="officialHelpSources"', 'id="guideOfficialLinks"', 'id="guideToolScope"', 'id="guideToolScopeButton"', 'id="guideToolScopeMenu"'):
            if required_host not in guide_page_text:
                error(f"guide.html is missing registry-driven official reference host {required_host!r}")
        if 'data-guide-tool-scope=' in guide_page_text:
            error("guide.html must keep installer focus options registry-driven; do not hard-code installer choices in HTML")
        for scoped_filter_marker in (
            'data-assistant-tool="sidestore"',
            'data-assistant-tool="livecontainer"',
            'data-assistant-tool="altstore"',
            'data-trouble-tool="sidestore"',
            'data-trouble-tool="livecontainer"',
            'data-trouble-tool="altstore"',
        ):
            if scoped_filter_marker not in guide_page_text:
                error(
                    "Guide tool-specific quick filters must follow the selected installer scope; "
                    f"missing {scoped_filter_marker!r}"
                )

        required_registry_guide_links = (
            ('sideinstaller', 'guide'),
            ('sidestore', 'prerequisites'),
            ('altstore', 'classicGuide'),
            ('livecontainer', 'lcSideStore'),
            ('livecontainer', 'repository'),
            ('sideloadly', 'guide'),
            ('trollstore', 'guide'),
            ('atvloadly', 'guide'),
            ('flarestore', 'guide'),
            ('feather', 'guide'),
        )
        for tool_id, purpose in required_registry_guide_links:
            marker = f'data-guide-tool-link="{tool_id}" data-guide-tool-purpose="{purpose}"'
            if marker not in guide_page_text:
                error(
                    "Guide general installer links must be registry-driven; "
                    f"missing {tool_id!r}/{purpose!r}"
                )
        source_section_start = guide_page_text.find('id="source-installers"')
        compatibility_start = guide_page_text.find('id="compatibility"')
        if source_section_start < 0 or compatibility_start <= source_section_start:
            error("Guide must keep Source-capable installers in a separate section before Compatibility")
        for scoped_tool in ("flarestore", "feather"):
            marker = f'data-guide-tools="{scoped_tool}"'
            source_card_start = guide_page_text.find(marker, source_section_start, compatibility_start)
            if source_card_start < 0:
                error(
                    "Guide Source-compatible installers section is incomplete; "
                    f"missing Source card for {scoped_tool!r}"
                )
            if guide_page_text.count(marker) < 2:
                error(
                    "Guide must include each Source-capable installer in both the Source installer section "
                    f"and compatibility table; missing repeated scope marker for {scoped_tool!r}"
                )

        altstore_classic_marker = 'data-guide-tool-link="altstore" data-guide-tool-purpose="classicGuide"'
        if guide_page_text.count(altstore_classic_marker) < 2:
            error("Guide beginner cards must keep both AltStore Classic links registry-driven")

        trouble_search_values = re.findall(r'<details\b[^>]*data-search="([^"]+)"', guide_page_text)
        trouble_search_text = " ".join(trouble_search_values).lower()
        expected_trouble_tokens = (
            "altstore",
            "altstore pal",
            "sidestore",
            "livecontainer",
            "flarestore",
            "feather",
            "sideinstaller",
            "sideloadly",
            "atvloadly",
            "iloader",
            "impactor",
            "trollstore",
        )
        for tool_token in expected_trouble_tokens:
            if tool_token not in trouble_search_text:
                error(
                    "Guide troubleshooting must cover every central installer by name; "
                    f"missing searchable diagnostics for {tool_token!r}"
                )

        trouble_tool_ids = set(re.findall(r'<details\b[^>]*data-tool="([^"]+)"', guide_page_text))
        for tool_id in (
            "altstore",
            "altstore-pal",
            "sidestore",
            "livecontainer",
            "flarestore",
            "feather",
            "sideinstaller",
            "sideloadly",
            "atvloadly",
            "iloader",
            "impactor",
            "trollstore",
        ):
            if tool_id not in trouble_tool_ids:
                error(
                    "Guide troubleshooting must tag at least one diagnostic with each installer id; "
                    f"missing data-tool for {tool_id!r}"
                )

        trouble_items = []
        for match in re.finditer(
            r'<details class="([^"]*\btrouble-item\b[^"]*)"([^>]*)>([\s\S]*?)</details>',
            guide_page_text,
        ):
            classes, attrs, body = match.groups()
            tool_match = re.search(r'data-tool="([^"]+)"', attrs)
            search_match = re.search(r'data-search="([^"]*)"', attrs)
            title_match = re.search(r"<summary[^>]*>([\s\S]*?)</summary>", body)
            trouble_items.append(
                {
                    "classes": classes,
                    "tool": tool_match.group(1) if tool_match else "",
                    "search": (search_match.group(1) if search_match else "").lower(),
                    "title": re.sub(r"<[^>]+>", " ", title_match.group(1) if title_match else "").strip(),
                    "text": re.sub(r"<[^>]+>", " ", body).lower(),
                }
            )

        trouble_aliases = {
            "altstore": ("altstore", "altstore classic"),
            "altstore-pal": ("altstore pal", "altstore-pal"),
            "sidestore": ("sidestore",),
            "livecontainer": ("livecontainer",),
            "flarestore": ("flarestore",),
            "feather": ("feather",),
            "sideinstaller": ("sideinstaller",),
            "sideloadly": ("sideloadly",),
            "atvloadly": ("atvloadly",),
            "iloader": ("iloader",),
            "impactor": ("impactor",),
            "trollstore": ("trollstore",),
        }

        def normalize_trouble_tool_text(value: str) -> str:
            return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", value.lower())).strip()

        def audit_tool_for_query(query: str) -> str:
            normalized_query = normalize_trouble_tool_text(query)
            matches = []
            for tool_id, aliases in trouble_aliases.items():
                for alias in aliases:
                    normalized_alias = normalize_trouble_tool_text(alias)
                    if normalized_alias and normalized_alias in normalized_query:
                        matches.append((len(normalized_alias), tool_id))
            return max(matches)[1] if matches else ""

        def audit_term_matches(haystack: str, term: str) -> bool:
            if not term:
                return False
            if re.fullmatch(r"[a-z0-9_-]+", term, re.IGNORECASE):
                return term in re.findall(r"[a-z0-9_-]+", haystack, re.IGNORECASE)
            return term in haystack

        def audit_trouble_top(query: str, selected_tool: str = "") -> tuple[str, str]:
            terms = list(dict.fromkeys(term for term in query.lower().split() if term))
            preferred_tool = selected_tool or audit_tool_for_query(query)
            preferred_terms = {
                token
                for alias in trouble_aliases.get(preferred_tool, ())
                for token in normalize_trouble_tool_text(alias).split()
            }
            symptom_terms = [term for term in terms if term not in preferred_terms]
            ranked = []
            for index, item in enumerate(trouble_items):
                if selected_tool and item["tool"] and item["tool"] != selected_tool:
                    continue

                def score_terms(values):
                    score = 0
                    for term in values:
                        if audit_term_matches(item["search"], term):
                            score += 4 if any(ch.isdigit() for ch in term) else 2
                        elif audit_term_matches(item["text"], term):
                            score += 3 if any(ch.isdigit() for ch in term) else 1
                    return score

                base_score = score_terms(terms)
                if base_score <= 0:
                    continue
                symptom_score = score_terms(symptom_terms)
                tool_boost = 12 if preferred_tool and item["tool"] == preferred_tool and symptom_score > 0 else 0
                competing_penalty = 0.75 if preferred_tool and item["tool"] and item["tool"] != preferred_tool else 0
                community_penalty = 0.15 if "community-item" in item["classes"] else 0
                ranked.append(
                    (
                        base_score + tool_boost - competing_penalty - community_penalty,
                        base_score,
                        -index,
                        item["tool"],
                        item["title"],
                    )
                )
            if not ranked:
                return "", ""
            ranked.sort(reverse=True)
            return ranked[0][3], ranked[0][4]

        trouble_regressions = (
            ("Feather install", "feather install ipa app", "", "feather", ""),
            ("FlareStore install", "flarestore install ipa app", "", "flarestore", ""),
            ("atvloadly Apple TV", "atvloadly apple tv", "", "atvloadly", ""),
            ("SideInstaller HTTP 503", "sideinstaller apple login 503 2fa 1004 verification code", "", "sideinstaller", ""),
            ("AltStore 7-day expiry", "altstore refresh", "", "", "expired after 7 days"),
            ("AltStore app limit", "altstore 3 app limit app ids 1009 2009", "", "", "3-app or App ID limit"),
            ("selected SideStore refresh", "sidestore refresh", "sidestore", "sidestore", ""),
            ("selected AltStore PAL install", "altstore pal install ipa app", "altstore-pal", "altstore-pal", ""),
            ("selected Feather integrity", "feather integrity", "feather", "feather", ""),
            ("selected Sideloadly provisioning", "sideloadly certificate provision provisioning", "sideloadly", "sideloadly", "Sideloadly fails"),
        )
        for label, query, selected_tool, expected_tool, expected_title in trouble_regressions:
            actual_tool, actual_title = audit_trouble_top(query, selected_tool)
            if actual_tool != expected_tool or (expected_title and expected_title.lower() not in actual_title.lower()):
                error(
                    "Guide troubleshooting matcher regression failed for "
                    f"{label!r}: got tool={actual_tool!r}, title={actual_title!r}"
                )

    guide_script = JS_DIR / "guide.js"
    if guide_script.exists():
        guide_text = guide_script.read_text(encoding="utf-8")
        forbidden_single_collection_selectors = (
            "const tabs = $('[data-guide-mode]')",
            "return $('.assistant-tried-options [data-tried-key]').find",
            "return $('.trouble-item')",
            "const options = $('[data-guide-tool-scope]')",
            "$('[data-assistant-tool], [data-trouble-tool]').forEach",
            "const scopedNodes = $('[data-guide-tools]')",
        )
        for forbidden_selector in forbidden_single_collection_selectors:
            if forbidden_selector in guide_text:
                error(
                    "guide.js uses a single-element selector where a collection is required; "
                    f"found {forbidden_selector!r}"
                )

        for selector in (
            "[data-guide-tool-scope]",
            "[data-guide-tool-link]",
            "[data-guide-tool-icon]",
        ):
            pattern = rf"(?<!\$)\$\('{re.escape(selector)}'\)\.forEach"
            if re.search(pattern, guide_text):
                error(
                    "guide.js uses a single-element selector where a collection is required; "
                    f"found single-element forEach selector {selector!r}"
                )
        setup_start = guide_text.find("const SETUP_RESULTS = {")
        setup_end = guide_text.find("const SETUP_RESULT_ROUTES", setup_start)
        recommendation_start = guide_text.find("const GUIDE_RECOMMENDATIONS = {")
        recommendation_end = guide_text.find("const GUIDE_RECOMMENDATION_ROUTES", recommendation_start)

        for block_name, start, end in (
            ("SETUP_RESULTS", setup_start, setup_end),
            ("GUIDE_RECOMMENDATIONS", recommendation_start, recommendation_end),
        ):
            if start < 0 or end <= start:
                error(f"guide.js is missing {block_name} boundaries for registry audit")
                continue

            block = guide_text[start:end]
            for line in block.splitlines():
                if "url:'https://" not in line and "secondaryUrl:'https://" not in line:
                    continue
                if block_name == "SETUP_RESULTS" and "pairingNeeded:{" in line:
                    continue
                error(
                    f"guide.js {block_name} still contains a direct external tool URL; "
                    "use SETUP_RESULT_ROUTES / GUIDE_RECOMMENDATION_ROUTES and installers.js roles instead"
                )
                break

    dynamic_sideload_hosts = {
        "resources.html": 'id="sideloadResourceGrid"',
        "credits.html": 'id="sideloadCreditGrid"',
    }
    for page_name, host_marker in dynamic_sideload_hosts.items():
        page = ROOT / page_name
        if not page.exists():
            continue
        page_text = page.read_text(encoding="utf-8")
        if host_marker not in page_text:
            error(f"{page_name} is missing its registry-driven sideload card host {host_marker!r}")
        if 'data-sideload-tool=' in page_text:
            error(
                f"{page_name} still contains static sideload tool cards; "
                "generate them from installers.js instead"
            )

    if resources_page.exists():
        resources_text = resources_page.read_text(encoding="utf-8")
        for match in re.finditer(r'<article class="panel resource-card"[^>]*>([\s\S]*?)</article>', resources_text):
            card = match.group(1)
            name_match = re.search(r'<h3[^>]*>([\s\S]*?)</h3>', card)
            name = re.sub(r"<[^>]+>", "", name_match.group(1)).strip() if name_match else "unknown"
            icon_match = re.search(r'<div class="resource-icon[^"]*">([\s\S]*?)</div>', card)
            icon_html = icon_match.group(1) if icon_match else ""
            if "<img" not in icon_html and "hotkeyz-app-icon" not in icon_html:
                error(f"resources.html card {name!r} is missing a real icon")

    if credits_page.exists():
        credits_text = credits_page.read_text(encoding="utf-8")
        core_start = credits_text.find('data-credit-copy="coreTitle"')
        featured_start = credits_text.find('data-credit-copy="featuredTitle"')
        if core_start >= 0 and featured_start > core_start:
            core_block = credits_text[core_start:featured_start]
            for match in re.finditer(r'<article class="panel resource-card"[^>]*>([\s\S]*?)</article>', core_block):
                card = match.group(1)
                name_match = re.search(r'<h3[^>]*>([\s\S]*?)</h3>', card)
                name = re.sub(r"<[^>]+>", "", name_match.group(1)).strip() if name_match else "unknown"
                icon_match = re.search(r'<div class="resource-icon[^"]*">([\s\S]*?)</div>', card)
                icon_html = icon_match.group(1) if icon_match else ""
                if "<img" not in icon_html:
                    error(f"credits.html Core card {name!r} is missing a real icon")

    if resources_page.exists() and credits_script.exists():
        resources_text = resources_page.read_text(encoding="utf-8")
        credits_text = credits_script.read_text(encoding="utf-8")

        resource_names = re.findall(
            r'<article class="panel resource-card"[^>]*>[\s\S]*?<h3[^>]*>(.*?)</h3>',
            resources_text,
        )
        cleaned_resource_names = [
            re.sub(r"<[^>]+>", "", name).strip()
            for name in resource_names
            if re.sub(r"<[^>]+>", "", name).strip()
        ]
        duplicates = sorted({
            name for name in cleaned_resource_names
            if cleaned_resource_names.count(name) > 1
        })
        if duplicates:
            error("resources.html contains duplicate resource cards: " + ", ".join(duplicates))

        for required_part in (
            "loadFeaturedCredits",
            "fetch('resources.html'",
            "article.resource-card",
            "CORE_RESOURCE_NAMES",
        ):
            if required_part not in credits_text:
                error(
                    "credits.js must keep Featured apps & services generated from resources.html; "
                    f"missing {required_part!r}"
                )

    if credits_page.exists():
        credits_text = credits_page.read_text(encoding="utf-8")
        for match in re.finditer(r'<article class="panel resource-card"[^>]*>([\s\S]*?)</article>', credits_text):
            card = match.group(1)
            if 'btn primary' not in card:
                continue
            name_match = re.search(r'<h3[^>]*>([\s\S]*?)</h3>', card)
            name = re.sub(r"<[^>]+>", "", name_match.group(1)).strip() if name_match else "unknown"
            icon_match = re.search(r'<div class="resource-icon[^"]*">([\s\S]*?)</div>', card)
            icon_html = icon_match.group(1) if icon_match else ""
            if "<img" not in icon_html and "hotkeyz-app-icon" not in icon_html:
                error(f"credits.html card {name!r} is missing a real icon")
            button_match = re.search(r'<a class="[^"]*btn primary[^"]*"[^>]*>([\s\S]*?)</a>', card)
            if button_match and "brand-link-icon" not in button_match.group(1) and "hotkeyz-app-icon-small" not in button_match.group(1):
                error(f"credits.html card {name!r} button is missing its icon")

    for path in LEGACY_PATHS:
        if path.exists():
            error(f"Legacy/Cydia artifact must not exist on main: {path.relative_to(ROOT)}")

    index = ROOT / "index.html"
    if index.exists():
        text = index.read_text(encoding="utf-8")
        if "experimental-mix.js" in text:
            error("index.html still references obsolete experimental-mix.js")
        if "src/js/builder.js" in text:
            error("index.html must not load the standalone Builder runtime")

    for html in SITE_PAGES:
        validate_html_scripts(html)
        validate_security_policy(html)

    shared_css = CSS_DIR / "hub-extra.css"
    if shared_css.exists():
        shared_css_text = shared_css.read_text(encoding="utf-8")
        for required_css in ("safe-area-inset-left", "safe-area-inset-right", "prefers-reduced-motion"):
            if required_css not in shared_css_text:
                error(f"hub-extra.css is missing full-site mobile/accessibility guard: {required_css}")
        for forbidden_mobile_scroll in (
            ".filter-tabs>:first-child{margin-inline-start:auto}",
            ".filter-tabs>:last-child{margin-inline-end:auto}",
        ):
            if forbidden_mobile_scroll in shared_css_text:
                error(
                    "Mobile horizontal filters must keep both edges reachable; "
                    f"found {forbidden_mobile_scroll!r}"
                )
        for required_mobile_scroll in (
            "scroll-padding-inline:8px",
            ".filter-tabs,.trouble-quick,.assistant-tried-options",
            ".assistant-trouble-chips,.guide-jumpbar",
            ".filter-tabs{\n  display:grid;\n  grid-auto-flow:column;\n  grid-auto-columns:max-content;",
            "overflow-x:auto!important;",
            "touch-action:pan-y;",
        ):
            if required_mobile_scroll not in shared_css_text:
                error(
                    "hub-extra.css is missing the shared mobile horizontal scroller guard; "
                    f"missing {required_mobile_scroll!r}"
                )

        horizontal_scroll_script = JS_DIR / "horizontal-scroll.js"
        if not horizontal_scroll_script.exists():
            error("Missing shared horizontal-scroll.js runtime")
        else:
            horizontal_scroll_text = horizontal_scroll_script.read_text(encoding="utf-8")
            for required_scroll_js in (
                "document.addEventListener('wheel'",
                "document.addEventListener('touchstart'",
                "document.addEventListener('touchmove'",
                "event.preventDefault()",
            ):
                if required_scroll_js not in horizontal_scroll_text:
                    error(
                        "Shared horizontal scroll runtime is incomplete; "
                        f"missing {required_scroll_js!r}"
                    )

    builder_script = JS_DIR / "builder.js"
    if builder_script.exists():
        builder_text = builder_script.read_text(encoding="utf-8")
        for required_source_queue in (
            "SOURCE_BUILDER_INSTALLER_IDS",
            "function queueEntries()",
            "installer.buildLink(sourceUrl)",
            "window.location.href = entries[0].deepLink",
        ):
            if required_source_queue not in builder_text:
                error(
                    "builder.js must keep the direct original-Source queue; "
                    f"missing {required_source_queue!r}"
                )
        for forbidden_mix_runtime in (
            "hostCustomMix",
            "sanitizeClassicApp",
            "data/mix-api.json",
            "source-cache/",
        ):
            if forbidden_mix_runtime in builder_text:
                error(
                    "builder.js must not regenerate or host combined Source JSON; "
                    f"found {forbidden_mix_runtime!r}"
                )

    for search_script in ("app.js", "builder.js"):
        path = JS_DIR / search_script
        if path.exists() and "Object.values(source.description || {})" not in path.read_text(encoding="utf-8"):
            error(f"{search_script} must search every localized source description")

    for script_name in ("app.js", "builder.js"):
        script = JS_DIR / script_name
        if script.exists():
            script_text = script.read_text(encoding="utf-8")
            if "livecontainer://sources?url=" in script_text or "? 'sources' : 'source'" in script_text:
                error(f"{script_name} uses obsolete LiveContainer deep link; use livecontainer://source?url=")

    for required in (
        JS_DIR / "app.js",
        JS_DIR / "builder-page.js",
        JS_DIR / "builder.js",
        JS_DIR / "converter.js",
        JS_DIR / "guide.js",
        JS_DIR / "resources.js",
        JS_DIR / "credits.js",
        JS_DIR / "support-dialog.js",
        JS_DIR / "mobile-menu.js",
        JS_DIR / "settings-menu.js",
        JS_DIR / "horizontal-scroll.js",
        JS_DIR / "i18n.js",
        CSS_DIR / "styles.css",
        CSS_DIR / "hub-extra.css",
        CSS_DIR / "collapsible.css",
        CSS_DIR / "converter.css",
        ROOT / "vendor" / "libarchive" / "libarchive.js",
        ROOT / "vendor" / "libarchive" / "worker-bundle.js",
        ROOT / "vendor" / "libarchive" / "libarchive.wasm",
        ROOT / "vendor" / "jszip" / "jszip.min.js",
    ):
        if not required.exists():
            error(f"Missing required runtime file: {required.relative_to(ROOT)}")


def validate_compliance_register() -> None:
    path = ROOT / "COMPLIANCE.md"
    if not path.exists():
        error("Missing COMPLIANCE.md")
        return

    text = path.read_text(encoding="utf-8")
    registry = load_json(REGISTRY)
    if not isinstance(registry, dict) or not isinstance(registry.get("sources"), list):
        return

    sources = [item for item in registry["sources"] if isinstance(item, dict)]
    counts: dict[str, int] = {}
    approved = 0
    binary_rehost = 0
    for source in sources:
        compliance = source.get("compliance")
        if not isinstance(compliance, dict):
            continue
        status = str(compliance.get("reviewStatus") or "missing")
        counts[status] = counts.get(status, 0) + 1
        if compliance.get("aggregationApproved") is True:
            approved += 1
        if compliance.get("binaryRehost") is True:
            binary_rehost += 1

        source_id = str(source.get("id") or "")
        if source_id and f"`{source_id}`" not in text:
            error(f"COMPLIANCE.md is missing Source ID {source_id!r}")

    expected_lines = (
        f"- Total Sources: **{len(sources)}**",
        f"- Licensed: **{counts.get('licensed', 0)}**",
        f"- Permission: **{counts.get('permission', 0)}**",
        f"- Public metadata / link-only: **{counts.get('public-metadata', 0)}**",
        f"- Restricted: **{counts.get('restricted', 0)}**",
        f"- Unreviewed: **{counts.get('unreviewed', 0)}**",
        f"- Aggregation approved: **{approved}**",
        f"- Binary rehosting enabled: **{binary_rehost}**",
    )
    for expected in expected_lines:
        if expected not in text:
            error(f"COMPLIANCE.md summary is stale; missing {expected!r}")


def main() -> int:
    validate_registry()
    validate_generated_data()
    validate_layout()
    validate_internal_links()
    validate_interactive_guide()
    validate_page_quality()
    validate_translations()
    validate_privacy_compliance()
    validate_compliance_register()
    validate_project_identity()

    for message in warnings:
        print(f"WARNING: {message}")
    if errors:
        for message in errors:
            print(f"ERROR: {message}", file=sys.stderr)
        print(f"Audit failed with {len(errors)} error(s).", file=sys.stderr)
        return 1

    print("Repository audit passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
