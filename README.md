# Outworld Studio — Next.js 16

**AI-powered audio processing platform** for stem separation, vocal removal, and remix generation.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Animation:** Framer Motion
- **Database:** Supabase (PostgreSQL + Storage)
- **Payments:** Stripe
- **Queue:** BullMQ + Redis
- **AI:** Suno API
- **Deployment:** Vercel

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/savehxpe/outworldstudio.git
cd outworldstudio
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in all required values:

```bash
cp .env.example .env.local
```

### 3. Database Setup

Run the SQL schema against your Supabase project:

```bash
# Copy src/lib/supabase-schema.sql and execute in Supabase SQL editor
```

### 4. Run Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/dashboard` | User dashboard |
| `/studio` | Audio upload & processing |
| `/projects` | Saved project library |
| `/projects/[id]` | Project detail & stems |
| `/remix-lab` | Stem remix workspace |
| `/pricing` | Credit packages |
| `/settings` | User settings |
| `/admin` | System administration |

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/suno/generate` | POST | Submit audio for stem separation |
| `/api/webhooks/stems` | POST | Suno processing callback |
| `/api/stripe/checkout` | POST | Create checkout session |
| `/api/stripe/webhook` | POST | Stripe payment events |
| `/api/upload` | POST | Direct file upload |

## Architecture

```
src/
├── app/           # Next.js App Router pages & API
├── components/    # Reusable React components
│   ├── ui/        # shadcn/ui primitives
│   ├── layout/    # Navbar, Sidebar
│   ├── landing/   # Landing page sections
│   ├── studio/    # Audio engine components
│   ├── dashboard/ # Dashboard widgets
│   └── remix/     # Remix lab components
├── hooks/         # Custom React hooks
├── lib/           # Utilities, API clients
├── store/         # Zustand state management
└── types/         # TypeScript type definitions
```

## Credit System

- **Vocal Removal:** 10 credits
- **Stem Split:** 25 credits
- **Packages:** 100 ($12), 500 ($49), 2000 ($149)

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel --prod
```

Set all environment variables in Vercel dashboard.
