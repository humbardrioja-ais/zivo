import {
  Building2,
  Network,
  Users,
  Shield,
  Lock,
  Briefcase,
  Settings,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'

const sections = [
  { title: 'Organization', description: 'Company profile and branding', icon: Building2, href: '/app/admin/organization' },
  { title: 'Departments', description: 'Organizational structure', icon: Network, href: '/app/admin/departments' },
  { title: 'Users', description: 'User accounts and access', icon: Users, href: '/app/admin/users' },
  { title: 'Roles', description: 'Role definitions', icon: Shield, href: '/app/admin/roles' },
  { title: 'Permissions', description: 'Access control policies', icon: Lock, href: '/app/admin/permissions' },
  { title: 'Job Titles', description: 'Position catalog', icon: Briefcase, href: '/app/admin/job-titles' },
  { title: 'System Settings', description: 'Platform configuration', icon: Settings, href: '/app/admin/settings' },
]

export const metadata = { title: 'Administration — Zivo OS' }

export default function AdminPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Administration"
        description="Manage your organization, users, roles, and system configuration."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <a key={section.title} href={section.href}>
            <Card className="h-full transition-colors hover:border-primary/30">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <section.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-sm font-semibold">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </PageLayout>
  )
}
