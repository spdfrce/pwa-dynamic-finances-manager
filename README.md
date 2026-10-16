# Dynamic Finances Manager (PWA)

Voice-friendly expense & income tracker, built for Edna. Originally a
single-file [Claude Artifact](https://claude.ai/artifact/QXSemi3UzWEBCfXfceCE95);
this repo repackages the same app as an installable, offline-capable PWA.

## Files

- `index.html` — the whole app (HTML/CSS/JS, unchanged from the artifact
  except for the PWA tags and service-worker registration added at the top
  and bottom).
- `manifest.json` — tells iOS/Android this is an installable app (name,
  icon, colors).
- `sw.js` — the service worker. Caches the app's files on first load so it
  can open with zero signal after that.
- `icons/` — generated app icons.
- `netlify.toml` — stops Netlify's CDN from caching `sw.js`/`manifest.json`,
  so updates aren't stuck invisible after a redeploy.

## Deploying (Netlify, drag-and-drop)

1. Go to [app.netlify.com](https://app.netlify.com) and sign up (free —
   email or GitHub login).
2. From the dashboard, drag this whole folder onto the "Add new site" /
   deploy drop zone.
3. Netlify gives you a `*.netlify.app` URL immediately — that's the live
   app.

To redeploy after a change: bump `CACHE_VERSION` at the top of `sw.js`,
then drag the folder onto the same site again (or connect the site to this
GitHub repo in Netlify's dashboard for auto-deploys on every push).

## Installing on iPhone

1. Open the Netlify URL in **Safari**.
2. Tap Share → **Add to Home Screen**.
3. Open it from the home screen icon — it runs full-screen, no Safari bar.
4. To confirm offline works: turn on Airplane Mode, then open the app from
   the home screen icon.

## Moving Edna's data from the old artifact link

Her data lives in the browser's local storage, which is tied to the old
`claude.ai` link and won't carry over to the new installed app on its own.
Walk her through:

1. **On the old link:** Settings tab → **Copy backup** → **Copy to
   clipboard**.
2. **On the new installed app:** Settings tab → **Restore backup** → paste
   → **Restore**.

Same feature, just used as a one-time migration.
