import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { PermissionsMatrix } from './permissions-matrix'
import { getPermissionGroups } from './actions'
import { getRoles } from '../roles/actions'

export const metadata = { title: 'Permissions — System — Zivo OS' }

export default async function PermissionsPage() {
  const [permissionGroups, roles] = await Promise.all([getPermissionGroups(), getRoles()])

  return (
    <PageLayout>
      <PageHeader title="Permissions" description="View permission assignments across all roles." />
      <PermissionsMatrix permissionGroups={permissionGroups} roles={roles} />
    </PageLayout>
  )
}
