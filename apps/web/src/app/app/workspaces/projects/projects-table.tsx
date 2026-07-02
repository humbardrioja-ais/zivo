'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { DataToolbar } from '@/components/shared/data-toolbar'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { ProjectDialog } from './project-dialog'
import { getProjects, deleteProject, type Project } from './actions'
import type { OrgMemberOption } from '@/lib/workflow/members'

interface Props { initial: Project[]; members: OrgMemberOption[] }

export function ProjectsTable({ initial, members }: Props) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(initial)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState<Project | null>(null)

  const refresh = useCallback(async () => { setProjects(await getProjects()) }, [])
  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.code ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  function leadName(id: string | null) {
    if (!id) return '—'
    return members.find((m) => m.id === id)?.displayName ?? '—'
  }

  async function handleDelete() {
    if (!deleting) return
    await deleteProject(deleting.id)
    setDeleting(null)
    await refresh()
  }

  return (
    <>
      <DataToolbar search={search} onSearchChange={setSearch} placeholder="Search projects..."
        actions={<Button onClick={() => { setEditing(null); setDialogOpen(true) }}><Plus className="mr-2 h-4 w-4" />New Project</Button>} />

      {projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects yet" description="Create your first project to organize your work."
          actions={<Button onClick={() => { setEditing(null); setDialogOpen(true) }}><Plus className="mr-2 h-4 w-4" />New Project</Button>} />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => router.push(`/app/workspaces/projects/${p.id}`)}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.code || '—'}</TableCell>
                  <TableCell>{leadName(p.lead_id)}</TableCell>
                  <TableCell className="text-muted-foreground">{p.due_date || '—'}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setDialogOpen(true) }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleting(p)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No projects match your search.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} project={editing} members={members} onSaved={refresh} />
      <ConfirmDialog open={!!deleting} onOpenChange={(open) => { if (!open) setDeleting(null) }}
        title="Delete Project" description={`Delete "${deleting?.name}"? This removes its areas and members. This cannot be undone.`}
        confirmLabel="Delete" onConfirm={handleDelete} />
    </>
  )
}
