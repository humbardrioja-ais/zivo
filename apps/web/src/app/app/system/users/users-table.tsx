'use client'

import { useState, useCallback } from 'react'
import { Pencil, UserX, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { DataToolbar } from '@/components/shared/data-toolbar'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { UserDialog } from './user-dialog'
import { getUsers, deactivateMember, type OrgMember } from './actions'
import type { Branch } from '../branches/actions'
import type { Department } from '../departments/actions'
import type { JobTitle } from '../job-titles/actions'
import type { Role } from '../roles/actions'
import type { EmploymentType } from '../employment-types/actions'

interface Props {
  initial: OrgMember[]; branches: Branch[]; departments: Department[];
  jobTitles: JobTitle[]; roles: Role[]; employmentTypes: EmploymentType[]
}

export function UsersTable({ initial, branches, departments, jobTitles, roles, employmentTypes }: Props) {
  const [members, setMembers] = useState<OrgMember[]>(initial)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<OrgMember | null>(null)
  const [deactivating, setDeactivating] = useState<OrgMember | null>(null)

  const refresh = useCallback(async () => { setMembers(await getUsers()) }, [])
  const filtered = members.filter((m) =>
    (m.display_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (m.employee_number ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  function lookup<T extends { id: string }>(list: T[], id: string | null, field: keyof T): string {
    if (!id) return '—'
    const item = list.find((i) => i.id === id)
    return item ? String(item[field]) : '—'
  }

  async function handleDeactivate() {
    if (!deactivating) return
    await deactivateMember(deactivating.id)
    setDeactivating(null)
    await refresh()
  }

  return (
    <>
      <DataToolbar search={search} onSearchChange={setSearch} placeholder="Search members..." />

      {members.length === 0 ? (
        <EmptyState icon={Users} title="No members yet" description="Organization members will appear here after they sign in." />
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Employee #</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.display_name || '(unnamed)'}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{m.employee_number || '—'}</TableCell>
                  <TableCell>{lookup(branches, m.branch_id, 'name')}</TableCell>
                  <TableCell>{lookup(departments, m.department_id, 'name')}</TableCell>
                  <TableCell>{lookup(jobTitles, m.job_title_id, 'title')}</TableCell>
                  <TableCell>{lookup(roles, m.role_id, 'name')}</TableCell>
                  <TableCell><StatusBadge status={m.employment_status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(m); setDialogOpen(true) }}><Pencil className="h-4 w-4" /></Button>
                      {m.employment_status === 'active' && (
                        <Button variant="ghost" size="icon" onClick={() => setDeactivating(m)}><UserX className="h-4 w-4 text-destructive" /></Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No members match your search.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {editing && (
        <UserDialog open={dialogOpen} onOpenChange={setDialogOpen} member={editing} branches={branches}
          departments={departments} jobTitles={jobTitles} roles={roles} employmentTypes={employmentTypes} onSaved={refresh} />
      )}
      <ConfirmDialog open={!!deactivating} onOpenChange={(open) => { if (!open) setDeactivating(null) }}
        title="Deactivate Member" description={`Are you sure you want to deactivate "${deactivating?.display_name || 'this member'}"?`}
        confirmLabel="Deactivate" onConfirm={handleDeactivate} />
    </>
  )
}
