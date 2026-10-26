# Student Portal Backend (scaffold)

Stack: Node.js + Express + TypeScript + Prisma + PostgreSQL

Quick start (local):

1. Copy env: cp .env.example .env and update values
2. Install deps: npm ci
3. Initialize Prisma client and run migrations:
   - npx prisma generate
   - npx prisma migrate dev --name init
4. Run in dev: npm run dev

With Docker Compose:

1. docker-compose up --build

APIs:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

This scaffold includes JWT access + refresh token flow, RBAC-ready User model, basic course/enrollment models in Prisma schema, and an example auth controller.
