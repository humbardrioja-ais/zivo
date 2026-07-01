import { createClient } from '@/lib/supabase/server'
import { getOrgId } from '@/lib/supabase/get-org-id'

/**
 * The authenticated actor's workflow context. Every workflow service resolves
 * this first so all data is correctly scoped to the current user and org.
 */
export interface WorkflowContext {
  userId: string
  organizationId: string
  memberId: string | null
  displayName: string
}

export async function getWorkflowContext(): Promise<WorkflowContext> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const organizationId = await getOrgId()

  const { data: member } = await supabase
    .from('organization_members')
    .select('id')
    .eq('organization_id', organizationId)
    .eq('user_id', user.id)
    .limit(1)
    .single()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  const displayName =
    profile?.display_name?.trim() ||
    user.email?.split('@')[0] ||
    'there'

  return {
    userId: user.id,
    organizationId,
    memberId: member?.id ?? null,
    displayName,
  }
}
