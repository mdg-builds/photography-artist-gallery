# Sin Pedir Permiso

Website for Walter Gómez's photography exhibition *Sin Pedir Permiso*. Built with
Next.js (App Router), Postgres (via Prisma), and Vercel Blob for image storage.
Bilingual (English/Spanish) throughout, with a password-protected CMS at `/admin`
where the owner can edit every photograph, the home page, the project statement,
and the About bios — no code changes required.

## Stack

- **Next.js 16** (App Router, Server Actions, Turbopack)
- **Postgres** via **Prisma 7** (`@prisma/adapter-pg`)
- **Vercel Blob** for photo storage in production (falls back to `public/uploads`
  in local dev if no Blob token is configured, so you can develop with zero
  Vercel setup)
- Custom session auth (signed cookie via `jose`, password hashed with `bcryptjs`)
  — no third-party auth service, since there's only ever one owner account
- Hand-written CSS design system in `app/globals.css` (no Tailwind/UI kit)

## Local development

1. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — any Postgres connection string (see below for a quick local one)
   - `SESSION_SECRET` — `openssl rand -base64 32`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the owner's login (used only the first time you seed)
   - `BLOB_READ_WRITE_TOKEN` — leave empty locally; uploads will just be written to `public/uploads`

2. Install dependencies:
   ```
   npm install
   ```

3. Get a Postgres database. Easiest options:
   - **Local Postgres via Homebrew** (what this project was developed against):
     ```
     brew install postgresql@16
     brew services start postgresql@16
     createdb sinpedirpermiso
     ```
     Then set `DATABASE_URL="postgresql://<your-mac-username>@localhost:5432/sinpedirpermiso?schema=public"`
   - **Neon** (https://neon.tech) or **Vercel Postgres** — free tier, no local install, works the same way in dev and prod.

4. Run migrations and seed the database (admin account, the 10 exhibition
   photos, both bios, and all site copy):
   ```
   npm run db:migrate
   npm run db:seed
   ```

5. Start the dev server:
   ```
   npm run dev
   ```
   Visit http://localhost:3000, and http://localhost:3000/admin to sign in.

## Deploying to Vercel

1. Push this repo to GitHub and import it into Vercel.
2. In the Vercel project, add:
   - **Storage → Postgres** (or connect a Neon database) — this sets `DATABASE_URL` automatically.
   - **Storage → Blob** — create a store; this sets `BLOB_READ_WRITE_TOKEN` automatically.
3. Add the remaining environment variables in Project Settings → Environment Variables:
   - `SESSION_SECRET` (generate with `openssl rand -base64 32`)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` (only needed for the one-time seed below)
4. Deploy.
5. Run the migration + seed once against the production database (from your
   machine, with the production `DATABASE_URL`/`BLOB_READ_WRITE_TOKEN` in your
   local `.env`, or via `vercel env pull`):
   ```
   npm run db:deploy
   npm run db:seed
   ```
6. Sign in at `https://your-domain.com/admin` with the `ADMIN_EMAIL`/`ADMIN_PASSWORD`
   you set, then go to **Settings** and change the password to something only
   the owner knows — the `.env` value is only used to create the account once.

The `/admin` sign-in isn't linked from anywhere in the public site by design —
the owner navigates to it directly.

## Content model

Everything the owner can edit lives in Postgres, not in code:

- **Photographs** (`/admin/photos`) — image, title and description in both languages, reorderable.
- **Home & statement** (`/admin/content`) — site name, hero photo/subtitle/credit, the project statement, footer credit.
- **About / bios** (`/admin/bios`) — any number of people, each with a photo, role, and bio in both languages.
- **Settings** (`/admin/settings`) — change the owner's username/password.

## Project structure

```
app/                  Routes (public pages + /admin CMS), all Server Components
                       by default; forms are Client Components using Server Actions.
components/           Shared UI, split into public-site views and components/admin/.
lib/                  Prisma client, session/auth, image storage abstraction, content queries.
prisma/               Schema, migrations, and the seed script (also the source of
                       the original 10 photographs' titles/descriptions).
assets/               Source JPEGs used only by prisma/seed.ts.
```

## Known original-content note

The original design mockup's image files were mislabeled relative to their
actual content (e.g. the file named `photo-01-tornado.jpg` actually contains
the "Fiestas Patrias" photo, and vice versa, across five swapped pairs). The
seed script (`prisma/seed.ts`) maps each file to its *correct* title/description
based on what's actually in the photo, not the filename — verified by eye
against every image. If you re-add these specific files elsewhere, don't trust
their names.
# photography-artist-gallery
