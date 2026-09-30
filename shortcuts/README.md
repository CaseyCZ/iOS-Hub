# iOS Hub Source Import

Shared Shortcut used by the Custom Source Builder.

Install / reinstall:
https://www.icloud.com/shortcuts/b8a48606455246389f066fc4f35af057

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
