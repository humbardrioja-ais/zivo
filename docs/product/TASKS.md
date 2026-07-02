# Task Engine — MVP (Task Model v1.0)

The core work-tracking module. New table only; Foundation v1.0 and Projects are
untouched. Reuses the Shared Form Components and the workflow foundation.

---

## Data Model

`tasks` (migration `0009_tasks.sql`), org-scoped, RLS via `is_org_member`:

| Column | Notes |
|---|---|
| organization_id | tenant scope |
| project_id | nullable → task can be standalone or in a project (CASCADE) |
| area_id | nullable → project area (SET NULL) |
| title | required |
| description | HTML from RichTextEditor |
| status | todo, in_progress, blocked, in_review, done, cancelled |
| priority | urgent, high, medium, low |
| assignee_id | organization_members (SET NULL) |
| due_date | date |
| position | for future ordering |

Statuses and priorities match the `WorkItem` contract in `lib/workflow/types.ts`,
so tasks flow into the Home dashboard and any future aggregate view unchanged.

---

## UI

`app/app/workspaces/tasks/`

- **TasksView** — the reusable task surface with two views (toggle):
  - **List** — table: title, priority, assignee, project, due, status; row → edit.
  - **Board** — kanban by status with per-card "Move to next status →".
  - Toolbar: search, status filter, view toggle, New Task.
- **TaskDialog** — create/edit. Reuses MemberPicker (assignee), DatePicker (due),
  RichTextEditor (description), Combobox (project). Works globally (pick a
  project) or inside a project (project fixed, pick an area).

Surfaces:
- **Global**: `/app/workspaces/tasks` — all org tasks.
- **Per project**: the project detail **Tasks** tab reuses `TasksView` with
  `fixedProjectId` and the project's active areas.

Shared badge added: `WorkStatusBadge` (`components/shared`) for workflow statuses.

---

## Dashboard integration

`lib/workflow/tasks.ts` → `getMyOpenTasks(ctx)` maps the current member's open
tasks to `WorkItem[]`. Wired into `dashboard-service.ts` default sources:

- **My Tasks** — all open assigned tasks
- **Continue Working** — in-progress assigned tasks
- **Upcoming Deadlines** — assigned tasks with due dates, soonest first

These Home cards are now live (were empty placeholders). All degrade to empty
safely if the tasks table is absent.

---

## Out of scope (not built)

Subtasks, dependencies, recurring tasks, time tracking, comments, drag-and-drop
reordering, custom fields, automations. The `position` column and WorkItem
contract leave room for these without schema redesign.
