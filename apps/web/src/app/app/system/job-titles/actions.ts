'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getOrgId } from '@/lib/supabase/get-org-id'

export type JobTitle = {
  id: string
  organization_id: string
  department_id: string | null
  title: string
  code: string | null
  description: string | null
  status: string
  created_at: string
  updated_at: string
}

export async function getJobTitles(): Promise<JobTitle[]> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { data, error } = await supabase.from('job_titles').select('*').eq('organization_id', orgId).order('title')
  if (error) throw new Error(`Failed to load job titles: ${error.message}`)
  return (data ?? []) as JobTitle[]
}

export async function createJobTitle(formData: {
  title: string; code: string; department_id: string; description: string; status: string
}): Promise<{ error: string }> {
  const supabase = await createClient()
  const orgId = await getOrgId()
  const { error } = await supabase.from('job_titles').insert({
    organization_id: orgId, title: formData.title, code: formData.code || null,
    department_id: formData.department_id || null, description: formData.description || null,
    status: formData.status,
  })
  if (error) return { error: `Failed to create job title: ${error.message}` }
  revalidatePath('/app/system/job-titles')
  return { error: '' }
}

export async function updateJobTitle(id: string, formData: {
  title: string; code: string; department_id: string; description: string; status: string
}): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('job_titles').update({
    title: formData.title, code: formData.code || null,
    department_id: formData.department_id || null, description: formData.description || null,
    status: formData.status,
  }).eq('id', id)
  if (error) return { error: `Failed to update job title: ${error.message}` }
  revalidatePath('/app/system/job-titles')
  return { error: '' }
}

export async function deleteJobTitle(id: string): Promise<{ error: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('job_titles').delete().eq('id', id)
  if (error) return { error: `Failed to delete job title: ${error.message}` }
  revalidatePath('/app/system/job-titles')
  return { error: '' }
}
