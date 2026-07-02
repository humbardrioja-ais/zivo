'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { PageLayout } from '@/components/shared/page-layout'
import { cn } from '@/lib/utils'
import { MembersTab } from './members-tab'
import { AreasTab } from './areas-tab'
import type { Project, ProjectMember, ProjectArea } from '../actions'
import type { OrgMemberOption } from '@/lib/workflow/members'

interface Props {
  project: Project
  initialMembers: ProjectMember[]
  initialAreas: ProjectArea[]
  orgMembers: OrgMemberOption[]
}

const TABS = ['Overview', 'Members', 'Areas', 'Files', 'Activity'] as const
type Tab = (typeof TABS)[number]

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="text-sm">{value}</div>
    </div>
  )
}

export function ProjectDetail({ project, initialMembers, initialAreas, orgMembers }: Props) {
  const [tab, setTab] = useState<Tab>('Overview')

  const leadName = project.lead_id
    ? orgMembers.find((m) => m.id === project.lead_id)?.displayName ?? '—'
    : '—'

  return (
    <PageLayout>
      <div className="space-y-4">
        <Link href="/app/workspaces/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Projects
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            {project.code && <span className="font-mono text-sm text-muted-foreground">{project.code}</span>}
          </div>
          <StatusBadge status={project.status} />
        </div>
      </div>

      <div className="border-b">
        <nav className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'relative px-3 py-2 text-sm font-medium transition-colors',
                tab === t ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t}
              {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />}
            </button>
          ))}
        </nav>
      </div>

      {tab === 'Overview' && (
        <Card>
          <CardContent className="space-y-6 pt-6">
            {project.description && <p className="text-sm">{project.description}</p>}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Status" value={<StatusBadge status={project.status} />} />
              <Field label="Lead" value={leadName} />
              <Field label="Start Date" value={project.start_date || '—'} />
              <Field label="Due Date" value={project.due_date || '—'} />
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'Members' && (
        <MembersTab projectId={project.id} initial={initialMembers} orgMembers={orgMembers} />
      )}

      {tab === 'Areas' && <AreasTab projectId={project.id} initial={initialAreas} />}

      {tab === 'Files' && (
        <EmptyState icon={FileText} title="Files coming soon" description="File attachments for this project will appear here." />
      )}

      {tab === 'Activity' && (
        <EmptyState icon={Activity} title="Activity coming soon" description="A timeline of changes to this project will appear here." />
      )}
    </PageLayout>
  )
}
