# MarketMind

Turn Marketing Data into Smarter Decisions.

MarketMind is a fullstack Next.js application for creating marketing campaigns, analyzing them with AI strategy guidance, and managing execution from a dedicated owner workspace.

---

## Tech Stack

- **Frontend + Backend Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Runtime:** Node.js

---

## Current Features

### 1) Landing Page
- Professional dark + warm product design
- Hero section with animation
- Feature blocks, use-cases, and CTA
- Smooth section transitions and counters

### 2) Campaign Builder (`/campaigns/new`)
- Campaign form with fields:
  - Campaign name
  - Product/service
  - Target audience
  - Budget
  - Platform
  - Start/end date
  - Goal
- Validations and loading states
- Saves data to PostgreSQL
- Triggers AI recommendation response

### 3) Team Campaign View (`/campaigns`)
- Read-only table view of all created campaigns
- Database error-safe UI with setup help if DB/tables are missing

### 4) Owner Dashboard (`/owner`)
- Separate owner workspace
- Campaign stats cards
- Search + status filtering
- One-click status updates:
  - Mark completed
  - Reopen completed campaigns

### 5) APIs
- `GET /api/health`
- `GET /api/campaigns`
- `POST /api/campaigns`
- `PATCH /api/campaigns/[id]`
- `POST /api/ai/recommendations`

---

## Project Structure

```text
src/
  app/
    api/
      ai/recommendations/route.ts
      campaigns/route.ts
      campaigns/[id]/route.ts
      health/route.ts
    campaigns/
      page.tsx
      new/page.tsx
    owner/
      layout.tsx
      page.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
    landing/marketmind-landing.tsx
    owner/owner-dashboard.tsx
  db/
    index.ts
    schema.ts
```

---

## Environment Variables

Create `.env.local` in the project root.

Required:

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
MARKETMIND_AI_API_KEY=your_api_key_here
```

Optional:

```env
MARKETMIND_AI_API_URL=https://api.openai.com/v1/responses
MARKETMIND_AI_MODEL=gpt-4.1-mini
```

> Never commit `.env.local`.

---

## Local Setup (PowerShell)

```powershell
cd "C:\Users\acer\OneDrive\Desktop\MarketMind\marketmindwebsite"
npm install
npx drizzle-kit push
npm run dev
```

Open: `http://localhost:3000`

---

## Local Setup (CMD)

```cmd
cd /d C:\Users\acer\OneDrive\Desktop\MarketMind\marketmindwebsite
npm install
npx drizzle-kit push
npm run dev
```

Open: `http://localhost:3000`

---

## Useful Routes

- Landing: `http://localhost:3000/`
- Create Campaign: `http://localhost:3000/campaigns/new`
- Team View: `http://localhost:3000/campaigns`
- Owner Dashboard: `http://localhost:3000/owner`

---

## Build & Type Check

```bash
npx next typegen
npm exec tsc -- --noEmit --pretty false
npm run build
```

---

## Database Notes

If `/campaigns` shows query errors, ensure:
1. PostgreSQL is running
2. `DATABASE_URL` is correct
3. Run:

```bash
npx drizzle-kit push
```

To quickly inspect campaigns:

```bash
psql postgresql://postgres:postgres@127.0.0.1:5432/app_db -c "select id, name, status, created_at from campaigns order by id desc;"
```

---

## Deployment Notes

- Add all env vars in your hosting provider (Render/Vercel)
- Keep secrets server-side only
- Do not expose private keys via `NEXT_PUBLIC_*`

---

## Milestone Status

- ✅ Milestone 1: Landing + Design System
- ✅ Campaign creation + persistence
- ✅ AI recommendation integration route
- ✅ Separate owner management view with completion workflow
