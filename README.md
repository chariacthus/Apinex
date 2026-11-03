# APInex

A floating AI assistant that opens on top of any webpage using a bookmarklet. The bookmarklet calls a Vercel serverless function, which proxies requests to APInex while keeping the upstream API key in a Vercel environment variable.

## Deploy to Vercel

1. Upload the contents of this folder to the root of `https://github.com/chariacthus/Apinex`.
2. In Vercel, choose **Add New → Project** and import `chariacthus/Apinex`.
3. Name the Vercel project `apinex` if you want the default URL to be `https://apinex.vercel.app` and that domain is available to your account.
4. Deploy. No build command, framework preset, Node process, or package installation is required. Vercel automatically deploys the files in `/api` as serverless functions.
5. In **Vercel → Project → Settings → Environment Variables**, add:
   - `APINEX_API_KEY` = your newly generated APInex API key
   - `APINEX_MODEL` = `free/gpt-6-luna` (optional; this is already the default)
6. Save and redeploy so the function receives the new environment variables.
7. Open the deployed homepage. It automatically uses its own origin when generating the bookmarklet, so the copied code points to that deployment's `/api/chat` endpoint.

## Install the bookmarklet

On the deployed homepage:

- Click **Copy bookmarklet**, then create a browser bookmark named `APInex` and paste the copied code into its URL/address field; or
- Drag the **Drag to bookmarks bar** link directly onto the bookmarks bar.

Open any regular webpage and click the APInex bookmark. It opens a floating panel in the bottom-right corner. Click the same bookmark again to close it.

Some browser pages cannot run bookmarklets, including browser-internal pages, the Chrome Web Store, and certain restricted pages. HTTPS pages are recommended.

## API routes

- `GET /api/health` — returns whether the server-side API key is configured. It never returns the key.
- `POST /api/chat` — accepts `{ messages, stream, temperature }` and proxies to `https://api.apinex.bond/v1/chat/completions`.

The browser never receives the APInex API key. Do not put the key in `index.html`, bookmarklet source, `.env.example`, or GitHub.

## Security notes

- The previously pasted APInex key should be considered exposed. Revoke it and create a fresh key before deploying.
- The bookmarklet code contains the Vercel endpoint URL, not the APInex secret. Anyone with the bookmarklet can use your endpoint.
- `/api/chat` is a publicly reachable, billable relay. This project includes payload limits and a best-effort in-memory rate limit (12 requests per minute per IP per function instance). Vercel can run multiple instances and restart them, so this is not strong or shared rate limiting. For a public production deployment, add Vercel Firewall rate limiting or a shared persistent rate limiter, and monitor APInex usage.
- CORS is not authentication. The wildcard CORS setting is needed because a bookmarklet is launched from different websites. Restricting CORS to your own website would prevent cross-site bookmarklet calls.
- The page-context feature is off by default. When enabled, visible page text and the selected text are included in the prompt and sent to the APInex API.

## Files

- `index.html` — install page, bookmarklet generator, endpoint status and connection tester.
- `api/chat.js` — Vercel serverless chat proxy.
- `api/health.js` — non-secret configuration health check.
- `package.json` — enables ES modules for Vercel API functions.
- `.env.example` — placeholder environment variable names only.
- `.gitignore` — excludes local secrets and deployment files.
