'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { updateMember, type OrgMember } from './actions'
import type { Branch } from '../branches/actions'
import type { Department } from '../departments/actions'
import type { JobTitle } from '../job-titles/actions'
import type { Role } from '../roles/actions'
import type { EmploymentType } from '../employment-types/actions'

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: OrgMember
  branches: Branch[]
  departments: Department[]
  jobTitles: JobTitle[]
  roles: Role[]
  employmentTypes: EmploymentType[]
  onSaved: () => void
}

function UserForm({ member, branches, departments, jobTitles, roles, employmentTypes, onOpenChange, onSaved }: Omit<UserDialogProps, 'open'>) {
  const [form, setForm] = useState({
    display_name: member.display_name ?? '',
    employee_number: member.employee_number ?? '',
    branch_id: member.branch_id ?? '',
    department_id: member.department_id ?? '',
    job_title_id: member.job_title_id ?? '',
    role_id: member.role_id ?? '',
    employment_type_id: member.employment_type_id ?? '',
    employment_status: member.employment_status ?? 'active',
    hired_at: member.hired_at ? member.hired_at.split('T')[0] : '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string | null) {
    setForm((prev) => ({ ...prev, [field]: value ?? '' }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const result = await updateMember(member.id, form)
    setSaving(false)
    if (result.error) { setError(result.error); return }
    onOpenChange(false)
    onSaved()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Member</DialogTitle>
        <DialogDescription>Update organizational assignments.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
        {error && <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="u-name">Display Name</Label>
            <Input id="u-name" value={form.display_name} onChange={(e) => update('display_name', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="u-empno">Employee Number</Label>
            <Input id="u-empno" value={form.employee_number} onChange={(e) => update('employee_number', e.target.value)} placeholder="EMP-001" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="u-branch">Branch</Label>
          <Select value={form.branch_id} onValueChange={(v) => update('branch_id', v)}>
            <SelectTrigger id="u-branch"><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {branches.filter((b) => b.status === 'active').map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="u-dept">Department</Label>
            <Select value={form.department_id} onValueChange={(v) => update('department_id', v)}>
              <SelectTrigger id="u-dept"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {departments.filter((d) => d.status === 'active').map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="u-jt">Job Title</Label>
            <Select value={form.job_title_id} onValueChange={(v) => update('job_title_id', v)}>
              <SelectTrigger id="u-jt"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {jobTitles.filter((j) => j.status === 'active').map((j) => (<SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="u-role">Role</Label>
            <Select value={form.role_id} onValueChange={(v) => update('role_id', v)}>
              <SelectTrigger id="u-role"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {roles.map((r) => (<SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="u-et">Employment Type</Label>
            <Select value={form.employment_type_id} onValueChange={(v) => update('employment_type_id', v)}>
              <SelectTrigger id="u-et"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {employmentTypes.filter((e) => e.status === 'active').map((e) => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="u-status">Employment Status</Label>
            <Select value={form.employment_status} onValueChange={(v) => update('employment_status', v)}>
              <SelectTrigger id="u-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="u-hired">Hire Date</Label>
            <Input id="u-hired" type="date" value={form.hired_at} onChange={(e) => update('hired_at', e.target.value)} />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
      </DialogFooter>
    </>
  )
}

export function UserDialog({ open, onOpenChange, member, branches, departments, jobTitles, roles, employmentTypes, onSaved }: UserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && <UserForm key={member.id} member={member} branches={branches} departments={departments} jobTitles={jobTitles} roles={roles} employmentTypes={employmentTypes} onOpenChange={onOpenChange} onSaved={onSaved} />}
      </DialogContent>
    </Dialog>
  )
}
