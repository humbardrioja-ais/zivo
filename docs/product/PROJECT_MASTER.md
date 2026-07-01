# Zivo OS — Project Master

Enterprise Modular Digital Workspace. Multi-tenant, organization-scoped SaaS.

---

## Status

**Foundation v1.0 — FROZEN** (2026-06-28)

No further architecture redesigns unless a critical security, data integrity, or scalability issue is discovered.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth & DB | Supabase (Postgres + Auth + RLS) |
| State/Data | Zustand, TanStack Query |
| Forms | React Hook Form, Zod |

---

## Architecture (Frozen)

### Identity Chain
```
auth.users → user_profiles → organization_members
```
No duplicate user tables. `organization_members` represents a person's employment/assignment within an organization.

### Organization Structure
```
organizations → branches → departments → job_titles
```
Departments belong to a branch (optional). Job titles optionally belong to a department.

### RBAC (Normalized)
```
roles ← role_permissions → permissions
```
No permissions stored as arrays. Permissions have key (unique), module, category, label, description.

### Row Level Security
All tables org-scoped. RLS enforced via SECURITY DEFINER helper functions:
- `is_org_member(org_id)`
- `is_org_admin(org_id)`
- `set_updated_at()` (trigger function)

No RLS recursion.

---

## Foundation v1.0 Tables

| Table | Purpose |
|---|---|
| organizations | Tenant root, profile, branding, localization |
| user_profiles | Personal info (display_name, avatar, timezone) |
| organization_members | Person↔org assignment: branch, department, job_title, role, employment_type, employment_status, employee_number, hired_at |
| branches | Office locations |
| departments | Org structure (branch_id, parent_id self-ref) |
| job_titles | Position catalog (department_id) |
| employment_types | Full Time, Part Time, Contract, Intern, Consultant |
| roles | RBAC roles |
| permissions | Permission catalog (18 seeded, System module only) |
| role_permissions | Role↔permission junction |

### Key Constraints
- `UNIQUE (organization_id, employee_number)` on organization_members
- `CHECK employment_status IN ('active','inactive','on_leave','terminated')`, default 'active'
- `UNIQUE (role_id, permission_id)` on role_permissions
- `UNIQUE (key)` on permissions

---

## System Module (Complete)

All CRUD implemented with shared components (DataToolbar, ConfirmDialog, StatusBadge, EmptyState, PageHeader, PageLayout, FormSection):

Organization · Branches · Departments · Job Titles · Employment Types · Users · Roles · Permissions

---

## Future Improvements (v2+)

Reserved but NOT implemented in v1.0:
- Audit columns (created_by, updated_by, deleted_by)
- Soft delete (deleted_at)
- Full audit log module + `system.audit` permission
- Role hierarchy (level, parent_role_id) — approval engine
- Permission inheritance
- Large permission catalogs (per-module registration)
- Enterprise reporting tables

**Workflow Vision:** A single Workflow & Task Engine will eventually power Projects, HR, CRM, Finance, Procurement, Assets, AI. The frozen foundation supports this without redesign — all future modules reference `organization_members` for identity and `organization_id` for scoping.

---

## Roadmap

1. ~~Foundation v1.0~~ — **FROZEN**
2. **Zivo OS Design System** (next) — premium enterprise design language: no emojis, consistent icon library, minimal modern UI inspired by Linear/Notion/Stripe/GitHub/Vercel. Reusable design components.
3. Dashboard
4. Projects
5. Tasks
6. Calendar · Files · Meetings · Notifications

HR, CRM, Finance come after the Internal Productivity Suite.
