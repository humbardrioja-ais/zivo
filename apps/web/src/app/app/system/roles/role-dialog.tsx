'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { createRole, updateRole, type Role } from './actions'
import { type PermissionGroup } from '../permissions/actions'

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  permissionGroups: PermissionGroup[]
  onSaved: () => void
}

function RoleForm({ role, permissionGroups, onOpenChange, onSaved }: Omit<RoleDialogProps, 'open'>) {
  const isEdit = !!role
  const [name, setName] = useState(role?.name ?? '')
  const [description, setDescription] = useState(role?.description ?? '')
  const [selected, setSelected] = useState<Set<string>>(new Set(role?.permission_keys ?? []))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function togglePermission(key: string) {
    setSelected((prev) => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next })
  }

  function toggleGroup(group: PermissionGroup) {
    const keys = group.permissions.map((p) => p.key)
    const allSelected = keys.every((k) => selected.has(k))
    setSelected((prev) => { const next = new Set(prev); keys.forEach((k) => allSelected ? next.delete(k) : next.add(k)); return next })
  }

  async function handleSave() {
    if (!name.trim()) { setError('Role name is required.'); return }
    setSaving(true)
    setError('')
    const formData = { name, description, permission_keys: Array.from(selected) }
    const result = isEdit ? await updateRole(role.id, formData) : await createRole(formData)
    setSaving(false)
    if (result.error) { setError(result.error); return }
    onOpenChange(false)
    onSaved()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit Role' : 'Add Role'}</DialogTitle>
        <DialogDescription>{isEdit ? 'Update role and permissions.' : 'Create a new role with permissions.'}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
        {error && <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
        <div className="space-y-2">
          <Label htmlFor="role-name">Role Name <span className="text-destructive">*</span></Label>
          <Input id="role-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Manager" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role-desc">Description</Label>
          <Textarea id="role-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this role can do" rows={2} />
        </div>
        <Separator />
        <div className="space-y-4">
          <Label>Permissions</Label>
          {permissionGroups.map((group) => {
            const keys = group.permissions.map((p) => p.key)
            const allChecked = keys.every((k) => selected.has(k))
            const someChecked = keys.some((k) => selected.has(k))
            return (
              <div key={group.group} className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input type="checkbox" checked={allChecked}
                    ref={(el) => { if (el) el.indeterminate = someChecked && !allChecked }}
                    onChange={() => toggleGroup(group)} className="rounded" />
                  {group.group}
                </label>
                <div className="ml-6 space-y-1">
                  {group.permissions.map((p) => (
                    <label key={p.key} className="flex items-start gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={selected.has(p.key)} onChange={() => togglePermission(p.key)} className="rounded mt-0.5" />
                      <div>
                        <span>{p.label}</span>
                        {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
          {permissionGroups.length === 0 && (
            <p className="text-sm text-muted-foreground">No permissions defined yet.</p>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Role'}</Button>
      </DialogFooter>
    </>
  )
}

export function RoleDialog({ open, onOpenChange, role, permissionGroups, onSaved }: RoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && <RoleForm key={role?.id ?? 'new'} role={role} permissionGroups={permissionGroups} onOpenChange={onOpenChange} onSaved={onSaved} />}
      </DialogContent>
    </Dialog>
  )
}
