# Architecture

This file records the decisions that should stay stable while the product changes.

## Application

The app uses Next.js App Router. Server Components read data. Server Actions handle authenticated writes. Client Components stay small and only handle interactions that need browser state.

## Data and Authentication

Supabase provides Postgres and authentication. The app uses cookie-based server sessions through `@supabase/ssr`.

Postgres Row Level Security protects user-owned records. Application checks improve the experience, but RLS remains the final authorization boundary.

SQL migrations in `supabase/migrations` define the database. The Supabase dashboard is useful for inspection, but it is not the schema source of truth.

## User Interface

Tailwind CSS handles styling. shadcn/ui provides accessible primitives that live in this repository and can change when the product needs them.

The interface stays quiet and work-focused. It favors clear hierarchy, useful empty states, and predictable actions over decorative sections.

## Deployment

Vercel hosts the Next.js application. Supabase hosts the production database and authentication service. Environment variables connect the two services.

## Decisions That Need a Written Reason

Record the reason, alternatives, and date below before adding another database, auth provider, ORM, global state library, API abstraction, or hosting platform.

### Decision Log

No product-specific exceptions have been approved.

