'use client'

import {
  Home,
  Star,
  LayoutGrid,
  Calendar,
  Video,
  Inbox,
  Bell,
  Sparkles,
  ShieldCheck,
  FolderKanban,
  CheckSquare,
  Users,
  Landmark,
  DollarSign,
  FileBox,
  BarChart3,
  ChevronRight,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { OrgSwitcher } from './org-switcher'
import { SidebarUser } from './sidebar-user'

const mainNav = [
  { title: 'Home', icon: Home, href: '/app' },
  { title: 'Favorites', icon: Star, href: '/app/favorites' },
]

const workspaceModules = [
  { title: 'Projects', icon: FolderKanban, href: '/app/workspaces/projects' },
  { title: 'Tasks', icon: CheckSquare, href: '/app/workspaces/tasks' },
  { title: 'CRM', icon: Users, href: '/app/workspaces/crm' },
  { title: 'HR', icon: Landmark, href: '/app/workspaces/hr' },
  { title: 'Finance', icon: DollarSign, href: '/app/workspaces/finance' },
  { title: 'Files', icon: FileBox, href: '/app/workspaces/files' },
  { title: 'Dashboards', icon: BarChart3, href: '/app/workspaces/dashboards' },
]

const toolsNav = [
  { title: 'Calendar', icon: Calendar, href: '/app/calendar' },
  { title: 'Meetings', icon: Video, href: '/app/meetings' },
  { title: 'Inbox', icon: Inbox, href: '/app/inbox' },
  { title: 'Notifications', icon: Bell, href: '/app/notifications' },
  { title: 'AI Assistant', icon: Sparkles, href: '/app/ai' },
]

const adminNav = [
  { title: 'Administration', icon: ShieldCheck, href: '/app/admin' },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<a href={item.href} />}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/workspaces">
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={<SidebarMenuButton tooltip="Workspaces" />}
                  >
                    <LayoutGrid />
                    <span>All Workspaces</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/workspaces:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {workspaceModules.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton render={<a href={item.href} />}>
                            <item.icon />
                            <span>{item.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<a href={item.href} />}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<a href={item.href} />}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
