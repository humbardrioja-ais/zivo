'use server'

import { createClient } from '@/lib/supabase/server'
import { getOrgId } from '@/lib/supabase/get-org-id'

export type OrgMemberOption = {
  id: string
  displayName: string
  jobTitle: string | null
  department: string | null
  initials: string
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Shared reader for the current org's members — used by any module that
 * assigns work to people (Projects, Tasks, CRM, HR, …).
 *
 * job_titles and departments have declared FKs from organization_members, so
 * they embed directly. user_profiles shares no FK with organization_members
 * (both only reference auth.users), so display names are resolved separately.
 */
export async function getOrgMembers(): Promise<OrgMemberOption[]> {
  const supabase = await createClient()
  const orgId = await getOrgId()

  const { data: members, error } = await supabase
    .from('organization_members')
    .select('id, user_id, employee_number, job_titles(title), departments(name)')
    .eq('organization_id', orgId)

  if (error || !members) return []

  const userIds = members.map((m: Record<string, unknown>) => m.user_id as string)
  const nameByUser: Record<string, string> = {}
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('id, display_name')
      .in('id', userIds)
    for (const p of profiles ?? []) {
      const name = (p.display_name as string | null)?.trim()
      if (name) nameByUser[p.id as string] = name
    }
  }

  return members
    .map((m: Record<string, unknown>) => {
      const jt = m.job_titles as Record<string, unknown> | null
      const dept = m.departments as Record<string, unknown> | null
      const displayName =
        nameByUser[m.user_id as string] ||
        (m.employee_number as string | null) ||
        'Member'
      return {
        id: m.id as string,
        displayName,
        jobTitle: (jt?.title as string | null) ?? null,
        department: (dept?.name as string | null) ?? null,
        initials: initialsOf(displayName),
      }
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
}
