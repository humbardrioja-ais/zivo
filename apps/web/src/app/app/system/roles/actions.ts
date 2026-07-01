'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getOrgId } from '@/lib/supabase/get-org-id'

export type Role = {
  id: string
  organization_id: string
  name: string
  description: string | null
  is_system: boolean
  status: string
  created_at: string
  updated_at: string
  permission_keys: string[]
}

export async function getRoles(): Promise<Role[]> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { data: roles, error } = await supabase.from('roles').select('*').eq('organization_id', orgId).order('name')
  if (error) throw new Error(`Failed to load roles: ${error.message}`)

  const roleIds = (roles ?? []).map((r: Record<string, unknown>) => r.id as string)
  let permMap: Record<string, string[]> = {}
  if (roleIds.length > 0) {
    const { data: rp } = await supabase.from('role_permissions').select('role_id, permissions(key)').in('role_id', roleIds)
    permMap = (rp ?? []).reduce((acc: Record<string, string[]>, row: Record<string, unknown>) => {
      const roleId = row.role_id as string
      const perm = row.permissions as Record<string, unknown> | null
      const key = perm?.key as string | undefined
      if (key) { if (!acc[roleId]) acc[roleId] = []; acc[roleId].push(key) }
      return acc
    }, {})
  }

  return (roles ?? []).map((r: Record<string, unknown>) => ({
    ...r, permission_keys: permMap[r.id as string] ?? [],
  })) as Role[]
}

export async function createRole(formData: {
  name: string; description: string; permission_keys: string[]
}): Promise<{ error: string }> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { data: role, error: roleError } = await supabase.from('roles').insert({
    organization_id: orgId, name: formData.name, description: formData.description || null,
  }).select('id').single()
  if (roleError || !role) return { error: `Failed to create role: ${roleError?.message}` }

  if (formData.permission_keys.length > 0) {
    const { data: perms } = await supabase.from('permissions').select('id, key').in('key', formData.permission_keys)
    if (perms && perms.length > 0) {
      await supabase.from('role_permissions').insert(
        perms.map((p: Record<string, unknown>) => ({ role_id: role.id, permission_id: p.id })),
      )
    }
  }
  revalidatePath('/app/system/roles')
  return { error: '' }
}

export async function updateRole(id: string, formData: {
  name: string; description: string; permission_keys: string[]
}): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error: roleError } = await supabase.from('roles').update({
    name: formData.name, description: formData.description || null,
  }).eq('id', id)
  if (roleError) return { error: `Failed to update role: ${roleError.message}` }

  await supabase.from('role_permissions').delete().eq('role_id', id)
  if (formData.permission_keys.length > 0) {
    const { data: perms } = await supabase.from('permissions').select('id, key').in('key', formData.permission_keys)
    if (perms && perms.length > 0) {
      await supabase.from('role_permissions').insert(
        perms.map((p: Record<string, unknown>) => ({ role_id: id, permission_id: p.id })),
      )
    }
  }
  revalidatePath('/app/system/roles')
  return { error: '' }
}

export async function deleteRole(id: string): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('roles').delete().eq('id', id)
  if (error) return { error: `Failed to delete role: ${error.message}` }
  revalidatePath('/app/system/roles')
  return { error: '' }
}
