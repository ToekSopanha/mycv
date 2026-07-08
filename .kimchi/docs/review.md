# Portfolio Refresh — Code Review

## Verdict: NEEDS_FIXES

The implementation covers the vast majority of the portfolio-refresh spec: the new API routes exist, JWT protection is wired, uploads are restricted, the frontend builds, Docker support is present, and the visual refresh is implemented. However, there are two functional/security issues that should be fixed before approval: a hardcoded JWT secret and missing Bootstrap/Bootstrap-Icons CSS for the admin panel.

---

## Issues

### 1. Hardcoded JWT secret weakens authentication security

- **File**: `/Users/mac/Documents/MY CV/CVWebsite/backend/routes/auth.js`
- **Line**: 7
- **Problem**: The JWT signing/verification secret is hardcoded:
  ```js
  const JWT_SECRET = 'portfolio_jwt_secret_change_me';
  ```
  Anyone with access to the source can mint valid admin tokens, bypassing the password check on all protected routes.
- **Suggested fix**: Read the secret from an environment variable, falling back to a generated/dev-only value only when appropriate:
  ```js
  const JWT_SECRET = process.env.JWT_SECRET || 'portfolio_jwt_secret_change_me';
  ```
  Better still, require it in production and refuse to start if it is unset:
  ```js
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is required');
    process.exit(1);
  }
  ```
  Update `docker-compose.yml` to pass `JWT_SECRET` (e.g. from an `.env` file) and document it in `DOCKER.md`.

### 2. Admin panel is missing Bootstrap and Bootstrap-Icons CSS

- **File**: `/Users/mac/Documents/MY CV/CVWebsite/frontend/src/main.js`
- **Line**: 1-6
- **Problem**: `AdminPanel.vue` relies heavily on Bootstrap 5 grid/utilities (`row`, `col-md-6`, `d-flex`, `gap-2`, `p-4`, etc.) and Bootstrap-Icons classes (`bi-shield-lock-fill`, `bi-pencil`, `bi-trash`, etc.). Neither `bootstrap/dist/css/bootstrap.css` nor `bootstrap-icons` CSS is imported anywhere in the app, and `index.html` does not load them from a CDN. As a result, the admin dashboard layout, spacing, grid, and icons will be broken for end users.
- **Suggested fix**: Import Bootstrap CSS in `main.js`:
  ```js
  import 'bootstrap/dist/css/bootstrap.min.css'
  ```
  For the icons, either add `bootstrap-icons` to `package.json` and import its CSS:
  ```js
  import 'bootstrap-icons/font/bootstrap-icons.css'
  ```
  or replace the `<i class="bi bi-...">` usages with inline SVGs consistent with the rest of the app.

### 3. Social links in NavBar and MobileMenu are hardcoded and partly placeholder

- **Files**:
  - `/Users/mac/Documents/MY CV/CVWebsite/frontend/src/components/NavBar.vue` (lines ~58-76)
  - `/Users/mac/Documents/MY CV/CVWebsite/frontend/src/components/MobileMenu.vue` (lines ~62-92)
- **Problem**: These components link to fixed URLs (`https://github.com/ToekSopanha`, `https://t.me/Toek_sopanha`, `https://linkedin.com/in/yourname`) instead of reading from `/api/contact`. The LinkedIn URL is still a placeholder (`yourname`). When an admin updates contact social links, the public navbar and mobile drawer will continue showing stale/incorrect URLs.
- **Suggested fix**: Fetch `/api/contact` in both components and bind the social anchors to the fetched values, with sensible defaults. Alternatively, remove the social links from the navbar/mobile drawer if they are intentionally static and ensure they match the current real profiles.

---

## Verification summary

### Commands run

1. `cd frontend && npm run build`
   - **Result**: succeeded with no errors.
   - Output showed 98 modules transformed and produced `dist/index.html`, `dist/assets/index-*.js`, `dist/assets/index-*.css`, and `dist/assets/profile-*.jpg`.

2. `cd backend && node --check server.js && node --check routes/*.js && node --check lib/dataPath.js`
   - **Result**: passed with no output (no syntax errors).

3. Started backend with `node server.js` and curled the public endpoints:
   - `GET /api/health` → `{"status":"OK","message":"Portfolio API is running"}`
   - `GET /api/settings` → returned `settings.json` content
   - `GET /api/about` → returned `about.json` content
   - `GET /api/contact` → returned `contact.json` content
   - `GET /api/projects` → returned project list
   - `GET /api/skills` → returned skill list
   - All returned HTTP 200 with valid JSON.

4. Security checks:
   - `POST /api/upload/profile` without token → HTTP 401.
   - `POST /api/settings` without token → HTTP 401.
   - `POST /api/upload/profile` with valid token but non-image file (`/etc/passwd`) → HTTP 400 `{"error":"Only image files are allowed"}`.
   - `POST /api/upload/profile` with valid token and oversized image → HTTP 400 `{"error":"File too large (max 5 MB)"}`.
   - `GET /api/download/cv` with `cv.pdf` present → HTTP 200, `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="cv.pdf"`.
   - `GET /api/download/cv` without `cv.pdf` → HTTP 404 JSON error.

### What works well

- All required backend routes exist and return expected data.
- Protected routes require JWT; unauthenticated requests are rejected with 401.
- Multer upload type/size restrictions work and return clear 400 messages.
- `DATA_DIR` is respected and `docker-compose.yml` sets it to `/app/data` with a named volume.
- Frontend builds cleanly, fallback content is present in `HeroSection.vue`, `AboutSection.vue`, and `ContactSection.vue`.
- CV download route serves the PDF with the correct attachment headers when the file exists.
- Responsive CSS breakpoints are present across components.

### Remaining work

- Address the three issues above (JWT secret, Bootstrap CSS, hardcoded social links).
- Optionally add a note to `DOCKER.md` about `JWT_SECRET` configuration once it is environment-driven.
