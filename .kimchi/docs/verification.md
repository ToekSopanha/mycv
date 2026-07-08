# Portfolio Refresh — Fix Verification

## Summary

All three review issues from `.kimchi/docs/review.md` were addressed and every
verification command listed in the fix spec passed.

## Fixes Applied

### 1. Hardcoded JWT secret — FIXED

- `backend/routes/auth.js` (line 7): now reads
  `const JWT_SECRET = process.env.JWT_SECRET || 'portfolio_jwt_secret_change_me';`
  so the secret is overridable per environment, with the original literal kept
  as a dev-only fallback.
- `backend/server.js`: added a startup `console.warn(...)` block right after
  `PORT` is defined. The warning fires only when `process.env.JWT_SECRET` is
  unset.
- `docker-compose.yml`: `backend` service now sets
  `JWT_SECRET: ${JWT_SECRET:-change_me_in_production}` so it is sourced from a
  host `.env` file (Compose substitutes the variable, falling back to a
  placeholder that still allows local boot but is clearly not production-safe).
- `DOCKER.md`: configuration table gained a `JWT_SECRET` row that flags the
  variable as "Must be overridden in production".

### 2. Missing Bootstrap / Bootstrap-Icons CSS — FIXED

- `frontend/src/main.js`: added the two CSS imports at the top of the file:
  ```js
  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'bootstrap-icons/font/bootstrap-icons.css'
  ```
- `bootstrap-icons` was not in `frontend/package.json` — installed via
  `npm install bootstrap-icons`. `package.json` now lists
  `"bootstrap-icons": "^1.13.1"`.

### 3. Hardcoded social links — FIXED

- `frontend/src/components/NavBar.vue`:
  - Added a `social` ref plus a `DEFAULT_SOCIAL` constant keeping the previous
    URLs as fallback defaults (GitHub `https://github.com/ToekSopanha`,
    Telegram `https://t.me/Toek_sopanha`, LinkedIn
    `https://linkedin.com/in/yourname`).
  - Added `loadContact()` that calls `GET /api/contact` on mount and merges
    `github`, `telegram`, `linkedin` into the ref, falling back to defaults
    if the response field is empty.
  - Each social anchor now binds `:href="social.X"` and renders only when the
    URL is truthy (`v-if="social.X"`).
- `frontend/src/components/MobileMenu.vue`:
  - Same `social` ref / `DEFAULT_SOCIAL` / `loadContact()` pattern, called from
    `onMounted`.
  - All three mobile drawer social anchors are bound to `social.github`,
    `social.telegram`, `social.linkedin` and gated on truthiness.

## Verification Commands & Results

### 1. Frontend install (bootstrap-icons added)

```
$ cd frontend && npm install bootstrap-icons --no-audit --no-fund
added 1 package in 1s
```

`frontend/package.json` now contains `"bootstrap-icons": "^1.13.1"`.

### 2. Frontend build

```
$ cd frontend && npm run build
vite v5.4.21 building for production...
✓ 100 modules transformed.
dist/index.html                               0.60 kB │ gzip:  0.36 kB
dist/assets/bootstrap-icons-mSm7cUeB.woff2  134.04 kB
dist/assets/bootstrap-icons-BeopsB42.woff   180.29 kB
dist/assets/profile-Bh5v-7Ys.jpg            500.43 kB
dist/assets/index-B0bEylc5.css              335.49 kB │ gzip: 50.80 kB
dist/assets/index-CKOS5wLV.js               194.39 kB │ gzip: 70.07 kB
✓ built in 642ms
```

Result: **PASS** — build succeeded; Bootstrap CSS and bootstrap-icons fonts
(woff + woff2) are now emitted into `dist/assets/`.

### 3. Backend syntax checks

```
$ cd backend && node --check server.js \
    && node --check routes/auth.js \
    && node --check routes/contact.js \
    && node --check routes/projects.js \
    && node --check routes/skills.js \
    && node --check routes/settings.js \
    && node --check routes/about.js \
    && node --check routes/upload.js \
    && node --check routes/cv.js \
    && node --check lib/dataPath.js
BACKEND_SYNTAX_OK
```

Result: **PASS** — every backend JS file parses cleanly.

### 4. Backend boot + health endpoint

```
$ cd backend && JWT_SECRET=testsecret PORT=3001 node server.js &
🚀 Portfolio API running at http://localhost:3001
(no JWT_SECRET warning — env var was honored)

$ curl -s http://localhost:3001/api/health
{"status":"OK","message":"Portfolio API is running"}

$ curl -s -X POST -H "Content-Type: application/json" \
       -d '{"password":"admin123"}' http://localhost:3001/api/auth/login
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}

$ curl -s -X POST -H "Authorization: Bearer $TOKEN" \
       -d '{"email":"test@example.com","github":"https://github.com/CustomUser",...}' \
       http://localhost:3001/api/contact
{"email":"test@example.com",...,"github":"https://github.com/CustomUser",...}

$ curl -s -o /dev/null -w "%{http_code}\n" -X POST \
       -d '{"email":"x"}' http://localhost:3001/api/contact
401
```

Result: **PASS** — server starts, `/api/health` returns 200, login succeeds,
authenticated `POST /api/contact` writes successfully, unauthenticated `POST`
returns 401.

### 5. JWT_SECRET env var is honored

Two startup runs were compared:

- `node server.js` (no env var) → log contains
  `⚠️  JWT_SECRET not set. Using default dev secret. Set JWT_SECRET in production.`
- `JWT_SECRET=testsecret node server.js` → no warning emitted; the token
  issued by `/api/auth/login` is signed with `testsecret` (visible JWT
  payload decoded by `jsonwebtoken.verify` on the protected route).

Result: **PASS** — the secret is read from `process.env.JWT_SECRET`, the
fallback is used only when unset, and a startup warning is emitted in that
case.

## Lint

No project-wide linter is configured (`package.json` has no `lint` script for
either frontend or backend). `node --check` acts as the syntax linter and
passed for all touched files. No new warnings were introduced.

## Remaining Work

None. All three review issues are resolved and every verification step in the
fix spec passes.

## Verdict

**ALL_PASS**
