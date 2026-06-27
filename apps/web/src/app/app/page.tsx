export const metadata = {
  title: 'Dashboard — Zivo OS',
}

export default function DashboardPage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Business modules will appear here.
        </p>
      </div>
    </div>
  )
}
