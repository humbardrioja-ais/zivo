'use server'

import { createClient } from '@/lib/supabase/server'

export type Permission = {
  id: string
  key: string
  module: string
  category: string
  label: string
  description: string | null
}

export type PermissionGroup = {
  group: string
  permissions: Permission[]
}

export async function getPermissions(): Promise<Permission[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .order('module')
    .order('category')
    .order('label')

  if (error) throw new Error(`Failed to load permissions: ${error.message}`)
  return (data ?? []) as Permission[]
}

export async function getPermissionGroups(): Promise<PermissionGroup[]> {
  const permissions = await getPermissions()
  const groups: Record<string, Permission[]> = {}
  for (const p of permissions) {
    const key = `${p.module} — ${p.category}`
    if (!groups[key]) groups[key] = []
    groups[key].push(p)
  }
  return Object.entries(groups).map(([group, perms]) => ({ group, permissions: perms }))
}
