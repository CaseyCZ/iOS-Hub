# iOS Hub Mix API

Small Node.js service for temporary Custom Builder Mixes.

- accepts only Source IDs from the iOS Hub catalogue
- validates the selected installer target
- fetches the checked source-cache JSON files from iOS Hub
- merges and deduplicates apps by bundle ID
- stores one JSON per unique Source combination
- serves the Mix through HTTPS via the existing Nginx reverse proxy
- Mix lifetime: 24 hours by default
- maximum: 30 Sources per Mix by default
- no npm dependencies

## Oracle setup

Copy this directory to the Oracle server, then:

```bash
cd server/mix-api
npm start
```

For PM2:

```bash
pm2 start ecosystem.config.cjs
pm2 save
```

Before starting, replace `https://YOUR-HTTPS-HOST/ioshub-mix` in `ecosystem.config.cjs` with the real public HTTPS address.

Add the contents of `nginx-location.example.conf` to the existing HTTPS Nginx `server {}` block and reload Nginx.

Test:

```bash
curl https://YOUR-HTTPS-HOST/ioshub-mix/health
```

The expected response includes `"ok":true`, `"ttlHours":24` and `"maxSources":30`.

Then put the same public base URL into `data/mix-api.json` on the iOS Hub site.
