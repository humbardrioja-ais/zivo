import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { OrganizationForm } from './organization-form'
import { getOrganization } from './actions'

export const metadata = { title: 'Organization — System — Zivo OS' }

export default async function OrganizationPage() {
  const org = await getOrganization()

  return (
    <PageLayout>
      <PageHeader
        title="Organization"
        description="Manage your company profile, branding, and general information."
      />
      <OrganizationForm organization={org} />
    </PageLayout>
  )
}
