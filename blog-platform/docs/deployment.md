# Deployment Guide

Use the included Dockerfile, docker-compose.yml, and nginx.conf for containerized deployment.

## Local Development
- `cp .env.example .env.local`
- `npm install`
- `npx prisma migrate dev --name init`
- `npm run dev`

## Production
Deploy the app to Vercel, Railway, DigitalOcean, or AWS with PostgreSQL and Redis configured in environment variables.