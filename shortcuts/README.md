# iOS Hub Source Import

Shared Shortcut used by the Custom Source Builder.

Install / reinstall:
https://caseycz.github.io/iOS-Hub/shortcut.html

## Input format

The Builder passes plain text:

```text
<installer-id>
<source-url-1>
<source-url-2>
...
```

Current installer IDs:
- livecontainer
- altstore
- flarestore
- feather
- altstore-pal
- sidestore

The Shortcut keeps original Source URLs separate and opens them in the selected installer. The optional JSON export in the Builder is a separate feature and is not required for bulk import.

Installer behavior is intentionally not forced into one pattern: some apps can accept Sources directly, while others may show a preview or require confirmation. The Builder keeps a manual one-by-one fallback for those cases. LiveContainer bulk handoff has been verified on-device.
