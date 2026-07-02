# Projects Module — Preparation

Preparation-only milestone. No database changes, no migrations, no UI screens.
Goal: make Projects fast to implement once the product model is approved.

---

## 1. Reusable Component Audit

What already exists and is ready for Projects to consume.

| Need | Component | Location | Status |
|---|---|---|---|
| Page layout | `PageLayout`, `PageHeader`, `ContentContainer`, `Section` | components/shared | Ready |
| Tables | `Table` + parts | components/ui/table | Ready |
| Table loading | `TableSkeleton` | components/shared | Ready |
| Forms — text | `Input`, `Textarea`, `Label` | components/ui | Ready |
| Forms — choice | `Select` | components/ui | Ready |
| Forms — boolean | `Checkbox`, `Switch` | components/ui | **Added this milestone** |
| Form grouping | `FormSection` | components/shared | Ready |
| Dialogs (modal) | `Dialog` | components/ui | Ready |
| Drawer / side panel | `Sheet` | components/ui | Ready |
| Confirm / delete | `ConfirmDialog` | components/shared | Ready |
| Search | `DataToolbar` | components/shared | Ready (search only) |
| Status badges | `StatusBadge` | components/shared | Ready |
| Priority badges | `PriorityBadge` | components/shared | Ready |
| Empty states | `EmptyState` | components/shared | Ready |
| Error states | `ErrorState` | components/shared | Ready |
| Loading | `Spinner`, `LoadingOverlay` | components/shared | Ready |
| Stat cards | `StatCard` | components/shared | Ready |
| Dropdown/actions | `DropdownMenu` | components/ui | Ready |
| Avatars | `Avatar` | components/ui | Ready |
| Tooltips | `Tooltip` | components/ui | Ready |

All shared primitives are exported from `components/shared/index.ts`.

---

## 2. Reusable Infrastructure Audit

| Concern | Asset | Location | Status |
|---|---|---|---|
| Auth/session | Supabase server/browser clients, proxy | lib/supabase | Ready |
| Org scoping | `getOrgId()` | lib/supabase/get-org-id | Ready |
| Workflow contracts | `WorkItem`, `ProjectSummary`, statuses, priorities | lib/workflow/types | Ready |
| Actor/context | `getWorkflowContext()` | lib/workflow/context | Ready |
| Dashboard wiring | `DashboardSources` provider pattern | lib/workflow/dashboard-service | Ready |
| Formatting | `dueLabel`, `relativeTime`, dates | lib/workflow/format | Ready |
| CRUD pattern | Server actions returning `{ error }`, `revalidatePath` | system/* actions | Established convention |

**Established CRUD convention** (Projects should follow verbatim):
`'use server'` file → `getOrgId()` → typed row type → `get/create/update/delete`
returning `{ error: string }` → `revalidatePath()`. Table component holds local
state + `refresh()`; dialog resets via `key` prop; delete via `ConfirmDialog`.

---

## 3. Dependency Map

```
Projects (UI screens)
├── Layout      → PageLayout, PageHeader, Section, ContentContainer
├── List        → Table, TableSkeleton, DataToolbar, EmptyState, StatusBadge
├── Row actions → DropdownMenu, ConfirmDialog
├── Create/Edit → Dialog | Sheet, Input, Textarea, Select, Checkbox,
│                 Switch, FormSection, [MemberPicker*], [DatePicker*]
├── Detail      → Card, StatCard, Avatar, Badge, [RichText*]
├── Data layer  → server actions (convention) → Supabase server client
│                 → getOrgId() → RLS (is_org_member / is_org_admin)
└── Cross-module→ lib/workflow (WorkItem, ProjectSummary) → Home dashboard
                  source (wire projects into getDashboardData)

* = not yet built — see Gap Analysis
```

Projects also unblocks the Home dashboard: implementing a `pinnedProjects` /
`continueWorking` source in `dashboard-service.ts` makes those cards live.

---

## 4. Gap Analysis — build as SHARED, not inside Projects

| Gap | Why shared | Recommendation | Blocker |
|---|---|---|---|
| **Member Picker** | Tasks, CRM, HR, Finance all assign to `organization_members` | Presentational `MemberPicker` (list + value + onChange) + a `getOrgMembers()` reader | None — build when Projects starts |
| **Date Picker** | Every module has due/start dates | Add `react-day-picker` + `Popover`, wrap as `DateField`; or ship `DateField` over native `<input type=date>` first | Dependency choice (calendar lib) |
| **Combobox** | Searchable single/multi select (assignee, labels) | Add `cmdk` + `Popover` → `Combobox` | Dependency choice |
| **Filter controls** | List filtering beyond search | Extend `DataToolbar` with a `FilterBar` (faceted dropdowns) | None — build when needed |
| **Rich Text Editor** | Project/task descriptions, comments | Add `Tiptap`; wrap as `RichTextField` | Dependency + product decision (features) |
| **File Upload** | Attachments | Needs Supabase Storage bucket + policies (DB/infra) | **Product + storage decision — defer** |
| **Bulk selection** | Table multi-select actions | Add row-selection state to a shared `DataTable` wrapper | None — build when needed |

Built now (decision-free, already hand-rolled with raw inputs elsewhere):
`Checkbox`, `Switch`.

Deliberately deferred (require a library or product/storage decision, so they
must not be rushed into Projects): Date Picker, Combobox, Rich Text, File Upload.

---

## 5. Recommended Build Order (once product model approved)

1. `getOrgMembers()` reader + `MemberPicker` (shared)
2. `DateField` (shared, native first)
3. Projects table (list, search, empty, status)
4. Project create/edit dialog
5. Project detail
6. Wire `pinnedProjects` source into the Home dashboard
7. Then Tasks (reuses everything above)
