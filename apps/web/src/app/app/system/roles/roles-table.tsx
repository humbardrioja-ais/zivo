'use client'

import { useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/shared/empty-state'
import { DataToolbar } from '@/components/shared/data-toolbar'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { RoleDialog } from './role-dialog'
import { getRoles, deleteRole, type Role } from './actions'
import { type PermissionGroup } from '../permissions/actions'

interface RolesTableProps {
  initial: Role[]
  permissionGroups: PermissionGroup[]
}

export function RolesTable({ initial, permissionGroups }: RolesTableProps) {
  const [roles, setRoles] = useState<Role[]>(initial)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Role | null>(null)
  const [deleting, setDeleting] = useState<Role | null>(null)

  const refresh = useCallback(async () => { setRoles(await getRoles()) }, [])
  const filtered = roles.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))

  async function handleDelete() {
    if (!deleting) return
    await deleteRole(deleting.id)
    setDeleting(null)
    await refresh()
  }

  return (
    <>
      <DataToolbar search={search} onSearchChange={setSearch} placeholder="Search roles..."
        actions={<Button onClick={() => { setEditing(null); setDialogOpen(true) }}><Plus className="mr-2 h-4 w-4" />Add Role</Button>} />

      {roles.length === 0 ? (
        <EmptyState icon={Shield} title="No roles yet" description="Create your first role to define access levels."
          actions={<Button onClick={() => { setEditing(null); setDialogOpen(true) }}><Plus className="mr-2 h-4 w-4" />Add Role</Button>} />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    {role.name}
                    {role.is_system && <Badge variant="outline" className="ml-2 text-xs">System</Badge>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{role.description || '—'}</TableCell>
                  <TableCell><Badge variant="secondary">{role.permission_keys.length} permissions</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(role); setDialogOpen(true) }} disabled={role.is_system}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleting(role)} disabled={role.is_system}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No roles match your search.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <RoleDialog open={dialogOpen} onOpenChange={setDialogOpen} role={editing} permissionGroups={permissionGroups} onSaved={refresh} />
      <ConfirmDialog open={!!deleting} onOpenChange={(open) => { if (!open) setDeleting(null) }}
        title="Delete Role" description={`Are you sure you want to delete "${deleting?.name}"? Users assigned this role will lose its permissions.`}
        confirmLabel="Delete" onConfirm={handleDelete} />
    </>
  )
}
