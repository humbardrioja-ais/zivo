'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getOrgId } from '@/lib/supabase/get-org-id'

export type OrgMember = {
  id: string
  organization_id: string
  user_id: string
  role: string
  branch_id: string | null
  department_id: string | null
  job_title_id: string | null
  role_id: string | null
  employment_type_id: string | null
  employment_status: string
  employee_number: string | null
  hired_at: string | null
  created_at: string
  updated_at: string
  display_name: string | null
}

export async function getUsers(): Promise<OrgMember[]> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { data, error } = await supabase
    .from('organization_members')
    .select('*, user_profiles(display_name)')
    .eq('organization_id', orgId)
    .order('created_at')
  if (error) throw new Error(`Failed to load users: ${error.message}`)
  return (data ?? []).map((m: Record<string, unknown>) => ({
    ...m,
    display_name: (m.user_profiles as Record<string, unknown> | null)?.display_name as string | null ?? null,
    employment_status: (m.employment_status as string) ?? 'active',
  })) as OrgMember[]
}

export async function updateMember(id: string, formData: {
  branch_id: string; department_id: string; job_title_id: string;
  role_id: string; employment_type_id: string; employment_status: string;
  employee_number: string; display_name: string; hired_at: string
}): Promise<{ error: string }> {
  const supabase = await createClient()
  const { data: member } = await supabase.from('organization_members').select('user_id').eq('id', id).single()
  if (!member) return { error: 'Member not found' }

  const { error } = await supabase.from('organization_members').update({
    branch_id: formData.branch_id || null,
    department_id: formData.department_id || null,
    job_title_id: formData.job_title_id || null,
    role_id: formData.role_id || null,
    employment_type_id: formData.employment_type_id || null,
    employment_status: formData.employment_status,
    employee_number: formData.employee_number || null,
    hired_at: formData.hired_at || null,
  }).eq('id', id)
  if (error) return { error: `Failed to update member: ${error.message}` }

  if (formData.display_name) {
    await supabase.from('user_profiles').update({ display_name: formData.display_name }).eq('id', member.user_id)
  }

  revalidatePath('/app/system/users')
  return { error: '' }
}

export async function deactivateMember(id: string): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('organization_members').update({
    employment_status: 'inactive',
  }).eq('id', id)
  if (error) return { error: `Failed to deactivate member: ${error.message}` }
  revalidatePath('/app/system/users')
  return { error: '' }
}
