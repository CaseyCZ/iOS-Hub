#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "sources" / "registry.json"
STATUS = ROOT / "data" / "status.json"
CATALOG = ROOT / "data" / "catalog.json"

EXPECTED_SITE_URL = "https://caseycz.github.io/iOS-Hub/"
EXPECTED_REPO_URL = "https://github.com/CaseyCZ/iOS-Hub"
EXPECTED_PROJECT_NAME = "CaseyCZ iOS Hub"
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
    ROOT / "app.js",
    ROOT / "builder-page.js",
    ROOT / "builder.js",
    ROOT / "i18n.js",
    ROOT / "tools" / "update_sources.py",
    ROOT / ".github" / "workflows" / "update-sources.yml",
)

LANGUAGES = ("en", "cs", "de", "es", "fr")
ALLOWED_MODES = {"classic", "pal", "sidestore"}
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
        for attr in ("data-i18n", "data-i18n-placeholder"):
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
    for part in REQUIRED_CSP_PARTS:
        if part not in csp:
            error(f"{label} CSP is missing required directive: {part}")


def validate_translations() -> None:
    i18n_path = ROOT / "i18n.js"
    if not i18n_path.exists():
        error("Missing i18n.js")
        return

    used: set[str] = set()
    for html in (ROOT / "index.html", ROOT / "builder.html", ROOT / "converter.html"):
        parser = parse_page(html)
        if parser:
            used.update(parser.i18n_keys)

    for script in (ROOT / "app.js", ROOT / "builder-page.js", ROOT / "converter.js"):
        if not script.exists():
            continue
        text = script.read_text(encoding="utf-8")
        used.update(re.findall(r"\btr\(\s*['\"]([A-Za-z0-9_]+)['\"]\s*\)", text))

    i18n_text = i18n_path.read_text(encoding="utf-8")
    for key in sorted(used):
        occurrences = len(re.findall(rf"\b{re.escape(key)}\s*:", i18n_text))
        if occurrences < len(LANGUAGES):
            error(
                f"Translation key {key!r} is used by the UI but appears in only "
                f"{occurrences}/{len(LANGUAGES)} language dictionaries"
            )


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
        if EXPECTED_PROJECT_NAME not in text:
            error(f"index.html must use current project name {EXPECTED_PROJECT_NAME!r}")

    generator = ROOT / "tools" / "update_sources.py"
    if generator.exists():
        text = generator.read_text(encoding="utf-8")
        expected_base = f'BASE_URL = "{EXPECTED_SITE_URL}"'
        if expected_base not in text:
            error(f"tools/update_sources.py must define {expected_base}")

    expected_sources = {
        ROOT / "altstore" / "source.json": f"{EXPECTED_SITE_URL}altstore/source.json",
        ROOT / "sidestore" / "source.json": f"{EXPECTED_SITE_URL}sidestore/source.json",
    }
    for path, expected_source_url in expected_sources.items():
        payload = load_json(path)
        if not isinstance(payload, dict):
            continue
        if payload.get("website") != EXPECTED_SITE_URL:
            error(f"{path.relative_to(ROOT)} website must be {EXPECTED_SITE_URL}")
        if payload.get("sourceURL") != expected_source_url:
            error(f"{path.relative_to(ROOT)} sourceURL must be {expected_source_url}")


def validate_registry() -> None:
    payload = load_json(REGISTRY)
    if not isinstance(payload, dict) or not isinstance(payload.get("sources"), list):
        error("sources/registry.json must contain a sources array")
        return

    ids: dict[str, int] = {}
    urls: dict[str, int] = {}
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

        parsed = urlparse(url)
        if parsed.scheme != "https" or not parsed.netloc:
            error(f"registry source {source_id or index!r} must use an absolute HTTPS URL")
        elif url in urls:
            error(f"duplicate registry URL at indexes {urls[url]} and {index}: {url}")
        else:
            urls[url] = index

        if mode not in ALLOWED_MODES:
            error(f"registry source {source_id or index!r} has unsupported mode {mode!r}")

        if source.get("mergeable") is True and mode != "classic":
            error(f"registry source {source_id!r} is mergeable but mode is {mode!r}; only Classic sources may be pre-hosted")

        for key in ("official", "trusted", "recommended", "mergeable", "community", "modified"):
            if key in source and not isinstance(source[key], bool):
                error(f"registry source {source_id!r} field {key!r} must be boolean")


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

    validate_alt_source(ROOT / "altstore" / "source.json")
    validate_alt_source(ROOT / "sidestore" / "source.json")

    mix_dir = ROOT / "mix"
    if not mix_dir.is_dir():
        error("Missing generated mix directory")
    else:
        mix_files = sorted(mix_dir.glob("*.json"))
        if not mix_files:
            error("No generated Mix JSON files found")
        for path in mix_files:
            validate_alt_source(path)

    cache_dir = ROOT / "data" / "source-cache"
    if not cache_dir.is_dir():
        error("Missing data/source-cache directory")
    else:
        for path in sorted(cache_dir.glob("*.json")):
            payload = load_json(path)
            if not isinstance(payload, dict) or not isinstance(payload.get("apps"), list):
                error(f"{path.relative_to(ROOT)} is not a valid source cache with an apps array")


def validate_layout() -> None:
    for path in LEGACY_PATHS:
        if path.exists():
            error(f"Legacy/Cydia artifact must not exist on main: {path.relative_to(ROOT)}")

    index = ROOT / "index.html"
    if index.exists():
        text = index.read_text(encoding="utf-8")
        if "experimental-mix.js" in text:
            error("index.html still references obsolete experimental-mix.js")
        if "builder.js" not in text:
            error("index.html does not reference builder.js")

    for html in (ROOT / "index.html", ROOT / "builder.html", ROOT / "converter.html"):
        validate_html_scripts(html)
        validate_security_policy(html)

    for required in (
        ROOT / "app.js",
        ROOT / "builder-page.js",
        ROOT / "builder.js",
        ROOT / "converter.js",
        ROOT / "i18n.js",
        ROOT / "vendor" / "libarchive" / "libarchive.js",
        ROOT / "vendor" / "libarchive" / "worker-bundle.js",
        ROOT / "vendor" / "libarchive" / "libarchive.wasm",
        ROOT / "vendor" / "jszip" / "jszip.min.js",
    ):
        if not required.exists():
            error(f"Missing required runtime file: {required.relative_to(ROOT)}")


def main() -> int:
    validate_registry()
    validate_generated_data()
    validate_layout()
    validate_translations()
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
