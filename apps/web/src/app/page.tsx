import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'

const statusCards = [
  {
    title: 'Version',
    value: 'v0.1.0',
    description: 'Initial release',
    status: 'stable' as const,
  },
  {
    title: 'Architecture',
    value: 'Initialized',
    description: 'DDD monorepo structure',
    status: 'active' as const,
  },
  {
    title: 'Repository',
    value: 'Healthy',
    description: 'All systems operational',
    status: 'active' as const,
  },
  {
    title: 'Environment',
    value: 'Development',
    description: 'Local development mode',
    status: 'development' as const,
  },
]

const techStack = [
  { category: 'Framework', items: ['Next.js', 'React 19', 'TypeScript'] },
  { category: 'Styling', items: ['Tailwind CSS v4', 'shadcn/ui'] },
  { category: 'State & Data', items: ['Zustand', 'TanStack Query'] },
  { category: 'Forms', items: ['React Hook Form', 'Zod'] },
  { category: 'Quality', items: ['ESLint', 'Prettier'] },
]

const statusColor = {
  stable: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  development: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
}

export default function Page() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              Z
            </div>
            <span className="text-lg font-semibold tracking-tight">Zivo OS</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Zivo OS</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Enterprise Modular Digital Workspace
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Badge variant="secondary" className="font-mono text-xs">
              v0.1.0
            </Badge>
            <Badge variant="outline" className="text-xs">
              Next.js {'>'}= 16
            </Badge>
            <Badge variant="outline" className="text-xs">
              TypeScript
            </Badge>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            System Status
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statusCards.map((card) => (
              <Card key={card.title} className="transition-colors hover:border-primary/30">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor[card.status]}`}
                  >
                    {card.status}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Tech Stack
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                {techStack.map((group) => (
                  <div key={group.category}>
                    <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {group.category}
                    </h3>
                    <ul className="space-y-1">
                      {group.items.map((item) => (
                        <li key={item} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-muted-foreground">
          Zivo OS &middot; Enterprise Modular Digital Workspace &middot; v0.1.0
        </div>
      </footer>
    </div>
  )
}
