'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getOrgId } from '@/lib/supabase/get-org-id'

export type EmploymentType = {
  id: string
  organization_id: string
  name: string
  description: string | null
  status: string
  created_at: string
  updated_at: string
}

export async function getEmploymentTypes(): Promise<EmploymentType[]> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { data, error } = await supabase.from('employment_types').select('*').eq('organization_id', orgId).order('name')
  if (error) throw new Error(`Failed to load employment types: ${error.message}`)
  return (data ?? []) as EmploymentType[]
}

export async function createEmploymentType(formData: {
  name: string; description: string; status: string
}): Promise<{ error: string }> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { error } = await supabase.from('employment_types').insert({
    organization_id: orgId, name: formData.name,
    description: formData.description || null, status: formData.status,
  })
  if (error) return { error: `Failed to create employment type: ${error.message}` }
  revalidatePath('/app/system/employment-types')
  return { error: '' }
}

export async function updateEmploymentType(id: string, formData: {
  name: string; description: string; status: string
}): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('employment_types').update({
    name: formData.name, description: formData.description || null, status: formData.status,
  }).eq('id', id)
  if (error) return { error: `Failed to update employment type: ${error.message}` }
  revalidatePath('/app/system/employment-types')
  return { error: '' }
}

export async function deleteEmploymentType(id: string): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('employment_types').delete().eq('id', id)
  if (error) return { error: `Failed to delete employment type: ${error.message}` }
  revalidatePath('/app/system/employment-types')
  return { error: '' }
}
