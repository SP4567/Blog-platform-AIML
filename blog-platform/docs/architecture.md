# Architecture

Northstar Journal uses a clean, feature-based architecture with route-level UI, shared content models, and a schema-driven data layer.

## Layers
- UI: Next.js App Router and Tailwind-based components
- Domain: typed content models and reusable helpers
- Data: Prisma models for users, posts, categories, tags, comments, and sessions
- Ops: Docker Compose, Redis, environment variables, GitHub Actions, and deployment guides
