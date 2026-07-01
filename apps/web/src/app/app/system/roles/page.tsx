import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'
import { RolesTable } from './roles-table'
import { getRoles } from './actions'
import { getPermissionGroups } from '../permissions/actions'

export const metadata = { title: 'Roles — System — Zivo OS' }

export default async function RolesPage() {
  const [roles, permissionGroups] = await Promise.all([getRoles(), getPermissionGroups()])

  return (
    <PageLayout>
      <PageHeader title="Roles" description="Define roles and their associated permission sets." />
      <RolesTable initial={roles} permissionGroups={permissionGroups} />
    </PageLayout>
  )
}
