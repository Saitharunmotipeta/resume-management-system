# HireWise Frontend (React + Vite + Tailwind)

A modular, role-based frontend for the HireWise FastAPI backend.

## Quick Start

```bash
npm install
npm run dev
```

Create a `.env` from `.env.example` and set `VITE_API_BASE_URL` to your FastAPI base URL (e.g., `http://localhost:8000`).

## Roles & Routes

- Student: `/student`, upload at `/resume/upload`, track at `/resumes/mine`
- HR: `/hr`, create at `/hr/jobs/new`, applicants `/hr/jobs/:id/applicants`, shortlist `/hr/shortlist`
- Manager: `/manager`, shortlisted `/manager/shortlisted`
- Admin: `/admin`, metrics `/admin/metrics`, manage `/admin/manage`

## Backend endpoints used

- `POST /auth/login` (form-encoded), `POST /auth/register`
- `GET /jobs`, `GET /jobs/:id`, `POST /jobs` (HR/admin), `DELETE /jobs/:id` (admin)
- `POST /jobs/:id/apply` (student)
- `POST /resumes/upload` (multipart: file, job_id)
- `GET /resumes/my` (student)
- `GET /resumes/by_job/:job_id?shortlisted_only=true|false` (HR/manager/admin; manager sees only shortlisted)
- `POST /resumes/:resume_id/shortlist` body `{ value: true|false }`
- `GET /admin/metrics` (admin)

> If your backend uses different paths/params, update the calls inside `src/pages/**` and `src/api/axios.js`. The base prefixes `/auth`, `/jobs`, `/resumes` are auto-detected from your backend structure.

## Auth

- JWT is saved in `localStorage` and attached on every request via Axios interceptor.
- Role is read from JWT claim `role`.

## Styling

- Tailwind utility classes using simple components (`btn`, `card`, `input`, `label`, `link`).

## Maintainability

- Modular pages per role; API logic is thin and colocated.
- Update endpoints centrally in each page or build a dedicated API layer if desired.
