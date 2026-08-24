# Architecture

This file records the decisions that should stay stable while the product changes.

## Application

The app uses Next.js App Router. Server Components read data through Convex queries. Server Actions handle authenticated writes through Convex mutations. Client Components stay small and only handle interactions that need browser state.

## Data and Authentication

Convex provides the database, server functions, and authentication. Convex Auth with the Password provider handles accounts, and the middleware in `src/proxy.ts` keeps the session available to server code.

Every Convex query and mutation enforces ownership itself: it reads the signed-in user from `ctx.auth` and refuses to touch records that belong to someone else. Interface checks improve the experience, but the checks inside the Convex functions remain the final authorization boundary.

The schema in `convex/schema.ts` defines the database. The Convex dashboard is useful for inspection, but it is not the schema source of truth.

## User Interface

Tailwind CSS handles styling. shadcn/ui provides accessible primitives that live in this repository and can change when the product needs them.

The interface stays quiet and work-focused. It favors clear hierarchy, useful empty states, and predictable actions over decorative sections.

## Deployment

Vercel hosts the Next.js application. Convex hosts the production database, functions, and authentication. Environment variables connect the two services.

## Decisions That Need a Written Reason

Record the reason, alternatives, and date below before adding another database, auth provider, ORM, global state library, API abstraction, or hosting platform.

### Decision Log

No product-specific exceptions have been approved.
