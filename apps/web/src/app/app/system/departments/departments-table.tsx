'use client'

import { useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Network } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { DataToolbar } from '@/components/shared/data-toolbar'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DepartmentDialog } from './department-dialog'
import { getDepartments, deleteDepartment, type Department } from './actions'
import type { Branch } from '../branches/actions'

interface Props { initial: Department[]; branches: Branch[] }

export function DepartmentsTable({ initial, branches }: Props) {
  const [departments, setDepartments] = useState<Department[]>(initial)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Department | null>(null)
  const [deleting, setDeleting] = useState<Department | null>(null)

  const refresh = useCallback(async () => { setDepartments(await getDepartments()) }, [])
  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.code ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  function lookup(id: string | null, list: { id: string; name: string }[]) {
    if (!id) return '—'
    return list.find((i) => i.id === id)?.name ?? '—'
  }

  async function handleDelete() {
    if (!deleting) return
    await deleteDepartment(deleting.id)
    setDeleting(null)
    await refresh()
  }

  return (
    <>
      <DataToolbar search={search} onSearchChange={setSearch} placeholder="Search departments..."
        actions={<Button onClick={() => { setEditing(null); setDialogOpen(true) }}><Plus className="mr-2 h-4 w-4" />Add Department</Button>} />

      {departments.length === 0 ? (
        <EmptyState icon={Network} title="No departments yet" description="Create your first department."
          actions={<Button onClick={() => { setEditing(null); setDialogOpen(true) }}><Plus className="mr-2 h-4 w-4" />Add Department</Button>} />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{dept.code || '—'}</TableCell>
                  <TableCell>{lookup(dept.branch_id, branches)}</TableCell>
                  <TableCell>{lookup(dept.parent_id, departments)}</TableCell>
                  <TableCell><StatusBadge status={dept.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(dept); setDialogOpen(true) }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleting(dept)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No departments match your search.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <DepartmentDialog open={dialogOpen} onOpenChange={setDialogOpen} department={editing} departments={departments} branches={branches} onSaved={refresh} />
      <ConfirmDialog open={!!deleting} onOpenChange={(open) => { if (!open) setDeleting(null) }}
        title="Delete Department" description={`Are you sure you want to delete "${deleting?.name}"?`}
        confirmLabel="Delete" onConfirm={handleDelete} />
    </>
  )
}
