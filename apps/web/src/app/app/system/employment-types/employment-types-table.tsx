'use client'

import { useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, UserCog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { DataToolbar } from '@/components/shared/data-toolbar'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { EmploymentTypeDialog } from './employment-type-dialog'
import { getEmploymentTypes, deleteEmploymentType, type EmploymentType } from './actions'

interface Props { initial: EmploymentType[] }

export function EmploymentTypesTable({ initial }: Props) {
  const [items, setItems] = useState<EmploymentType[]>(initial)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<EmploymentType | null>(null)
  const [deleting, setDeleting] = useState<EmploymentType | null>(null)

  const refresh = useCallback(async () => { setItems(await getEmploymentTypes()) }, [])
  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))

  async function handleDelete() {
    if (!deleting) return
    await deleteEmploymentType(deleting.id)
    setDeleting(null)
    await refresh()
  }

  return (
    <>
      <DataToolbar search={search} onSearchChange={setSearch} placeholder="Search employment types..."
        actions={<Button onClick={() => { setEditing(null); setDialogOpen(true) }}><Plus className="mr-2 h-4 w-4" />Add Type</Button>} />

      {items.length === 0 ? (
        <EmptyState icon={UserCog} title="No employment types yet" description="Define employment types like Full Time, Part Time, Contract."
          actions={<Button onClick={() => { setEditing(null); setDialogOpen(true) }}><Plus className="mr-2 h-4 w-4" />Add Type</Button>} />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((et) => (
                <TableRow key={et.id}>
                  <TableCell className="font-medium">{et.name}</TableCell>
                  <TableCell className="text-muted-foreground">{et.description || '—'}</TableCell>
                  <TableCell><StatusBadge status={et.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(et); setDialogOpen(true) }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleting(et)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No match.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <EmploymentTypeDialog open={dialogOpen} onOpenChange={setDialogOpen} employmentType={editing} onSaved={refresh} />
      <ConfirmDialog open={!!deleting} onOpenChange={(open) => { if (!open) setDeleting(null) }}
        title="Delete Employment Type" description={`Are you sure you want to delete "${deleting?.name}"?`}
        confirmLabel="Delete" onConfirm={handleDelete} />
    </>
  )
}
