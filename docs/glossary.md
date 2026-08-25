# Glossary

## App Router

The current Next.js routing system used by this starter. Folders and files inside `src/app` define pages and layouts.

## Authentication

The process that proves who a user is. Signing in is authentication.

## Authorization

The rules that decide what a signed-in user can access or change.

## Client Component

A React component that runs in the browser. Use one when an interaction needs browser state or browser APIs.

## Convex

The service that hosts this starter's database, server functions, and authentication. Your app talks to it through the functions in the `convex` folder.

## Deploy Key

A powerful Convex secret that lets a build system deploy to production. Never place it in browser code or commit it to Git.

## Deployment

Your app's own space on Convex. Every project gets a development deployment for building and a production deployment for real users.

## Environment Variable

A configuration value supplied outside the code. URLs and keys belong in environment variables so each environment can use different values.

## Mutation

A Convex function that changes data. Every mutation in this starter checks who is signed in before it writes.

## Ownership Check

The code inside a Convex function that refuses to read or change a record unless it belongs to the signed-in user. It is this starter's final authorization boundary.

## Query

A Convex function that reads data. Queries in this starter return only the signed-in user's own records.

## Schema

The file `convex/schema.ts`. It defines every table and field in your database and is the source of truth for its shape.

## Server Action

A Next.js function that runs on the server and can handle a form submission or another mutation.

## Server Component

A React component that renders on the server. It can read server data without sending database code to the browser.
