'use server'

import { createClient } from '@/lib/supabase/server'

export type OrganizationProfile = {
  id: string
  name: string
  slug: string
  legal_name: string | null
  description: string | null
  logo_url: string | null
  primary_color: string | null
  secondary_color: string | null
  email: string | null
  phone: string | null
  website: string | null
  country: string | null
  timezone: string | null
  language: string | null
  currency: string | null
  date_format: string | null
  time_format: string | null
  address: string | null
}

export async function getOrganization(): Promise<OrganizationProfile> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (membership) {
    const { data } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', membership.organization_id)
      .single()

    if (data) return data as OrganizationProfile
  }

  const slug = `org-${user.id.slice(0, 8)}`

  const { error: insertError } = await supabase
    .from('organizations')
    .insert({ name: 'My Organization', slug })

  if (insertError && insertError.code !== '23505') {
    throw new Error(`Failed to create organization: ${insertError.code} — ${insertError.message}`)
  }

  const { error: rpcError } = await supabase.rpc('bootstrap_organization_member', {
    p_slug: slug,
    p_user_id: user.id,
  })

  if (rpcError) {
    throw new Error(`Failed to bootstrap membership: ${rpcError.code} — ${rpcError.message}`)
  }

  const { data: org, error: selectError } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (selectError || !org) {
    throw new Error(`Organization created but could not be read: ${selectError?.code} — ${selectError?.message}`)
  }

  return org as OrganizationProfile
}

export async function saveOrganization(
  id: string,
  data: Partial<Omit<OrganizationProfile, 'id' | 'slug'>>,
): Promise<{ error: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('organizations')
    .update(data)
    .eq('id', id)

  if (error) return { error: 'Failed to save changes.' }

  return { error: '' }
}
