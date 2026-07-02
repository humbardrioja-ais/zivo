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
2. ~~Zivo OS Design System~~ — **COMPLETE**
3. ~~Home Dashboard + Workflow Foundation~~ — **COMPLETE**
4. ~~Projects — Preparation~~ — **COMPLETE** (audit + gap analysis: `docs/product/PROJECTS_PREP.md`)
5. ~~Projects — Implementation (MVP, Project Model v1.0)~~ — **COMPLETE**
5a. ~~Shared Form Components v1.0~~ — **COMPLETE** (MemberPicker, DatePicker, Combobox, RichTextEditor — see `docs/product/SHARED_COMPONENTS.md`)
6. **Tasks** (next)
7. Calendar · Files · Meetings · Notifications

HR, CRM, Finance come after the Internal Productivity Suite.

---

## Projects Module (MVP — Project Model v1.0)

New module tables (migration `0008_projects.sql`) referencing frozen Foundation
via FK — Foundation v1.0 untouched. Org-scoped RLS via `is_org_member` /
`is_org_admin`.

| Table | Purpose |
|---|---|
| projects | name, code, description, status (planning/active/on_hold/completed/archived), lead, start/due dates |
| project_members | project ↔ organization_member, role (lead/member/viewer) |
| project_areas | grouping within a project (formerly "Workstreams"): name, description, status, position |

**UI** (`app/app/workspaces/projects/`) — list (search, status, row → detail),
create/edit dialog, and a tabbed detail: Overview, Members (add/remove),
Areas (CRUD), Files (placeholder), Activity (placeholder). All built from
shared Design System components.

**Shared infra added:** `getOrgMembers()` reader (`lib/workflow/members.ts`)
for member pickers across future modules.

Out of scope (not built): dependencies, Gantt, AI, automation, time tracking,
budget, custom fields, approval engine.

---

## Home Dashboard + Workflow Foundation (Complete)

**Home** (`app/app/page.tsx`) — the productivity-first landing page. Answers
"what should I work on today?" with honest empty states (no fake analytics):
Welcome + AI Summary placeholder, Quick Create, Continue Working, My Tasks,
Today's Meetings, Upcoming Deadlines, Pinned Projects, Recent Activity.
Section components live in `app/app/_dashboard/`.

**Workflow Foundation** (`lib/workflow/`) — reusable architecture the future
Workflow & Task Engine and every module (Projects, Tasks, Meetings, Calendar,
CRM, HR, Finance) will share. No database schema; UI/service contracts only.
- `types.ts` — WorkItem, MeetingSummary, DeadlineItem, ProjectSummary,
  ActivityEvent, DashboardData; priority/status/module unions.
- `context.ts` — `getWorkflowContext()` resolves the authed member + org.
- `dashboard-service.ts` — provider-based aggregator. Each section is a
  `DashboardSources` method; defaults return empty until a module ships, so
  the dashboard gains real data with no UI change and degrades gracefully.
- `format.ts` — greeting, dates, relative time, due-date labels.

---

## Design System (Complete)

Premium, minimal, enterprise UI inspired by Linear/Notion/Stripe/GitHub/Vercel. No emojis. Lucide icons only. Neutral OKLCH palette, light + dark. Motion 150–250ms.

**Design tokens** (`globals.css`): colors, typography, spacing, radius, motion (`--motion-*`, `--ease-out`), elevation (`--elevation-*`), focus rings, dark mode.

**Layout primitives:** AppLayout (shell + auth guard + sidebar-state persistence), Sidebar (collapsible, grouped, cookie-persisted), TopBar (breadcrumbs, search, Quick Create, notifications, theme toggle), PageLayout, PageHeader, ContentContainer, Section.

**Shared components** (`components/shared`, barrel `index.ts`): DataToolbar, TableSkeleton, StatCard, StatusBadge, PriorityBadge, EmptyState, ErrorState, Spinner, LoadingOverlay, ConfirmDialog, FormSection.

**UI primitives** (`components/ui`, shadcn/base-ui): button, input, textarea, select, checkbox, dialog, sheet, dropdown-menu, table, card, badge, avatar, tooltip, breadcrumb, separator, skeleton, sidebar, collapsible, label.

**Error routes:** `app/not-found.tsx`, `app/error.tsx`, `app/app/not-found.tsx`.

All System pages (Organization, Branches, Departments, Job Titles, Employment Types, Users, Roles, Permissions, Settings) share the same layout and components.
