'use client'

import { useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, MapPin, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { DataToolbar } from '@/components/shared/data-toolbar'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { BranchDialog } from './branch-dialog'
import { getBranches, deleteBranch, type Branch } from './actions'

interface BranchesTableProps { initial: Branch[] }

export function BranchesTable({ initial }: BranchesTableProps) {
  const [branches, setBranches] = useState<Branch[]>(initial)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Branch | null>(null)
  const [deleting, setDeleting] = useState<Branch | null>(null)

  const refresh = useCallback(async () => { setBranches(await getBranches()) }, [])
  const filtered = branches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.city ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  async function handleDelete() {
    if (!deleting) return
    await deleteBranch(deleting.id)
    setDeleting(null)
    await refresh()
  }

  return (
    <>
      <DataToolbar search={search} onSearchChange={setSearch} placeholder="Search branches..."
        actions={<Button onClick={() => { setEditing(null); setDialogOpen(true) }}><Plus className="mr-2 h-4 w-4" />Add Branch</Button>} />

      {branches.length === 0 ? (
        <EmptyState icon={MapPin} title="No branches yet" description="Add your first branch or office location."
          actions={<Button onClick={() => { setEditing(null); setDialogOpen(true) }}><Plus className="mr-2 h-4 w-4" />Add Branch</Button>} />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">
                    {b.name}
                    {b.is_headquarters && <Badge variant="outline" className="ml-2 text-xs"><Star className="h-3 w-3 mr-1" />HQ</Badge>}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{b.code || '—'}</TableCell>
                  <TableCell>{b.city || '—'}</TableCell>
                  <TableCell>{b.country || '—'}</TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(b); setDialogOpen(true) }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleting(b)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No branches match your search.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <BranchDialog open={dialogOpen} onOpenChange={setDialogOpen} branch={editing} onSaved={refresh} />
      <ConfirmDialog open={!!deleting} onOpenChange={(open) => { if (!open) setDeleting(null) }}
        title="Delete Branch" description={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`}
        confirmLabel="Delete" onConfirm={handleDelete} />
    </>
  )
}
