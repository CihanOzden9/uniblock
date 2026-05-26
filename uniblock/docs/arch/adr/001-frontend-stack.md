# ADR 001: Frontend Tech Stack Seçimi

## Context
UniBlock çok rollü, veri yoğun platform. Gereksinimler: SSR/SEO, RBAC, real-time-ish, dashboard/charts, ölçeklenebilir mimari.

## Decision
- Framework: Next.js 14+ (App Router) + React 18 + TypeScript
- UI: Tailwind CSS + shadcn/ui (Radix)
- State: TanStack Query (server), Zustand (client)
- Forms: React Hook Form + Zod
- Icons: Lucide React
- Charts: Recharts
- Auth: NextAuth.js / custom JWT
- Quality: ESLint + Prettier + Husky + Vitest + Playwright
- Deploy: Vercel

## Status
Accepted

## Consequences
+ Hızlı geliştirme, tip güvenliği, performans, modern ekosistem.
- Öğrenme eğrisi (Next.js App Router).

Detaylar: docs/project/tech_stack_ve_frontend_onerisi.md
