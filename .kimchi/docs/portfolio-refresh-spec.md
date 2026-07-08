# Portfolio Refresh Spec

## Goal
Refresh the portfolio UI with a more colorful/modern theme, add file-upload support for profile and project photos, make all hero/about/contact content editable from the existing admin panel, add a CV download button, and ensure the site is fully responsive on all devices.

## Scope
- Frontend (Vue 3 + Vite)
- Backend (Node.js + Express)
- Admin panel (existing)
- No external database — keep JSON-file storage
- No external CMS or cloud storage
- Docker support with configurable data directory

## Target Users
- Site visitors (desktop, tablet, mobile)
- Admin (single user, password-protected)

## Visual Design Direction

### Color Palette
- Primary accent gradient: cyan → purple → pink (`#06b6d4 → #8b5cf6 → #ec4899`)
- Dark background: `#0a0a0b` primary, `#111113` secondary, `#18181b` card
- Light background: `#fafafa` primary, `#f4f4f5` secondary, `#ffffff` card
- Text: high-contrast primary/secondary/muted colors

### Visual Effects
- Glassmorphism cards: `background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.08)`
- Animated gradient mesh/blob background in hero
- Subtle hover lifts and glows on cards/buttons
- Gradient buttons with hover brightness shift

### Responsive Requirements
- Mobile first
- Breakpoints:
  - `< 640px`: single column, stacked layouts, hamburger menu
  - `640–1024px`: 2-column grids, adjusted spacing
  - `> 1024px`: full desktop layout
- Touch-friendly admin forms

## Data Architecture

All editable content stored in JSON files in a configurable directory (`backend/data/` locally, `/app/data` in Docker via `DATA_DIR` env var).

| File | Content |
|---|---|
| `projects.json` | Existing project list (extended with local image paths) |
| `skills.json` | Existing skill list |
| `settings.json` | Hero greeting, name, typed job titles array, hero bio |
| `about.json` | About heading, paragraphs array, tech-list array, profilePhoto path |
| `contact.json` | Email, phone, LinkedIn, GitHub, Telegram, location |

### File Uploads
- Multer stores uploads in `backend/uploads/`
- `backend/uploads/profile/` — profile photo
- `backend/uploads/projects/` — project thumbnails
- `backend/uploads/cv.pdf` — CV download file
- Served statically via Express at `/uploads`

## Backend API

### Existing (unchanged structure, JWT protected mutations)
- `GET /api/projects`
- `POST /api/projects` (JWT)
- `PUT /api/projects/:id` (JWT)
- `DELETE /api/projects/:id` (JWT)
- `GET /api/skills`
- `POST /api/skills` (JWT)
- `PUT /api/skills/:id` (JWT)
- `DELETE /api/skills/:id` (JWT)
- `POST /api/auth/login`

### New
- `GET /api/settings` — return `settings.json`
- `POST /api/settings` (JWT) — update `settings.json`
- `GET /api/about` — return `about.json`
- `POST /api/about` (JWT) — update `about.json`
- `GET /api/contact` — return `contact.json`
- `POST /api/contact` (JWT) — update `contact.json`
- `POST /api/upload/profile` (JWT) — upload profile image, return URL
- `POST /api/upload/project` (JWT) — upload project image, return URL
- `GET /api/download/cv` — serve `cv.pdf` with `Content-Disposition: attachment`

### Upload Validation
- Accept only `image/*`
- Max file size: 5 MB
- Reject invalid files with `400` and clear message

## Frontend Components

### Modified
- `App.vue` — update CSS variables for new color palette and glass styles
- `NavBar.vue` — add mobile hamburger menu, ensure all links work
- `HeroSection.vue` — fetch from `/api/settings`, add animated gradient background, add "Download CV" button
- `AboutSection.vue` — fetch from `/api/about`, use uploaded profile photo
- `ContactSection.vue` — fetch from `/api/contact`, display editable info and social links
- `ProjectsSection.vue` — use local image paths from `/uploads/projects/`
- `AdminPanel.vue` — add Settings, About, Contact tabs; add file upload inputs

### New
- `frontend/src/components/MobileMenu.vue` — mobile navigation drawer
- `frontend/src/components/GradientBackground.vue` — reusable animated gradient background

## Admin Panel Tabs

1. **Projects**
   - Existing list/edit/delete
   - Add Project modal now has file upload for thumbnail instead of URL input
   - Existing image URL field kept as fallback/optional

2. **Skills**
   - Existing CRUD (no change)

3. **About / Hero**
   - Form fields: greeting, name, typed titles (comma separated), hero bio
   - About heading and paragraphs
   - Tech list (comma separated)
   - Profile photo upload with preview

4. **Contact**
   - Form fields: email, phone, location
   - Social links: GitHub, LinkedIn, Telegram

## Error Handling

- API returns `401` for missing/invalid JWT on protected routes
- Upload returns `400` for invalid type or oversized file
- Frontend shows inline status messages for save/delete/upload errors
- Missing JSON files fall back to sensible defaults in frontend

## Security

- All content-mutating routes require JWT
- Password remains in `backend/routes/auth.js` (existing pattern)
- Uploads restricted by MIME type and size
- Static upload directory not directly writable by anonymous users

## Performance

- Keep using Vite production build
- Images served statically by Express/nginx
- JSON files loaded on component mount

## Testing Strategy

- `npm run build` in `frontend/` succeeds with no errors
- Backend starts with `node server.js`
- Manual API checks with `curl` for settings/about/contact CRUD
- Upload endpoint accepts/rejects correct file types
- CV download returns PDF
- Responsive check via browser dev tools at mobile/tablet/desktop widths

## Docker

- `DATA_DIR` environment variable controls where JSON files are stored
- Default: `backend/data/` (relative, for local dev)
- Docker: `DATA_DIR=/app/data` with volume mount
- `backend/data/*.json` files remain in repo as defaults/tests
- Dockerfiles and `docker-compose.yml` provided
