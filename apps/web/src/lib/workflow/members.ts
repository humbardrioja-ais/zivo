'use server'

import { createClient } from '@/lib/supabase/server'
import { getOrgId } from '@/lib/supabase/get-org-id'

export type OrgMemberOption = {
  id: string
  displayName: string
}

/**
 * Shared reader for the current org's members — used by any module that
 * assigns work to people (Projects, Tasks, CRM, HR, …). Returns active
 * members with a resolved display name, sorted for pickers.
 */
export async function getOrgMembers(): Promise<OrgMemberOption[]> {
  const supabase = await createClient()
  const orgId = await getOrgId()

  const { data, error } = await supabase
    .from('organization_members')
    .select('id, employee_number, user_profiles(display_name)')
    .eq('organization_id', orgId)

  if (error) return []

  return (data ?? [])
    .map((m: Record<string, unknown>) => {
      const profile = m.user_profiles as Record<string, unknown> | null
      const name = (profile?.display_name as string | null)?.trim()
      return {
        id: m.id as string,
        displayName: name || (m.employee_number as string | null) || 'Member',
      }
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
}
