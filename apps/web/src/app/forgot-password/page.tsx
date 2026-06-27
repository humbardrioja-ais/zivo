import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ForgotForm } from './forgot-form'

export const metadata = {
  title: 'Reset Password — Zivo OS',
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            Z
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Zivo OS</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Reset your password</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
