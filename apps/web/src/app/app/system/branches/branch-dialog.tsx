'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createBranch, updateBranch, type Branch } from './actions'

interface BranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch: Branch | null
  onSaved: () => void
}

function BranchForm({ branch, onOpenChange, onSaved }: Omit<BranchDialogProps, 'open'>) {
  const isEdit = !!branch
  const [form, setForm] = useState({
    name: branch?.name ?? '',
    code: branch?.code ?? '',
    address: branch?.address ?? '',
    city: branch?.city ?? '',
    country: branch?.country ?? '',
    phone: branch?.phone ?? '',
    email: branch?.email ?? '',
    is_headquarters: branch?.is_headquarters ?? false,
    status: branch?.status ?? 'active',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string | boolean | null) {
    setForm((prev) => ({ ...prev, [field]: value ?? '' }))
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Branch name is required.'); return }
    setSaving(true)
    setError('')
    const result = isEdit ? await updateBranch(branch.id, form) : await createBranch(form)
    setSaving(false)
    if (result.error) { setError(result.error); return }
    onOpenChange(false)
    onSaved()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
        <DialogDescription>{isEdit ? 'Update branch details.' : 'Add a new branch or office location.'}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
        {error && <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="br-name">Branch Name <span className="text-destructive">*</span></Label>
            <Input id="br-name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Head Office" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="br-code">Branch Code</Label>
            <Input id="br-code" value={form.code} onChange={(e) => update('code', e.target.value)} placeholder="HQ" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="br-address">Address</Label>
          <Textarea id="br-address" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Street address" rows={2} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="br-city">City</Label>
            <Input id="br-city" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="New York" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="br-country">Country</Label>
            <Input id="br-country" value={form.country} onChange={(e) => update('country', e.target.value)} placeholder="United States" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="br-phone">Phone</Label>
            <Input id="br-phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="br-email">Email</Label>
            <Input id="br-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="office@company.com" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="br-status">Status</Label>
            <Select value={form.status} onValueChange={(v) => update('status', v)}>
              <SelectTrigger id="br-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end space-x-2 pb-1">
            <input type="checkbox" id="br-hq" checked={form.is_headquarters} onChange={(e) => update('is_headquarters', e.target.checked)} className="rounded" />
            <Label htmlFor="br-hq" className="cursor-pointer">Headquarters</Label>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Branch'}</Button>
      </DialogFooter>
    </>
  )
}

export function BranchDialog({ open, onOpenChange, branch, onSaved }: BranchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && <BranchForm key={branch?.id ?? 'new'} branch={branch} onOpenChange={onOpenChange} onSaved={onSaved} />}
      </DialogContent>
    </Dialog>
  )
}
