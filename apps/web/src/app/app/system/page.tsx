import {
  Building2,
  MapPin,
  Network,
  Users,
  Shield,
  Lock,
  Briefcase,
  UserCog,
  Settings,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLayout } from '@/components/shared/page-layout'
import { PageHeader } from '@/components/shared/page-header'

const sections = [
  { title: 'Organization', description: 'Company profile and branding', icon: Building2, href: '/app/system/organization' },
  { title: 'Branches', description: 'Locations and offices', icon: MapPin, href: '/app/system/branches' },
  { title: 'Departments', description: 'Organizational structure', icon: Network, href: '/app/system/departments' },
  { title: 'Job Titles', description: 'Position catalog', icon: Briefcase, href: '/app/system/job-titles' },
  { title: 'Employment Types', description: 'Full-time, part-time, contract', icon: UserCog, href: '/app/system/employment-types' },
  { title: 'Users', description: 'Member assignments and access', icon: Users, href: '/app/system/users' },
  { title: 'Roles', description: 'Role definitions and hierarchy', icon: Shield, href: '/app/system/roles' },
  { title: 'Permissions', description: 'Access control policies', icon: Lock, href: '/app/system/permissions' },
  { title: 'System Settings', description: 'Platform configuration', icon: Settings, href: '/app/system/settings' },
]

export const metadata = { title: 'System — Zivo OS' }

export default function SystemPage() {
  return (
    <PageLayout>
      <PageHeader
        title="System"
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
