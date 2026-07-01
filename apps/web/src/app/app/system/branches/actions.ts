'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getOrgId } from '@/lib/supabase/get-org-id'

export type Branch = {
  id: string
  organization_id: string
  name: string
  code: string | null
  address: string | null
  city: string | null
  country: string | null
  phone: string | null
  email: string | null
  is_headquarters: boolean
  status: string
  created_at: string
  updated_at: string
}

export async function getBranches(): Promise<Branch[]> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { data, error } = await supabase.from('branches').select('*').eq('organization_id', orgId).order('name')
  if (error) throw new Error(`Failed to load branches: ${error.message}`)
  return (data ?? []) as Branch[]
}

export async function createBranch(formData: {
  name: string; code: string; address: string; city: string; country: string;
  phone: string; email: string; is_headquarters: boolean; status: string
}): Promise<{ error: string }> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { error } = await supabase.from('branches').insert({
    organization_id: orgId, name: formData.name, code: formData.code || null,
    address: formData.address || null, city: formData.city || null,
    country: formData.country || null, phone: formData.phone || null,
    email: formData.email || null, is_headquarters: formData.is_headquarters,
    status: formData.status,
  })
  if (error) return { error: `Failed to create branch: ${error.message}` }
  revalidatePath('/app/system/branches')
  return { error: '' }
}

export async function updateBranch(id: string, formData: {
  name: string; code: string; address: string; city: string; country: string;
  phone: string; email: string; is_headquarters: boolean; status: string
}): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('branches').update({
    name: formData.name, code: formData.code || null,
    address: formData.address || null, city: formData.city || null,
    country: formData.country || null, phone: formData.phone || null,
    email: formData.email || null, is_headquarters: formData.is_headquarters,
    status: formData.status,
  }).eq('id', id)
  if (error) return { error: `Failed to update branch: ${error.message}` }
  revalidatePath('/app/system/branches')
  return { error: '' }
}

export async function deleteBranch(id: string): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('branches').delete().eq('id', id)
  if (error) return { error: `Failed to delete branch: ${error.message}` }
  revalidatePath('/app/system/branches')
  return { error: '' }
}
