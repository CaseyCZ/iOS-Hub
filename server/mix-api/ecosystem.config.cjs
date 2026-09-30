module.exports = {
  apps: [{
    name: 'ioshub-mix-api',
    script: './server.mjs',
    cwd: __dirname,
    env: {
      HOST: '127.0.0.1',
      PORT: '8787',
      MIX_TTL_HOURS: '24',
      MAX_SOURCES: '30',
      RATE_LIMIT_PER_HOUR: '60',
      SITE_BASE_URL: 'https://caseycz.github.io/iOS-Hub',
      PUBLIC_BASE_URL: 'https://YOUR-HTTPS-HOST/ioshub-mix',
      ALLOWED_ORIGINS: 'https://caseycz.github.io,https://raw.githack.com'
    }
  }]
};
