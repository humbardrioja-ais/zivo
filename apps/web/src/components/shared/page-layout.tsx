interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return <div className="flex flex-1 flex-col gap-6">{children}</div>
}
