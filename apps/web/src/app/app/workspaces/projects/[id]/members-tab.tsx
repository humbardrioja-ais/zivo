'use client'

import { useState, useCallback } from 'react'
import { Plus, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/shared/empty-state'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { getProjectMembers, addProjectMember, removeProjectMember, type ProjectMember } from '../actions'
import type { OrgMemberOption } from '@/lib/workflow/members'

interface Props { projectId: string; initial: ProjectMember[]; orgMembers: OrgMemberOption[] }

export function MembersTab({ projectId, initial, orgMembers }: Props) {
  const [members, setMembers] = useState<ProjectMember[]>(initial)
  const [selectedMember, setSelectedMember] = useState('')
  const [role, setRole] = useState('member')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [removing, setRemoving] = useState<ProjectMember | null>(null)

  const refresh = useCallback(async () => { setMembers(await getProjectMembers(projectId)) }, [projectId])

  const available = orgMembers.filter((o) => !members.some((m) => m.member_id === o.id))

  async function handleAdd() {
    if (!selectedMember) { setError('Select a member to add.'); return }
    setAdding(true)
    setError('')
    const result = await addProjectMember(projectId, selectedMember, role)
    setAdding(false)
    if (result.error) { setError(result.error); return }
    setSelectedMember('')
    setRole('member')
    await refresh()
  }

  async function handleRemove() {
    if (!removing) return
    await removeProjectMember(removing.id, projectId)
    setRemoving(null)
    await refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-48 flex-1">
          <Select value={selectedMember} onValueChange={(v) => setSelectedMember(v ?? '')}>
            <SelectTrigger><SelectValue placeholder="Add a member..." /></SelectTrigger>
            <SelectContent>
              {available.length === 0 && <SelectItem value="" disabled>All members added</SelectItem>}
              {available.map((m) => (<SelectItem key={m.id} value={m.id}>{m.displayName}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <Select value={role} onValueChange={(v) => setRole(v ?? 'member')}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="lead">Lead</SelectItem>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleAdd} disabled={adding}><Plus className="mr-2 h-4 w-4" />Add</Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}

      {members.length === 0 ? (
        <EmptyState icon={Users} title="No members" description="Add organization members to this project." />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-16 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.display_name || '(unnamed)'}</TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize font-normal">{m.role}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setRemoving(m)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog open={!!removing} onOpenChange={(open) => { if (!open) setRemoving(null) }}
        title="Remove Member" description={`Remove "${removing?.display_name || 'this member'}" from the project?`}
        confirmLabel="Remove" onConfirm={handleRemove} />
    </div>
  )
}
