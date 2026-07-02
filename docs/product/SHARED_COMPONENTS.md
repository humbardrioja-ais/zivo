# Shared Form Components v1.0

Reusable form components standard across all Zivo modules (Projects, Tasks,
Meetings, Calendar, CRM, HR, Finance, Procurement, AI). Built on the existing
Design System — neutral palette, no emojis, keyboard accessible, dark mode.

Libraries: `@base-ui/react` (popover/combobox), `react-day-picker` (calendar),
`@tiptap/*` (editor).

---

## MemberPicker

`@/components/shared/member-picker` — searchable person selector showing avatar
initials, name, job title, and department. Controlled by member id.

**Props**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `members` | `OrgMemberOption[]` | — | from `getOrgMembers()` |
| `value` | `string \| null` | — | selected member id |
| `onValueChange` | `(value: string \| null) => void` | — | fires on select/clear |
| `placeholder` | `string` | `'Select a member...'` | |
| `disabled` | `boolean` | `false` | |
| `loading` | `boolean` | `false` | shows spinner |
| `id` | `string` | — | for `<label htmlFor>` |

**Usage**
```tsx
const members = await getOrgMembers() // server
<MemberPicker members={members} value={leadId} onValueChange={setLeadId} />
```
Reuse for task assignee, meeting participants, approvers, CRM owners, HR
managers. For multi-select, extend with base-ui `multiple`.

---

## DatePicker

`@/components/shared/date-picker` — button + popover calendar. Emits an ISO
`yyyy-MM-dd` string (or `''` when cleared) so it drops straight into forms and
server actions.

**Props**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | — | ISO `yyyy-MM-dd` or `''` |
| `onChange` | `(value: string) => void` | — | |
| `placeholder` | `string` | `'Pick a date'` | |
| `disabled` | `boolean` | `false` | |
| `minDate` / `maxDate` | `Date` | — | bounds |
| `disabledDates` | `(date: Date) => boolean` | — | custom disabling |
| `id` | `string` | — | |

**Usage**
```tsx
<DatePicker value={dueDate} onChange={setDueDate} minDate={new Date()} />
```

---

## Combobox

`@/components/ui/combobox` — the standard searchable single-select for
`{ value, label }` lists. Search, keyboard nav, empty/loading states, clear.

**Props**
| Prop | Type | Default |
|---|---|---|
| `items` | `{ value: string; label: string }[]` | — |
| `value` | `string \| null` | — |
| `onValueChange` | `(value: string \| null) => void` | — |
| `placeholder` | `string` | `'Select...'` |
| `emptyText` | `string` | `'No results found.'` |
| `disabled` / `loading` | `boolean` | `false` |
| `id` | `string` | — |

**Usage**
```tsx
<Combobox items={[{ value: 'a', label: 'Alpha' }]} value={v} onValueChange={setV} />
```

---

## RichTextEditor

`@/components/shared/rich-text-editor` — Tiptap editor. Headings, bold/italic/
underline, bullet/ordered/check lists, tables, links, undo/redo, placeholder.
Foundation for Meeting Notes, Task/Project descriptions, CRM/HR notes.

**Props**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | — | HTML |
| `onChange` | `(html: string) => void` | — | fires every edit (autosave-ready) |
| `placeholder` | `string` | `'Write something…'` | |
| `editable` | `boolean` | `true` | `false` hides toolbar for read-only |
| `className` | `string` | — | |

**Usage**
```tsx
<RichTextEditor value={html} onChange={setHtml} placeholder="Describe the task" />
// render stored HTML read-only:
<div className="zivo-prose" dangerouslySetInnerHTML={{ __html: html }} />
```
Autosave: debounce `onChange` and persist in the parent. Architecture supports
future `@mentions`, AI suggestions, task extraction, and comments as added
Tiptap extensions — no rewrite needed.

---

## Adoption

- Project create/edit dialog now uses MemberPicker (lead), DatePicker (start/
  due, with min/max cross-binding), and RichTextEditor (description).
- `getOrgMembers()` (`lib/workflow/members.ts`) is the shared members reader.
