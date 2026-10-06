# ADR-0003: One database pool per process, closed on shutdown

**Date**: 2026-10-05
**Status**: accepted

## Context

Every context that persists needs connections to Postgres. A process that opens more than one pool, or
never closes it, keeps connections open after the application is told to stop.

## Decision

The process has one connection pool. A shared `DatabaseModule` creates it, provides the Drizzle
database to the contexts, and ends the pool in `onApplicationShutdown`; `main.ts` calls
`enableShutdownHooks()` so a SIGTERM runs it. A later context that persists imports the module and
opens no pool of its own.

## Alternatives Considered

### Alternative 1: One pool per feature
- **Pros**: each feature owns its connections.
- **Cons**: the number of open connections grows with the number of features, and each pool needs its own closing.
- **Why not**: the process has one pool to size and to close.

### Alternative 2: A module-level singleton pool
- **Pros**: no module to import.
- **Cons**: it lives outside the framework's lifecycle, so nothing closes it on shutdown.
- **Why not**: the pool is closed by the application's own shutdown hook.

## Consequences

### Positive
- A SIGTERM closes every connection and the process exits.
- Contexts take the database as a dependency.

### Negative
- Every persisting context depends on `DatabaseModule`.

### Risks
- None recorded.
