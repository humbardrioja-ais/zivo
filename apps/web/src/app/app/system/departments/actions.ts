'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getOrgId } from '@/lib/supabase/get-org-id'

export type Department = {
  id: string
  organization_id: string
  branch_id: string | null
  parent_id: string | null
  name: string
  code: string | null
  description: string | null
  status: string
  created_at: string
  updated_at: string
}

export async function getDepartments(): Promise<Department[]> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { data, error } = await supabase.from('departments').select('*').eq('organization_id', orgId).order('name')
  if (error) throw new Error(`Failed to load departments: ${error.message}`)
  return (data ?? []) as Department[]
}

export async function createDepartment(formData: {
  name: string; code: string; branch_id: string; parent_id: string; description: string; status: string
}): Promise<{ error: string }> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { error } = await supabase.from('departments').insert({
    organization_id: orgId, name: formData.name, code: formData.code || null,
    branch_id: formData.branch_id || null, parent_id: formData.parent_id || null,
    description: formData.description || null, status: formData.status,
  })
  if (error) return { error: `Failed to create department: ${error.message}` }
  revalidatePath('/app/system/departments')
  return { error: '' }
}

export async function updateDepartment(id: string, formData: {
  name: string; code: string; branch_id: string; parent_id: string; description: string; status: string
}): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('departments').update({
    name: formData.name, code: formData.code || null,
    branch_id: formData.branch_id || null, parent_id: formData.parent_id || null,
    description: formData.description || null, status: formData.status,
  }).eq('id', id)
  if (error) return { error: `Failed to update department: ${error.message}` }
  revalidatePath('/app/system/departments')
  return { error: '' }
}

export async function deleteDepartment(id: string): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('departments').delete().eq('id', id)
  if (error) return { error: `Failed to delete department: ${error.message}` }
  revalidatePath('/app/system/departments')
  return { error: '' }
}
