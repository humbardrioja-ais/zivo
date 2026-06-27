import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { OrganizationForm } from './organization-form'

export const metadata = { title: 'Organization — System — Zivo OS' }

export default function OrganizationPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Organization"
        description="Manage your company profile, branding, and general information."
      />
      <OrganizationForm />
    </PageLayout>
  )
}
