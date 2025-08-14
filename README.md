# Government Officer Admin Backend (Express + TypeScript)

Backend API for the Government Officer admin portal: applications workflow, audit reports, appointment conflict check against admin schedule, integrity flags, reports, notifications. Ships with Swagger UI, Prisma ORM, and seed data.

---

## Stack

* **Node/Express + TypeScript**
* **Prisma** ORM (**SQLite** dev; swap to Postgres easily)
* **JWT** auth (ADMIN/AUDITOR)
* **Zod** validation, **Helmet/CORS/Morgan**
* **Swagger UI** (`/docs`)
* Seed & sample data

---

## Project Structure

```
.
├─ src/
│  ├─ app.ts                 # Express app, middlewares, Swagger mount
│  ├─ server.ts              # Boot file
│  ├─ prisma.ts              # Prisma client
│  ├─ config/env.ts          # env loader
│  ├─ utils/{overlap,license}.ts
│  ├─ middlewares/{auth,error,validate}.ts
│  ├─ routes/
│  │   ├─ auth.routes.ts
│  │   ├─ application.routes.ts
│  │   ├─ schedule.routes.ts
│  │   ├─ report.routes.ts
│  │   ├─ flag.routes.ts
│  │   └─ notification.routes.ts
│  └─ docs/openapi.ts        # OpenAPI spec
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ tests.http                # VSCode REST Client script
├─ package.json
├─ tsconfig.json
└─ .env.example
```

---

## Environment

Copy `.env.example` → `.env` and adjust:

```
DATABASE_URL="file:./dev.db"   # use PostgreSQL: postgres://user:pass@host:5432/db
PORT=4000
JWT_SECRET="change_me"
DEFAULT_APPOINTMENT_MINUTES=60
CORS_ORIGIN=http://localhost:5173
```

---

## Setup

```bash
# Install
npm i

# Prisma client + migrate + seed
npm run prisma:generate
npm run prisma:migrate
npm run seed

# Dev
npm run dev
# → http://localhost:4000/health
# → http://localhost:4000/docs (Swagger)
```

**Seeded users**

* ADMIN → `username: rohan` / `password: admin123`
* AUDITOR → `username: sanjeewa` / `password: auditor123` (also `nilanka`)

---

## Quick Test (REST Client)

Open `tests.http` in VS Code (REST Client extension) and run from top.
Or curl login:

```bash
curl -s http://localhost:4000/auth/login \
 -H 'Content-Type: application/json' \
 -d '{"username":"rohan","password":"admin123"}'
```

Use the `accessToken` as `Authorization: Bearer <token>`.

---

## Core API (high level)

* **Auth**: `POST /auth/login`, `POST /auth/register`
* **Applications**:

  * `GET /applications` (filters, pagination)
  * `GET /applications/:id` (returns `requestedSlotOverlap`)
  * `POST /applications/:id/appointment/accept` `{ scheduledFor, force? }`
  * `POST /applications/:id/approve` `{ appointment? }` → mints license
  * `POST /applications/:id/reject` `{ reason }`
  * `POST /applications/:id/audit-report` (auditor/admin)
* **Admin Schedule**:

  * `GET /admin-schedule/my` (current admin)
  * `POST /admin-schedule` `{ start,end,title }`
  * `DELETE /admin-schedule/:id`
* **Reports**:

  * `GET /reports/summary`
  * `GET /reports/approvals-vs-rejections`
  * `GET /reports/auditor-performance`
  * `GET /reports/status-breakdown`
* **Integrity Flags**:

  * `GET /integrity-flags` (filter by level)
  * `POST /integrity-flags/:id/resolve`
* **Notifications**:

  * `GET /notifications?unreadOnly=1`
  * `POST /notifications/:id/read`

Full schema & examples at **`/docs`**.

---

## Flow Diagram (review & approval)
![flow diagram](government_officer/server/docs/flow-diagram.png)

**Overlap rule**:
`requestedStart < busyEnd AND busyStart < requestedEnd`
`requestedEnd = requestedStart + DEFAULT_APPOINTMENT_MINUTES`

---

## ER Diagram (Prisma Models)

![er-diagram](government_officer/server/docs/er-diagram.png)

---

## User Guide (Admin & Auditor)

**Admin**

1. **Login** (`/auth/login`).
2. **Dashboard** (`/reports/summary`) → see counts & cards.
3. **Ready for Review** → open an application (`/applications/:id`):

   * Check **documents** and **auditor report** (if any).
   * See **Overlap banner** from `requestedSlotOverlap`.
4. **Accept appointment**:

   * `POST /applications/:id/appointment/accept` with `scheduledFor`.
   * If conflict, either change time or pass `force: true`.
5. **Approve**:

   * `POST /applications/:id/approve` (optionally with appointment block); license is minted.
6. **Reject**:

   * `POST /applications/:id/reject` with reason.
7. **Manage schedule**: create busy blocks to reflect meetings/audits.
8. **Flags**: review/resolve integrity flags.
9. **Reports**: approvals vs rejections, status breakdown, auditor performance.
10. **Notifications**: list & mark read.

**Auditor**

1. **Login**.
2. **Submit/Update Audit Report**: `POST /applications/:id/audit-report` with checklist & result.
3. Status auto-advances **PENDING → AUDIT\_PASSED** on `PASSED`.

---

## Switch to PostgreSQL

1. Set `DATABASE_URL` to Postgres URI.
2. Update `prisma/schema.prisma` datasource if needed (provider `postgresql`).
3. Run:

   ```bash
   npm run prisma:generate
   npx prisma migrate dev
   npm run seed
   ```

---

## Scripts

* `npm run dev` – start with TSX watch
* `npm run prisma:migrate` – apply migrations (dev)
* `npm run seed` – seed demo data
* `npm run db:reset` – reset DB (danger)
* `npm run build && npm start` – prod build/run

---

## Security Notes (essentials)

* Keep `JWT_SECRET` strong/secret.
* Set `CORS_ORIGIN` to your FE origin.
* Enforce HTTPS and secure headers at the proxy/load balancer in prod.

---
