'use client'

import { useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import {
  getProjectAreas, createProjectArea, updateProjectArea, deleteProjectArea, type ProjectArea,
} from '../actions'

interface Props { projectId: string; initial: ProjectArea[] }

function AreaForm({ projectId, area, onDone }: { projectId: string; area: ProjectArea | null; onDone: () => void }) {
  const isEdit = !!area
  const [form, setForm] = useState({
    name: area?.name ?? '', description: area?.description ?? '', status: area?.status ?? 'active',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!form.name.trim()) { setError('Area name is required.'); return }
    setSaving(true)
    setError('')
    const result = isEdit
      ? await updateProjectArea(area.id, projectId, form)
      : await createProjectArea(projectId, form)
    setSaving(false)
    if (result.error) { setError(result.error); return }
    onDone()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit Area' : 'Add Area'}</DialogTitle>
        <DialogDescription>Areas group related work within a project.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        {error && <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
        <div className="space-y-2">
          <Label htmlFor="a-name">Name <span className="text-destructive">*</span></Label>
          <Input id="a-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Design" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="a-desc">Description</Label>
          <Textarea id="a-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="a-status">Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v ?? 'active' })}>
            <SelectTrigger id="a-status"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onDone} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Area'}</Button>
      </DialogFooter>
    </>
  )
}

export function AreasTab({ projectId, initial }: Props) {
  const [areas, setAreas] = useState<ProjectArea[]>(initial)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ProjectArea | null>(null)
  const [deleting, setDeleting] = useState<ProjectArea | null>(null)

  const refresh = useCallback(async () => { setAreas(await getProjectAreas(projectId)) }, [projectId])

  function openCreate() { setEditing(null); setDialogOpen(true) }
  function openEdit(a: ProjectArea) { setEditing(a); setDialogOpen(true) }
  async function onDone() { setDialogOpen(false); await refresh() }

  async function handleDelete() {
    if (!deleting) return
    await deleteProjectArea(deleting.id, projectId)
    setDeleting(null)
    await refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Area</Button>
      </div>

      {areas.length === 0 ? (
        <EmptyState icon={Layers} title="No areas yet" description="Break the project into areas to organize its work."
          actions={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Area</Button>} />
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
              {areas.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className="text-muted-foreground">{a.description || '—'}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleting(a)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {dialogOpen && <AreaForm key={editing?.id ?? 'new'} projectId={projectId} area={editing} onDone={onDone} />}
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleting} onOpenChange={(open) => { if (!open) setDeleting(null) }}
        title="Delete Area" description={`Delete "${deleting?.name}"? This cannot be undone.`}
        confirmLabel="Delete" onConfirm={handleDelete} />
    </div>
  )
}
