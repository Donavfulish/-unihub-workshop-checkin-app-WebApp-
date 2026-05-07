# UniHub Workshop WebApp

Next.js (App Router) client UI for UniHub Workshop.

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BASE_URL` | Backend API origin (e.g. `http://localhost:3000`). Defaults to `http://localhost:3000` if unset. |

## Auth flow

1. **Đăng ký** (`/register`) → **Đăng nhập** (`/login`).
2. After login, `accessToken` + `user` are stored in **`localStorage`** (`unihub_auth_session_v1`).
3. Authenticated API calls send `Authorization: Bearer <token>` via `serviceRequest`.
4. **GET** `/auth/me` is available from `AuthService.me` for session refresh (optional).

## RBAC (UI)

- `/admin`, `/admin/workshops` — **admin** only (`RouteGuard`).
- `/dashboard` — **student** or **staff** (`RouteGuard`).
- Home `/` — public shell; workshop list loads after login.
- Workshop detail `/workshops/[id]` — requires login; **register/pay** buttons enabled only for **student** (matches API).

## Commands

```bash
npm install
npm run dev
npm run build
```

## Manual smoke checklist

1. Start BE with valid `ACCESS_TOKEN_SECRET` and DB.
2. `npm run prisma:seed` (optional dev accounts).
3. Start WebApp with `NEXT_PUBLIC_BASE_URL` pointing at BE.
4. Register → login → home lists workshops.
5. Student: open workshop, register, pay; admin: cannot register (UI + API 403).
6. Admin: visit `/admin`; student redirected away from `/admin`.
