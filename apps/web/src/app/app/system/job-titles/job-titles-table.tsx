'use client'

import { useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { DataToolbar } from '@/components/shared/data-toolbar'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { JobTitleDialog } from './job-title-dialog'
import { getJobTitles, deleteJobTitle, type JobTitle } from './actions'
import type { Department } from '../departments/actions'

interface JobTitlesTableProps {
  initial: JobTitle[]
  departments: Department[]
}

export function JobTitlesTable({ initial, departments }: JobTitlesTableProps) {
  const [jobTitles, setJobTitles] = useState<JobTitle[]>(initial)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<JobTitle | null>(null)
  const [deleting, setDeleting] = useState<JobTitle | null>(null)

  const refresh = useCallback(async () => { setJobTitles(await getJobTitles()) }, [])

  const filtered = jobTitles.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    (j.code ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  function deptName(id: string | null) {
    if (!id) return '—'
    return departments.find((d) => d.id === id)?.name ?? '—'
  }

  async function handleDelete() {
    if (!deleting) return
    await deleteJobTitle(deleting.id)
    setDeleting(null)
    await refresh()
  }

  return (
    <>
      <DataToolbar search={search} onSearchChange={setSearch} placeholder="Search job titles..."
        actions={<Button onClick={() => { setEditing(null); setDialogOpen(true) }}><Plus className="mr-2 h-4 w-4" />Add Job Title</Button>} />

      {jobTitles.length === 0 ? (
        <EmptyState icon={Briefcase} title="No job titles yet" description="Create your first job title."
          actions={<Button onClick={() => { setEditing(null); setDialogOpen(true) }}><Plus className="mr-2 h-4 w-4" />Add Job Title</Button>} />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((jt) => (
                <TableRow key={jt.id}>
                  <TableCell className="font-medium">{jt.title}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{jt.code || '—'}</TableCell>
                  <TableCell>{deptName(jt.department_id)}</TableCell>
                  <TableCell><StatusBadge status={jt.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(jt); setDialogOpen(true) }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleting(jt)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No job titles match your search.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <JobTitleDialog open={dialogOpen} onOpenChange={setDialogOpen} jobTitle={editing} departments={departments} onSaved={refresh} />
      <ConfirmDialog open={!!deleting} onOpenChange={(open) => { if (!open) setDeleting(null) }}
        title="Delete Job Title" description={`Are you sure you want to delete "${deleting?.title}"? This action cannot be undone.`}
        confirmLabel="Delete" onConfirm={handleDelete} />
    </>
  )
}
